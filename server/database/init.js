import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export async function initDatabase() {
  try {
    // Open database connection
    db = await open({
      filename: path.join(__dirname, 'cre8kids.db'),
      driver: sqlite3.Database
    });

    console.log('📊 Database connection established');

    // Create tables
    await createTables();
    console.log('📋 Tables created successfully');

    // Seed initial data
    await seedInitialData();
    console.log('🌱 Initial data seeded successfully');

    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function createTables() {
  // Users table (parents and educators)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('parent', 'educator', 'admin')) NOT NULL,
      display_name TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT 0,
      email_verification_token TEXT,
      email_verification_expires DATETIME,
      password_reset_token TEXT,
      password_reset_expires DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Kid profiles table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS kid_profiles (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL,
      display_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      avatar_color TEXT DEFAULT '#3b82f6',
      learning_level TEXT DEFAULT 'beginner',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Parent settings table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS parent_settings (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL,
      daily_learning_minutes INTEGER DEFAULT 30,
      fun_unlock_minutes INTEGER DEFAULT 15,
      content_filters TEXT DEFAULT '[]',
      screen_time_limits TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Content tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      age_band TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      safety_rating TEXT DEFAULT 'G',
      estimated_minutes INTEGER DEFAULT 5,
      created_by TEXT NOT NULL,
      is_approved BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS story_pages (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      text TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      age_band TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      safety_rating TEXT DEFAULT 'G',
      estimated_minutes INTEGER DEFAULT 5,
      difficulty TEXT DEFAULT 'easy',
      time_limit INTEGER,
      created_by TEXT NOT NULL,
      is_approved BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      age_band TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      safety_rating TEXT DEFAULT 'G',
      audio_url TEXT NOT NULL,
      duration INTEGER NOT NULL,
      lyrics TEXT,
      created_by TEXT NOT NULL,
      is_approved BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Progress tracking
  await db.exec(`
    CREATE TABLE IF NOT EXISTS learning_progress (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      date TEXT NOT NULL,
      learning_minutes INTEGER DEFAULT 0,
      completed_items TEXT DEFAULT '[]',
      quiz_scores TEXT DEFAULT '{}',
      streak_count INTEGER DEFAULT 0,
      badges_earned TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (child_id) REFERENCES kid_profiles(id) ON DELETE CASCADE,
      UNIQUE(child_id, date)
    )
  `);

  // Assignments
  await db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      educator_id TEXT NOT NULL,
      class_code TEXT,
      content_ids TEXT DEFAULT '[]',
      due_date DATETIME,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (educator_id) REFERENCES users(id)
    )
  `);

  // Offline packs
  await db.exec(`
    CREATE TABLE IF NOT EXISTS offline_packs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      content_ids TEXT DEFAULT '[]',
      file_size INTEGER,
      download_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Calm corner items
  await db.exec(`
    CREATE TABLE IF NOT EXISTS calm_corner (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      content TEXT,
      age_band TEXT NOT NULL,
      duration INTEGER,
      audio_url TEXT,
      image_url TEXT,
      is_approved BOOLEAN DEFAULT 0,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Co-play cards
  await db.exec(`
    CREATE TABLE IF NOT EXISTS co_play_cards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      steps TEXT DEFAULT '[]',
      age_band TEXT NOT NULL,
      estimated_minutes INTEGER DEFAULT 15,
      is_approved BOOLEAN DEFAULT 0,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Badges
  await db.exec(`
    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon_url TEXT,
      criteria TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ All tables created successfully');
}

async function seedInitialData() {
  try {
    // Check if data already exists
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) {
      console.log('📊 Database already has data, skipping seed');
      return;
    }

    console.log('🌱 Seeding initial data...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await db.run(`
      INSERT INTO users (id, email, password_hash, role, display_name)
      VALUES (?, ?, ?, ?, ?)
    `, ['admin-1', 'admin@cre8kids.com', adminPassword, 'admin', 'System Admin']);

    // Create sample parent
    const parentPassword = await bcrypt.hash('parent123', 12);
    await db.run(`
      INSERT INTO users (id, email, password_hash, role, display_name)
      VALUES (?, ?, ?, ?, ?)
    `, ['parent-1', 'parent@example.com', parentPassword, 'parent', 'Sample Parent']);

    // Create sample educator
    const educatorPassword = await bcrypt.hash('educator123', 12);
    await db.run(`
      INSERT INTO users (id, email, password_hash, role, display_name)
      VALUES (?, ?, ?, ?, ?)
    `, ['educator-1', 'teacher@school.com', educatorPassword, 'educator', 'Sample Teacher']);

    // Create sample kid profile
    await db.run(`
      INSERT INTO kid_profiles (id, parent_id, display_name, age, avatar_color, learning_level)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['kid-1', 'parent-1', 'Alex', 7, '#3b82f6', 'intermediate']);

    // Create parent settings
    await db.run(`
      INSERT INTO parent_settings (id, parent_id, daily_learning_minutes, fun_unlock_minutes)
      VALUES (?, ?, ?, ?)
    `, ['settings-1', 'parent-1', 30, 15]);

    // Create sample story
    await db.run(`
      INSERT INTO stories (id, title, description, age_band, tags, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['story-1', 'Zee and the Moon Kite', 'A magical adventure about friendship and imagination', '6-8', '["adventure", "imagination", "friendship"]', 'educator-1', 1]);

    // Create story pages
    await db.run(`
      INSERT INTO story_pages (id, story_id, page_number, text, image_url)
      VALUES (?, ?, ?, ?, ?)
    `, ['page-1', 'story-1', 1, 'Zee tied a ribbon to her kite and wished to touch the moon.', '/images/kite-moon.jpg']);

    await db.run(`
      INSERT INTO story_pages (id, story_id, page_number, text, image_url)
      VALUES (?, ?, ?, ?, ?)
    `, ['page-2', 'story-1', 2, 'The wind whooshed. The kite tugged. The moon smiled back.', '/images/kite-flying.jpg']);

    // Create sample quiz
    await db.run(`
      INSERT INTO quizzes (id, title, description, age_band, difficulty, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['quiz-1', 'Fun Math Quiz', 'Practice basic math skills', '6-8', 'easy', 'educator-1', 1]);

    // Create quiz questions
    await db.run(`
      INSERT INTO quiz_questions (id, quiz_id, question, options, correct_answer, explanation)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['q1', 'quiz-1', 'What is 2 + 3?', '["4", "5", "6", "7"]', 1, '2 + 3 = 5! Great job!']);

    await db.run(`
      INSERT INTO quiz_questions (id, quiz_id, question, options, correct_answer, explanation)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['q2', 'quiz-1', 'How many sides does a triangle have?', '["2", "3", "4", "5"]', 1, 'A triangle has 3 sides!']);

    // Create sample song
    await db.run(`
      INSERT INTO songs (id, title, description, age_band, audio_url, duration, lyrics, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['song-1', 'Sunny Steps', 'A fun movement song for little ones', '3-5', '/audio/sunny-steps.mp3', 45, 'Step, step, step in the sun!', 'educator-1', 1]);

    // Create sample calm corner items
    await db.run(`
      INSERT INTO calm_corner (id, title, description, type, content, age_band, duration, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['calm-1', 'Belly Breaths', 'Take deep breaths and feel your belly rise and fall', 'audio', 'Take deep breaths and feel your belly rise and fall', '3-5', 60, 'educator-1', 1]);

    await db.run(`
      INSERT INTO calm_corner (id, title, description, type, content, age_band, duration, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['calm-2', 'Count 1-5 with Me', 'Let\'s count together and take our time', 'audio', 'Let\'s count together and take our time', '3-5', 30, 'educator-1', 1]);

    // Create sample co-play cards
    await db.run(`
      INSERT INTO co_play_cards (id, title, description, steps, age_band, estimated_minutes, created_by, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, ['coplay-1', 'Market Color Hunt (Together)', 'Let\'s explore colors together!', '["Read one story page aloud", "Ask child to find colors at home", "Answer 2 color questions", "High-five!"]', '3-5', 15, 'educator-1', 1]);

    // Create sample offline packs
    await db.run(`
      INSERT INTO offline_packs (id, title, description, content_ids, file_size, download_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['pack-1', 'Starter Learning Pack', 'Essential learning content for beginners', '["story-1", "quiz-1", "song-1"]', 15, 0]);

    // Create sample badges
    await db.run(`
      INSERT INTO badges (id, name, description, criteria)
      VALUES (?, ?, ?, ?)
    `, ['badge-1', 'First Reader', 'Read your first story', '{"stories_read": 1}']);

    await db.run(`
      INSERT INTO badges (id, name, description, criteria)
      VALUES (?, ?, ?, ?)
    `, ['badge-2', 'Quiz Master', 'Complete your first quiz', '{"quizzes_completed": 1}']);

    console.log('✅ Initial data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

export function getDatabase() {
  return db;
}
