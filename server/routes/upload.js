import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken, requireRole } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Create different folders based on file type
    if (file.fieldname === 'storyImage') {
      uploadPath += 'stories/';
    } else if (file.fieldname === 'songAudio') {
      uploadPath += 'songs/';
    } else if (file.fieldname === 'quizImage') {
      uploadPath += 'quizzes/';
    } else {
      uploadPath += 'general/';
    }
    
    // Create directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allow only specific file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
  
  if (file.fieldname === 'storyImage' || file.fieldname === 'quizImage') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  } else if (file.fieldname === 'songAudio') {
    if (allowedAudioTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio file type. Only MP3, WAV, OGG, and M4A are allowed.'), false);
    }
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Configure multer with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Upload story images
router.post('/story-images', [
  authenticateToken,
  requireRole(['educator', 'admin']),
  upload.array('storyImage', 10) // Allow up to 10 images
], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/stories/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      message: 'Story images uploaded successfully',
      files: uploadedFiles,
      count: uploadedFiles.length
    });

  } catch (error) {
    console.error('Error uploading story images:', error);
    res.status(500).json({ error: 'Failed to upload story images' });
  }
});

// Upload song audio
router.post('/song-audio', [
  authenticateToken,
  requireRole(['educator', 'admin']),
  upload.single('songAudio')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const uploadedFile = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      url: `/uploads/songs/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    res.json({
      message: 'Song audio uploaded successfully',
      file: uploadedFile
    });

  } catch (error) {
    console.error('Error uploading song audio:', error);
    res.status(500).json({ error: 'Failed to upload song audio' });
  }
});

// Upload quiz images
router.post('/quiz-images', [
  authenticateToken,
  requireRole(['educator', 'admin']),
  upload.array('quizImage', 5) // Allow up to 5 images
], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/quizzes/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      message: 'Quiz images uploaded successfully',
      files: uploadedFiles,
      count: uploadedFiles.length
    });

  } catch (error) {
    console.error('Error uploading quiz images:', error);
    res.status(500).json({ error: 'Failed to upload quiz images' });
  }
});

// Upload profile avatar
router.post('/avatar', [
  authenticateToken,
  upload.single('avatar')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No avatar file uploaded' });
    }

    // Check if it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Avatar must be an image file' });
    }

    const uploadedFile = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      url: `/uploads/avatars/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    res.json({
      message: 'Avatar uploaded successfully',
      file: uploadedFile
    });

  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// Bulk upload for multiple content types
router.post('/bulk', [
  authenticateToken,
  requireRole(['educator', 'admin']),
  upload.fields([
    { name: 'storyImages', maxCount: 20 },
    { name: 'songAudios', maxCount: 10 },
    { name: 'quizImages', maxCount: 15 }
  ])
], async (req, res) => {
  try {
    const uploadedFiles = {};
    
    if (req.files.storyImages) {
      uploadedFiles.storyImages = req.files.storyImages.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        url: `/uploads/stories/${file.filename}`,
        size: file.size
      }));
    }
    
    if (req.files.songAudios) {
      uploadedFiles.songAudios = req.files.songAudios.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        url: `/uploads/songs/${file.filename}`,
        size: file.size
      }));
    }
    
    if (req.files.quizImages) {
      uploadedFiles.quizImages = req.files.quizImages.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        url: `/uploads/quizzes/${file.filename}`,
        size: file.size
      }));
    }

    const totalFiles = Object.values(uploadedFiles).reduce((sum, files) => sum + files.length, 0);

    res.json({
      message: 'Bulk upload completed successfully',
      files: uploadedFiles,
      totalFiles
    });

  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({ error: 'Failed to process bulk upload' });
  }
});

// Delete uploaded file
router.delete('/:filename', [
  authenticateToken,
  requireRole(['educator', 'admin'])
], async (req, res) => {
  try {
    const { filename } = req.params;
    const fs = require('fs');
    const path = require('path');

    // Find the file in uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');
    let filePath = null;

    // Search in subdirectories
    const subdirs = ['stories', 'songs', 'quizzes', 'avatars', 'general'];
    for (const subdir of subdirs) {
      const testPath = path.join(uploadsDir, subdir, filename);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }

    if (!filePath) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      message: 'File deleted successfully',
      filename
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get upload statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        totalFiles: 0,
        totalSize: 0,
        byType: {}
      });
    }

    let totalFiles = 0;
    let totalSize = 0;
    const byType = {};

    // Recursively count files and sizes
    function countFiles(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          countFiles(itemPath);
        } else if (stat.isFile()) {
          totalFiles++;
          totalSize += stat.size;
          
          const ext = path.extname(item).toLowerCase();
          byType[ext] = (byType[ext] || 0) + 1;
        }
      }
    }

    countFiles(uploadsDir);

    res.json({
      totalFiles,
      totalSize: formatBytes(totalSize),
      byType
    });

  } catch (error) {
    console.error('Error getting upload stats:', error);
    res.status(500).json({ error: 'Failed to get upload statistics' });
  }
});

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 5 files per request.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field.' });
    }
  }
  
  if (error.message) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

export default router;
