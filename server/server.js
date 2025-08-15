import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB on startup
let dbConnectionAttempted = false;

const initializeDB = async () => {
  if (dbConnectionAttempted) return;
  
  try {
    await connectDB();
    dbConnectionAttempted = true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    // Don't throw - let the server start without DB for now
  }
};

// Initialize database connection
initializeDB();

// Health check endpoint with DB status
app.get('/health', (req, res) => {
  const dbStatus = getDBStatus();
  const isHealthy = dbStatus === 'connected';
  
  res.status(isHealthy ? 200 : 503).json({ 
    status: isHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      connected: dbStatus === 'connected'
    }
  });
});

// Basic API status
app.get('/api/status', (req, res) => {
  const dbStatus = getDBStatus();
  
  res.json({ 
    message: 'Cre8 Kids API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: {
      status: dbStatus,
      connected: dbStatus === 'connected'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cre8 Kids Backend running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
  console.log(`🌍 CORS Origin: ${process.env.CORS_ORIGIN || '*'}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI ? 'MongoDB Atlas' : 'No URI provided'}`);
});

export default app;
