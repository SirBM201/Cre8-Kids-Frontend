import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { authenticateToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get learning progress for a child
router.get('/:childId', [
  authenticateToken,
  body('date').optional().isDate()
], async (req, res) => {
  try {
    const { childId } = req.params;
    const { date } = req.query;
    const db = getDatabase();

    // Verify the child belongs to the authenticated user
    const child = await db.get(`
      SELECT kp.*, u.role 
      FROM kid_profiles kp 
      JOIN users u ON kp.parent_id = u.id 
      WHERE kp.id = ? AND (kp.parent_id = ? OR u.role = 'admin')
    `, [childId, req.user.userId]);

    if (!child) {
      return res.status(404).json({ error: 'Child not found or access denied' });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const progress = await db.get(`
      SELECT * FROM learning_progress 
      WHERE child_id = ? AND date = ?
    `, [childId, targetDate]);

    if (!progress) {
      // Return empty progress for new dates
      res.json({
        progress: {
          childId,
          date: targetDate,
          learningMinutes: 0,
          completedItems: [],
          quizScores: {},
          streakCount: 0,
          badgesEarned: []
        }
      });
      return;
    }

    res.json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update learning progress
router.post('/:childId/update', [
  authenticateToken,
  body('learningMinutes').isInt({ min: 0 }),
  body('completedItems').optional().isArray(),
  body('quizScores').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { childId } = req.params;
    const { learningMinutes, completedItems = [], quizScores = {} } = req.body;
    const db = getDatabase();

    // Verify the child belongs to the authenticated user
    const child = await db.get(`
      SELECT kp.*, u.role 
      FROM kid_profiles kp 
      JOIN users u ON kp.parent_id = u.id 
      WHERE kp.id = ? AND (kp.parent_id = ? OR u.role = 'admin')
    `, [childId, req.user.userId]);

    if (!child) {
      return res.status(404).json({ error: 'Child not found or access denied' });
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    // Get existing progress or create new
    let progress = await db.get(`
      SELECT * FROM learning_progress 
      WHERE child_id = ? AND date = ?
    `, [childId, currentDate]);

    if (progress) {
      // Update existing progress
      const updatedCompletedItems = [...JSON.parse(progress.completed_items || '[]'), ...completedItems];
      const updatedQuizScores = { ...JSON.parse(progress.quiz_scores || '{}'), ...quizScores };
      
      await db.run(`
        UPDATE learning_progress 
        SET learning_minutes = learning_minutes + ?, 
            completed_items = ?, 
            quiz_scores = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [learningMinutes, JSON.stringify(updatedCompletedItems), JSON.stringify(updatedQuizScores), progress.id]);
    } else {
      // Create new progress
      const progressId = uuidv4();
      await db.run(`
        INSERT INTO learning_progress (id, child_id, date, learning_minutes, completed_items, quiz_scores)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [progressId, childId, currentDate, learningMinutes, JSON.stringify(completedItems), JSON.stringify(quizScores)]);
    }

    // Check for badges
    await checkAndAwardBadges(childId, db);

    res.json({ 
      message: 'Progress updated successfully',
      learningMinutes: (progress?.learning_minutes || 0) + learningMinutes
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Submit quiz results
router.post('/:childId/quiz-results', [
  authenticateToken,
  body('quizId').notEmpty(),
  body('score').isInt({ min: 0 }),
  body('totalQuestions').isInt({ min: 1 }),
  body('timeSpent').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { childId } = req.params;
    const { quizId, score, totalQuestions, timeSpent } = req.body;
    const db = getDatabase();

    // Verify the child belongs to the authenticated user
    const child = await db.get(`
      SELECT kp.*, u.role 
      FROM kid_profiles kp 
      JOIN users u ON kp.parent_id = u.id 
      WHERE kp.id = ? AND (kp.parent_id = ? OR u.role = 'admin')
    `, [childId, req.user.userId]);

    if (!child) {
      return res.status(404).json({ error: 'Child not found or access denied' });
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Get or create progress for today
    let progress = await db.get(`
      SELECT * FROM learning_progress 
      WHERE child_id = ? AND date = ?
    `, [childId, currentDate]);

    if (progress) {
      // Update existing progress
      const quizScores = JSON.parse(progress.quiz_scores || '{}');
      quizScores[quizId] = { score, totalQuestions, percentage, timeSpent, date: currentDate };
      
      await db.run(`
        UPDATE learning_progress 
        SET quiz_scores = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [JSON.stringify(quizScores), progress.id]);
    } else {
      // Create new progress
      const progressId = uuidv4();
      const quizScores = { [quizId]: { score, totalQuestions, percentage, timeSpent, date: currentDate } };
      
      await db.run(`
        INSERT INTO learning_progress (id, child_id, date, quiz_scores)
        VALUES (?, ?, ?, ?)
      `, [progressId, childId, currentDate, JSON.stringify(quizScores)]);
    }

    // Check for badges
    await checkAndAwardBadges(childId, db);

    res.json({ 
      message: 'Quiz results recorded successfully',
      score: percentage,
      badgeEarned: null // Will be populated if badge is earned
    });

  } catch (error) {
    console.error('Error recording quiz results:', error);
    res.status(500).json({ error: 'Failed to record quiz results' });
  }
});

// Get learning streak for a child
router.get('/:childId/streak', authenticateToken, async (req, res) => {
  try {
    const { childId } = req.params;
    const db = getDatabase();

    // Verify the child belongs to the authenticated user
    const child = await db.get(`
      SELECT kp.*, u.role 
      FROM kid_profiles kp 
      JOIN users u ON kp.parent_id = u.id 
      WHERE kp.id = ? AND (kp.parent_id = ? OR u.role = 'admin')
    `, [childId, req.user.userId]);

    if (!child) {
      return res.status(404).json({ error: 'Child not found or access denied' });
    }

    // Get last 30 days of progress
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const progress = await db.all(`
      SELECT date, learning_minutes 
      FROM learning_progress 
      WHERE child_id = ? AND date >= ? 
      ORDER BY date DESC
    `, [childId, thirtyDaysAgo.toISOString().split('T')[0]]);

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayProgress = progress.find(p => p.date === dateStr);
      
      if (dayProgress && dayProgress.learning_minutes > 0) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    res.json({
      currentStreak,
      longestStreak,
      last30Days: progress.length,
      totalLearningMinutes: progress.reduce((sum, p) => sum + p.learning_minutes, 0)
    });

  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({ error: 'Failed to fetch streak' });
  }
});

// Get badges for a child
router.get('/:childId/badges', authenticateToken, async (req, res) => {
  try {
    const { childId } = req.params;
    const db = getDatabase();

    // Verify the child belongs to the authenticated user
    const child = await db.get(`
      SELECT kp.*, u.role 
      FROM kid_profiles kp 
      JOIN users u ON kp.parent_id = u.id 
      WHERE kp.id = ? AND (kp.parent_id = ? OR u.role = 'admin')
    `, [childId, req.user.userId]);

    if (!child) {
      return res.status(404).json({ error: 'Child not found or access denied' });
    }

    // Get all badges
    const allBadges = await db.all('SELECT * FROM badges ORDER BY created_at');
    
    // Get child's earned badges
    const progress = await db.get(`
      SELECT badges_earned FROM learning_progress 
      WHERE child_id = ? AND date = ?
    `, [childId, new Date().toISOString().split('T')[0]]);

    const earnedBadgeIds = progress ? JSON.parse(progress.badges_earned || '[]') : [];

    // Mark earned badges
    const badges = allBadges.map(badge => ({
      ...badge,
      earned: earnedBadgeIds.includes(badge.id),
      earnedDate: earnedBadgeIds.includes(badge.id) ? new Date().toISOString() : null
    }));

    res.json({ badges });

  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Helper function to check and award badges
async function checkAndAwardBadges(childId, db) {
  try {
    // Get child's total progress
    const totalProgress = await db.all(`
      SELECT * FROM learning_progress WHERE child_id = ?
    `, [childId]);

    if (totalProgress.length === 0) return;

    // Calculate totals
    const totalLearningMinutes = totalProgress.reduce((sum, p) => sum + p.learning_minutes, 0);
    const totalStoriesRead = totalProgress.reduce((sum, p) => {
      const items = JSON.parse(p.completed_items || '[]');
      return sum + items.filter(item => item.type === 'story').length;
    }, 0);
    const totalQuizzesCompleted = totalProgress.reduce((sum, p) => {
      const scores = JSON.parse(p.quiz_scores || '{}');
      return sum + Object.keys(scores).length;
    }, 0);

    // Get all badges
    const badges = await db.all('SELECT * FROM badges');
    
    // Check each badge
    for (const badge of badges) {
      const criteria = JSON.parse(badge.criteria || '{}');
      let shouldAward = false;

      if (criteria.learning_minutes && totalLearningMinutes >= criteria.learning_minutes) {
        shouldAward = true;
      }
      if (criteria.stories_read && totalStoriesRead >= criteria.stories_read) {
        shouldAward = true;
      }
      if (criteria.quizzes_completed && totalQuizzesCompleted >= criteria.quizzes_completed) {
        shouldAward = true;
      }

      if (shouldAward) {
        // Check if already awarded
        const currentProgress = await db.get(`
          SELECT badges_earned FROM learning_progress 
          WHERE child_id = ? AND date = ?
        `, [childId, new Date().toISOString().split('T')[0]]);

        if (currentProgress) {
          const earnedBadges = JSON.parse(currentProgress.badges_earned || '[]');
          if (!earnedBadges.includes(badge.id)) {
            earnedBadges.push(badge.id);
            await db.run(`
              UPDATE learning_progress 
              SET badges_earned = ? 
              WHERE child_id = ? AND date = ?
            `, [JSON.stringify(earnedBadges), childId, new Date().toISOString().split('T')[0]]);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}

export default router;
