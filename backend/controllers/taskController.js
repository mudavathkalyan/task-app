// controllers/taskController.js
// Handles all task CRUD operations
const pool = require('../config/db');

// Valid status values for tasks
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

// ─── GET ALL TASKS ────────────────────────────────────────────────────────────
// GET /api/tasks
// Returns all tasks belonging to the logged-in user
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware

    const result = await pool.query(
      `SELECT id, title, description, status, created_at
       FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      tasks: result.rows,
    });
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks.',
    });
  }
};

// ─── GET SINGLE TASK ──────────────────────────────────────────────────────────
// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const result = await pool.query(
      `SELECT id, title, description, status, created_at
       FROM tasks
       WHERE id = $1 AND user_id = $2`,
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Get task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching task.',
    });
  }
};

// ─── CREATE TASK ──────────────────────────────────────────────────────────────
// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status = 'Pending' } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    // Validate status value
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, status, created_at`,
      [title.trim(), description?.trim() || '', status, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error creating task.',
    });
  }
};

// ─── UPDATE TASK ──────────────────────────────────────────────────────────────
// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    // Check if task exists and belongs to user
    const existing = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Update the task
    const result = await pool.query(
      `UPDATE tasks
       SET title       = COALESCE($1, title),
           description = COALESCE($2, description),
           status      = COALESCE($3, status)
       WHERE id = $4 AND user_id = $5
       RETURNING id, title, description, status, created_at`,
      [title?.trim(), description?.trim(), status, taskId, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating task.',
    });
  }
};

// ─── DELETE TASK ──────────────────────────────────────────────────────────────
// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error deleting task.',
    });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
