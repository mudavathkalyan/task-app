// routes/taskRoutes.js
// All task routes are protected — user must be logged in
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// Apply the 'protect' middleware to ALL routes in this file
// This means every request here must include a valid JWT token
router.use(protect);

// GET    /api/tasks       → Get all tasks for logged-in user
// POST   /api/tasks       → Create a new task
router.route('/').get(getTasks).post(createTask);

// GET    /api/tasks/:id   → Get a single task
// PUT    /api/tasks/:id   → Update a task
// DELETE /api/tasks/:id   → Delete a task
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
