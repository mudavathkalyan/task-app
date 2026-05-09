// server.js
// Main entry point for the Express backend
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5006;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

// Enable CORS so the React frontend can make requests to this server
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Task Tracker API is running!',
    version: '1.0.0',
  });
});

// Auth routes: /api/auth/register, /api/auth/login
app.use('/api/auth', authRoutes);

// Task routes: /api/tasks (all protected)
app.use('/api/tasks', taskRoutes);

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
