-- ============================================================
-- PostgreSQL Schema for Task Tracker Application
-- ============================================================
-- Run these commands in order to set up your database

-- STEP 1: Create the database (run this in psql terminal)
-- CREATE DATABASE tasktracker;

-- STEP 2: Connect to the database
-- \c tasktracker

-- STEP 3: Create the users table
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP           DEFAULT NOW()
);

-- STEP 4: Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT         DEFAULT '',
    status      VARCHAR(20)  DEFAULT 'Pending'
                             CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP    DEFAULT NOW()
);

-- STEP 5: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email   ON users(email);

-- ============================================================
-- Sample Data (Optional - for testing)
-- ============================================================

-- Insert a test user (password: "password123" — bcrypt hashed)
-- INSERT INTO users (name, email, password)
-- VALUES ('Test User', 'test@example.com', '$2a$12$...');

-- Insert sample tasks
-- INSERT INTO tasks (title, description, status, user_id)
-- VALUES
--   ('Set up project', 'Initialize repo and install dependencies', 'Completed', 1),
--   ('Build API', 'Create Express REST API with JWT auth', 'In Progress', 1),
--   ('Build Frontend', 'Create React app with Vite', 'Pending', 1);

-- ============================================================
-- Useful Queries for Development
-- ============================================================

-- View all users (without passwords)
-- SELECT id, name, email, created_at FROM users;

-- View all tasks with user info
-- SELECT t.id, t.title, t.status, u.name as user_name
-- FROM tasks t JOIN users u ON t.user_id = u.id;

-- Delete all tasks for a user
-- DELETE FROM tasks WHERE user_id = 1;

-- Drop tables (use with caution!)
-- DROP TABLE IF EXISTS tasks;
-- DROP TABLE IF EXISTS users;
