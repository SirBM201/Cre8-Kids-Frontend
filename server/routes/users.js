import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireRole } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all kid profiles for a parent
router.get('/kids', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    if (req.user.role === 'parent') {
      const kids = await db.all(`
        SELECT * FROM kid_profiles 
        WHERE parent_id = ? 
        ORDER BY created_at DESC
      `, [req.user.userId]);
      
      res.json({ kids });
    } else if (req.user.role === 'admin') {
      const kids = await db.all(`
        SELECT kp.*, u.display_name as parent_name 
        FROM kid_profiles kp 
        JOIN users u ON kp.parent_id = u.id 
        ORDER BY kp.created_at DESC
      `);
      
      res.json({ kids });
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error('Error fetching kids:', error);
    res.status(500).json({ error: 'Failed to fetch kids' });
  }
});

// Create new kid profile
router.post('/kids', [
  authenticateToken,
  requireRole(['parent']),
  body('displayName').trim().isLength({ min: 1, max: 50 }),
  body('age').isInt({ min: 1, max: 18 }),
  body('avatarColor').optional().isHexColor(),
  body('learningLevel').optional().isIn(['beginner', 'intermediate', 'advanced'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { displayName, age, avatarColor = '#3b82f6', learningLevel = 'beginner' } = req.body;
    const db = getDatabase();

    const kidId = uuidv4();
    await db.run(`
      INSERT INTO kid_profiles (id, parent_id, display_name, age, avatar_color, learning_level)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [kidId, req.user.userId, displayName, age, avatarColor, learningLevel]);

    const newKid = await db.get('SELECT * FROM kid_profiles WHERE id = ?', [kidId]);

    res.status(201).json({
      message: 'Kid profile created successfully',
      kid: newKid
    });

  } catch (error) {
    console.error('Error creating kid profile:', error);
    res.status(500).json({ error: 'Failed to create kid profile' });
  }
});

// Update kid profile
router.put('/kids/:kidId', [
  authenticateToken,
  requireRole(['parent']),
  body('displayName').optional().trim().isLength({ min: 1, max: 50 }),
  body('age').optional().isInt({ min: 1, max: 18 }),
  body('avatarColor').optional().isHexColor(),
  body('learningLevel').optional().isIn(['beginner', 'intermediate', 'advanced'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { kidId } = req.params;
    const updates = req.body;
    const db = getDatabase();

    // Verify ownership
    const kid = await db.get(`
      SELECT * FROM kid_profiles 
      WHERE id = ? AND parent_id = ?
    `, [kidId, req.user.userId]);

    if (!kid) {
      return res.status(404).json({ error: 'Kid profile not found' });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(kidId);

    await db.run(`
      UPDATE kid_profiles 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    const updatedKid = await db.get('SELECT * FROM kid_profiles WHERE id = ?', [kidId]);

    res.json({
      message: 'Kid profile updated successfully',
      kid: updatedKid
    });

  } catch (error) {
    console.error('Error updating kid profile:', error);
    res.status(500).json({ error: 'Failed to update kid profile' });
  }
});

// Delete kid profile
router.delete('/kids/:kidId', [
  authenticateToken,
  requireRole(['parent'])
], async (req, res) => {
  try {
    const { kidId } = req.params;
    const db = getDatabase();

    // Verify ownership
    const kid = await db.get(`
      SELECT * FROM kid_profiles 
      WHERE id = ? AND parent_id = ?
    `, [kidId, req.user.userId]);

    if (!kid) {
      return res.status(404).json({ error: 'Kid profile not found' });
    }

    // Delete kid profile (cascading will handle related data)
    await db.run('DELETE FROM kid_profiles WHERE id = ?', [kidId]);

    res.json({ message: 'Kid profile deleted successfully' });

  } catch (error) {
    console.error('Error deleting kid profile:', error);
    res.status(500).json({ error: 'Failed to delete kid profile' });
  }
});

// Get parent settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    if (req.user.role === 'parent') {
      const settings = await db.get(`
        SELECT * FROM parent_settings 
        WHERE parent_id = ?
      `, [req.user.userId]);
      
      if (!settings) {
        // Create default settings if none exist
        const settingsId = uuidv4();
        await db.run(`
          INSERT INTO parent_settings (id, parent_id, daily_learning_minutes, fun_unlock_minutes)
          VALUES (?, ?, ?, ?)
        `, [settingsId, req.user.userId, 30, 15]);
        
        const newSettings = await db.get('SELECT * FROM parent_settings WHERE id = ?', [settingsId]);
        res.json({ settings: newSettings });
      } else {
        res.json({ settings });
      }
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update parent settings
router.put('/settings', [
  authenticateToken,
  requireRole(['parent']),
  body('dailyLearningMinutes').optional().isInt({ min: 5, max: 180 }),
  body('funUnlockMinutes').optional().isInt({ min: 5, max: 120 }),
  body('contentFilters').optional().isArray(),
  body('screenTimeLimits').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const db = getDatabase();

    // Get current settings
    let settings = await db.get(`
      SELECT * FROM parent_settings 
      WHERE parent_id = ?
    `, [req.user.userId]);

    if (!settings) {
      // Create settings if none exist
      const settingsId = uuidv4();
      await db.run(`
        INSERT INTO parent_settings (id, parent_id, daily_learning_minutes, fun_unlock_minutes)
        VALUES (?, ?, ?, ?)
      `, [settingsId, req.user.userId, 30, 15]);
      
      settings = await db.get('SELECT * FROM parent_settings WHERE id = ?', [settingsId]);
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];
    
    if (updates.dailyLearningMinutes !== undefined) {
      updateFields.push('daily_learning_minutes = ?');
      updateValues.push(updates.dailyLearningMinutes);
    }
    
    if (updates.funUnlockMinutes !== undefined) {
      updateFields.push('fun_unlock_minutes = ?');
      updateValues.push(updates.funUnlockMinutes);
    }
    
    if (updates.contentFilters !== undefined) {
      updateFields.push('content_filters = ?');
      updateValues.push(JSON.stringify(updates.contentFilters));
    }
    
    if (updates.screenTimeLimits !== undefined) {
      updateFields.push('screen_time_limits = ?');
      updateValues.push(JSON.stringify(updates.screenTimeLimits));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(settings.id);

    await db.run(`
      UPDATE parent_settings 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    const updatedSettings = await db.get('SELECT * FROM parent_settings WHERE id = ?', [settings.id]);

    res.json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    const user = await db.get(`
      SELECT id, email, role, display_name, created_at 
      FROM users 
      WHERE id = ?
    `, [req.user.userId]);

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
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', [
  authenticateToken,
  body('displayName').optional().trim().isLength({ min: 2, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { displayName } = req.body;
    const db = getDatabase();

    if (displayName) {
      await db.run(`
        UPDATE users 
        SET display_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [displayName, req.user.userId]);
    }

    const updatedUser = await db.get(`
      SELECT id, email, role, display_name, created_at 
      FROM users 
      WHERE id = ?
    `, [req.user.userId]);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    if (req.user.role === 'parent') {
      // Get kid profiles and their progress
      const kids = await db.all('SELECT * FROM kid_profiles WHERE parent_id = ?', [req.user.userId]);
      
      const kidsWithStats = await Promise.all(kids.map(async (kid) => {
        // Get total learning minutes
        const totalMinutes = await db.get(`
          SELECT SUM(learning_minutes) as total 
          FROM learning_progress 
          WHERE child_id = ?
        `, [kid.id]);

        // Get total stories read
        const totalStories = await db.get(`
          SELECT COUNT(DISTINCT sp.story_id) as total 
          FROM learning_progress lp 
          JOIN story_pages sp ON JSON_EXTRACT(lp.completed_items, '$[*].storyId') LIKE '%' || sp.story_id || '%'
          WHERE lp.child_id = ?
        `, [kid.id]);

        // Get total quizzes completed
        const totalQuizzes = await db.get(`
          SELECT COUNT(*) as total 
          FROM learning_progress lp 
          WHERE lp.child_id = ? AND lp.quiz_scores != '{}'
        `, [kid.id]);

        return {
          ...kid,
          stats: {
            totalLearningMinutes: totalMinutes.total || 0,
            totalStoriesRead: totalStories.total || 0,
            totalQuizzesCompleted: totalQuizzes.total || 0
          }
        };
      }));

      res.json({ kids: kidsWithStats });
    } else {
      res.status(403).json({ error: 'Access denied' });
    }

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
