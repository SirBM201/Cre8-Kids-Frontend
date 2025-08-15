import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { v4 as uuidv4 } from 'uuid';
import { 
  generateVerificationToken, 
  generatePasswordResetToken,
  sendVerificationEmail, 
  sendPasswordResetEmail,
  sendWelcomeEmail 
} from '../services/emailService.js';

const router = express.Router();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'cre8kids-super-secret-key-change-in-production';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user has required role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('displayName').trim().isLength({ min: 2 }),
  body('role').isIn(['parent', 'educator'])
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, displayName, role } = req.body;
    const db = getDatabase();

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const userId = uuidv4();
    await db.run(`
      INSERT INTO users (id, email, password_hash, role, display_name, email_verification_token, email_verification_expires)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, email, passwordHash, role, displayName, verificationToken, verificationExpires.toISOString()]);

    // Create default settings for parents
    if (role === 'parent') {
      const settingsId = uuidv4();
      await db.run(`
        INSERT INTO parent_settings (id, parent_id, daily_learning_minutes, fun_unlock_minutes)
        VALUES (?, ?, ?, ?)
      `, [settingsId, userId, 30, 15]);
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken, displayName);
    
    if (!emailResult.success) {
      console.warn('Failed to send verification email:', emailResult.error);
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: userId,
        email,
        role,
        displayName,
        emailVerified: false
      },
      requiresVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const db = getDatabase();

    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified (temporarily disabled for testing)
    // if (!user.email_verified) {
    //   return res.status(401).json({ 
    //     error: 'Please verify your email address before logging in. Check your inbox for a verification link.',
    //     requiresVerification: true 
    //   });
    // }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role, 
        displayName: user.display_name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.display_name
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const user = await db.get('SELECT id, email, role, display_name, created_at FROM users WHERE id = ?', [req.user.userId]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get additional data based on role
    let additionalData = {};
    
    if (user.role === 'parent') {
      // Get kid profiles
      const kids = await db.all('SELECT * FROM kid_profiles WHERE parent_id = ?', [user.id]);
      additionalData.kids = kids;
      
      // Get parent settings
      const settings = await db.get('SELECT * FROM parent_settings WHERE parent_id = ?', [user.id]);
      additionalData.settings = settings;
    }

    res.json({
      user: { ...user, ...additionalData }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Change password
router.post('/change-password', [
  authenticateToken,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const db = getDatabase();

    // Get current user
    const user = await db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, req.user.userId]);

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const user = await db.get('SELECT id, email, role, display_name FROM users WHERE id = ?', [req.user.userId]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new token
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role, 
        displayName: user.display_name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Logout (client-side token removal, but we can track here if needed)
router.post('/logout', authenticateToken, async (req, res) => {
  // In a real app, you might want to add the token to a blacklist
  // For now, just return success
  res.json({ message: 'Logged out successfully' });
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const db = getDatabase();

    // Find user with this verification token
    const user = await db.get(`
      SELECT id, email, display_name, email_verification_expires 
      FROM users 
      WHERE email_verification_token = ? AND email_verified = 0
    `, [token]);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Check if token is expired
    if (new Date() > new Date(user.email_verification_expires)) {
      return res.status(400).json({ error: 'Verification token has expired. Please request a new one.' });
    }

    // Mark email as verified
    await db.run(`
      UPDATE users 
      SET email_verified = 1, email_verification_token = NULL, email_verification_expires = NULL 
      WHERE id = ?
    `, [user.id]);

    // Send welcome email
    const emailResult = await sendWelcomeEmail(user.email, user.display_name);
    if (!emailResult.success) {
      console.warn('Failed to send welcome email:', emailResult.error);
    }

    res.json({ 
      message: 'Email verified successfully! Welcome to Cre8 Kids!',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// Resend verification email
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const db = getDatabase();

    // Find user
    const user = await db.get(`
      SELECT id, display_name, email_verified, email_verification_token, email_verification_expires
      FROM users 
      WHERE email = ?
    `, [email]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Check if previous token is still valid
    if (user.email_verification_token && user.email_verification_expires && new Date() < new Date(user.email_verification_expires)) {
      return res.status(400).json({ error: 'Please wait before requesting another verification email' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await db.run(`
      UPDATE users 
      SET email_verification_token = ?, email_verification_expires = ?
      WHERE id = ?
    `, [verificationToken, verificationExpires.toISOString(), user.id]);

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken, user.display_name);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({ message: 'Verification email sent successfully. Please check your inbox.' });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const db = getDatabase();

    // Find user
    const user = await db.get('SELECT id, display_name FROM users WHERE email = ?', [email]);
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await db.run(`
      UPDATE users 
      SET password_reset_token = ?, password_reset_expires = ?
      WHERE id = ?
    `, [resetToken, resetExpires.toISOString(), user.id]);

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.display_name);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send password reset email' });
    }

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;
    const db = getDatabase();

    // Find user with this reset token
    const user = await db.get(`
      SELECT id, password_reset_expires 
      FROM users 
      WHERE password_reset_token = ?
    `, [token]);

    if (!user) {
      return res.status(400).json({ error: 'Invalid password reset token' });
    }

    // Check if token is expired
    if (new Date() > new Date(user.password_reset_expires)) {
      return res.status(400).json({ error: 'Password reset token has expired. Please request a new one.' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    await db.run(`
      UPDATE users 
      SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL 
      WHERE id = ?
    `, [newPasswordHash, user.id]);

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
