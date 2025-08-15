import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireRole } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all stories with optional filtering
router.get('/stories', [
  query('ageBand').optional().isString(),
  query('tags').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const { ageBand, tags, limit = 20, offset = 0 } = req.query;
    const db = getDatabase();

    let whereClause = 'WHERE is_approved = 1';
    let params = [];

    if (ageBand) {
      whereClause += ' AND age_band = ?';
      params.push(ageBand);
    }

    if (tags) {
      whereClause += ' AND tags LIKE ?';
      params.push(`%${tags}%`);
    }

    const stories = await db.all(`
      SELECT * FROM stories 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Get page count for each story
    for (let story of stories) {
      const pageCount = await db.get('SELECT COUNT(*) as count FROM story_pages WHERE story_id = ?', [story.id]);
      story.pageCount = pageCount.count;
    }

    res.json({ stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get story by ID with pages
router.get('/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const story = await db.get('SELECT * FROM stories WHERE id = ? AND is_approved = 1', [id]);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const pages = await db.all('SELECT * FROM story_pages WHERE story_id = ? ORDER BY page_number', [id]);
    story.pages = pages;

    res.json({ story });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Create new story (educators only)
router.post('/stories', [
  authenticateToken,
  requireRole(['educator', 'admin']),
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('ageBand').isIn(['3-5', '6-8', '9-12']),
  body('tags').isArray(),
  body('estimatedMinutes').isInt({ min: 1, max: 60 }),
  body('pages').isArray({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, ageBand, tags, estimatedMinutes, pages } = req.body;
    const db = getDatabase();

    // Create story
    const storyId = uuidv4();
    await db.run(`
      INSERT INTO stories (id, title, description, age_band, tags, estimated_minutes, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [storyId, title, description, ageBand, JSON.stringify(tags), estimatedMinutes, req.user.userId, 0]);

    // Create story pages
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageId = uuidv4();
      await db.run(`
        INSERT INTO story_pages (id, story_id, page_number, text, image_url)
        VALUES (?, ?, ?, ?, ?)
      `, [pageId, storyId, i + 1, page.text, page.imageUrl]);
    }

    res.status(201).json({
      message: 'Story created successfully',
      storyId,
      note: 'Story will be reviewed before approval'
    });

  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Get all quizzes with optional filtering
router.get('/quizzes', [
  query('ageBand').optional().isString(),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  query('tags').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const { ageBand, difficulty, tags, limit = 20, offset = 0 } = req.query;
    const db = getDatabase();

    let whereClause = 'WHERE is_approved = 1';
    let params = [];

    if (ageBand) {
      whereClause += ' AND age_band = ?';
      params.push(ageBand);
    }

    if (difficulty) {
      whereClause += ' AND difficulty = ?';
      params.push(difficulty);
    }

    if (tags) {
      whereClause += ' AND tags LIKE ?';
      params.push(`%${tags}%`);
    }

    const quizzes = await db.all(`
      SELECT * FROM quizzes 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Get question count for each quiz
    for (let quiz of quizzes) {
      const questionCount = await db.get('SELECT COUNT(*) as count FROM quiz_questions WHERE quiz_id = ?', [quiz.id]);
      quiz.questionCount = questionCount.count;
    }

    res.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quiz by ID with questions
router.get('/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const quiz = await db.get('SELECT * FROM quizzes WHERE id = ? AND is_approved = 1', [id]);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questions = await db.all('SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY id', [id]);
    quiz.questions = questions;

    res.json({ quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create new quiz (educators only)
router.post('/quizzes', [
  authenticateToken,
  requireRole(['educator', 'admin']),
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('ageBand').isIn(['3-5', '6-8', '9-12']),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
  body('timeLimit').optional().isInt({ min: 1, max: 120 }),
  body('questions').isArray({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, ageBand, difficulty, timeLimit, questions } = req.body;
    const db = getDatabase();

    // Create quiz
    const quizId = uuidv4();
    await db.run(`
      INSERT INTO quizzes (id, title, description, age_band, difficulty, time_limit, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [quizId, title, description, ageBand, difficulty, timeLimit, req.user.userId, 0]);

    // Create quiz questions
    for (let question of questions) {
      const questionId = uuidv4();
      await db.run(`
        INSERT INTO quiz_questions (id, quiz_id, question, options, correct_answer, explanation)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [questionId, quizId, question.question, JSON.stringify(question.options), question.correctAnswer, question.explanation]);
    }

    res.status(201).json({
      message: 'Quiz created successfully',
      quizId,
      note: 'Quiz will be reviewed before approval'
    });

  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Get all songs with optional filtering
router.get('/songs', [
  query('ageBand').optional().isString(),
  query('tags').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const { ageBand, tags, limit = 20, offset = 0 } = req.query;
    const db = getDatabase();

    let whereClause = 'WHERE is_approved = 1';
    let params = [];

    if (ageBand) {
      whereClause += ' AND age_band = ?';
      params.push(ageBand);
    }

    if (tags) {
      whereClause += ' AND tags LIKE ?';
      params.push(`%${tags}%`);
    }

    const songs = await db.all(`
      SELECT * FROM songs 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    res.json({ songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Get song by ID
router.get('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const song = await db.get('SELECT * FROM songs WHERE id = ? AND is_approved = 1', [id]);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json({ song });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

// Create new song (educators only)
router.post('/songs', [
  authenticateToken,
  requireRole(['educator', 'admin']),
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('ageBand').isIn(['3-5', '6-8', '9-12']),
  body('audioUrl').isURL(),
  body('duration').isInt({ min: 1, max: 600 }),
  body('lyrics').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, ageBand, audioUrl, duration, lyrics } = req.body;
    const db = getDatabase();

    // Create song
    const songId = uuidv4();
    await db.run(`
      INSERT INTO songs (id, title, description, age_band, audio_url, duration, lyrics, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [songId, title, description, ageBand, audioUrl, duration, lyrics, req.user.userId, 0]);

    res.status(201).json({
      message: 'Song created successfully',
      songId,
      note: 'Song will be reviewed before approval'
    });

  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: 'Failed to create song' });
  }
});

// Get content by type and ID (generic endpoint)
router.get('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const db = getDatabase();

    let content;
    let tableName;

    switch (type) {
      case 'stories':
        tableName = 'stories';
        break;
      case 'quizzes':
        tableName = 'quizzes';
        break;
      case 'songs':
        tableName = 'songs';
        break;
      default:
        return res.status(400).json({ error: 'Invalid content type' });
    }

    content = await db.get(`SELECT * FROM ${tableName} WHERE id = ? AND is_approved = 1`, [id]);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Get additional data based on type
    if (type === 'stories') {
      const pages = await db.all('SELECT * FROM story_pages WHERE story_id = ? ORDER BY page_number', [id]);
      content.pages = pages;
    } else if (type === 'quizzes') {
      const questions = await db.all('SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY id', [id]);
      content.questions = questions;
    }

    res.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Search content
router.get('/search', [
  query('q').trim().isLength({ min: 1 }),
  query('type').optional().isIn(['stories', 'quizzes', 'songs']),
  query('ageBand').optional().isIn(['3-5', '6-8', '9-12']),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { q, type, ageBand, limit = 20 } = req.query;
    const db = getDatabase();

    let results = [];
    const searchTerm = `%${q}%`;

    if (!type || type === 'stories') {
      const stories = await db.all(`
        SELECT * FROM stories 
        WHERE is_approved = 1 
        AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)
        ${ageBand ? 'AND age_band = ?' : ''}
        ORDER BY created_at DESC
        LIMIT ?
      `, ageBand ? [searchTerm, searchTerm, searchTerm, ageBand, limit] : [searchTerm, searchTerm, searchTerm, limit]);
      
      results.push(...stories.map(s => ({ ...s, type: 'story' })));
    }

    if (!type || type === 'quizzes') {
      const quizzes = await db.all(`
        SELECT * FROM quizzes 
        WHERE is_approved = 1 
        AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)
        ${ageBand ? 'AND age_band = ?' : ''}
        ORDER BY created_at DESC
        LIMIT ?
      `, ageBand ? [searchTerm, searchTerm, searchTerm, ageBand, limit] : [searchTerm, searchTerm, searchTerm, limit]);
      
      results.push(...quizzes.map(q => ({ ...q, type: 'quiz' })));
    }

    if (!type || type === 'songs') {
      const songs = await db.all(`
        SELECT * FROM songs 
        WHERE is_approved = 1 
        AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)
        ${ageBand ? 'AND age_band = ?' : ''}
        ORDER BY created_at DESC
        LIMIT ?
      `, ageBand ? [searchTerm, searchTerm, searchTerm, ageBand, limit] : [searchTerm, searchTerm, searchTerm, limit]);
      
      results.push(...songs.map(s => ({ ...s, type: 'song' })));
    }

    // Sort by relevance (exact matches first, then partial)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === q.toLowerCase();
      const bExact = b.title.toLowerCase() === q.toLowerCase();
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json({ 
      results: results.slice(0, limit),
      total: results.length,
      query: q
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get calm corner items
router.get('/calm-corner', [
  query('ageBand').optional().isString(),
  query('type').optional().isIn(['audio', 'story'])
], async (req, res) => {
  try {
    const { ageBand, type } = req.query;
    const db = getDatabase();

    let whereClause = 'WHERE is_approved = 1';
    let params = [];

    if (ageBand) {
      whereClause += ' AND age_band = ?';
      params.push(ageBand);
    }

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    const items = await db.all(`
      SELECT * FROM calm_corner 
      ${whereClause}
      ORDER BY created_at DESC
    `, params);

    res.json({ items });
  } catch (error) {
    console.error('Error fetching calm corner items:', error);
    res.status(500).json({ error: 'Failed to fetch calm corner items' });
  }
});

// Get co-play cards
router.get('/co-play', [
  query('ageBand').optional().isString()
], async (req, res) => {
  try {
    const { ageBand } = req.query;
    const db = getDatabase();

    let whereClause = 'WHERE is_approved = 1';
    let params = [];

    if (ageBand) {
      whereClause += ' AND age_band = ?';
      params.push(ageBand);
    }

    const cards = await db.all(`
      SELECT * FROM co_play_cards 
      ${whereClause}
      ORDER BY created_at DESC
    `, params);

    res.json({ cards });
  } catch (error) {
    console.error('Error fetching co-play cards:', error);
    res.status(500).json({ error: 'Failed to fetch co-play cards' });
  }
});

// Get offline packs
router.get('/offline-packs', async (req, res) => {
  try {
    const db = getDatabase();
    const packs = await db.all(`
      SELECT * FROM offline_packs 
      ORDER BY created_at DESC
    `);

    res.json({ packs });
  } catch (error) {
    console.error('Error fetching offline packs:', error);
    res.status(500).json({ error: 'Failed to fetch offline packs' });
  }
});

// Get badges
router.get('/badges', async (req, res) => {
  try {
    const db = getDatabase();
    const badges = await db.all(`
      SELECT * FROM badges 
      ORDER BY created_at ASC
    `);

    res.json({ badges });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

export default router;
