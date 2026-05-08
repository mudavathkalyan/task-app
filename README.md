# TaskFlow — Full-Stack Task Tracker

A full-stack Task Tracking CRUD application with JWT Authentication.

**Stack:** React + Vite | Node.js + Express | PostgreSQL | JWT

---

## Project Structure

```
task-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── authController.js     # Register & login logic
│   │   └── taskController.js     # Task CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   └── taskRoutes.js         # /api/tasks/*
│   ├── schema.sql                # PostgreSQL table definitions
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios instance with JWT interceptor
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── TaskModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx               # Routes
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Prerequisites

- Node.js v18+ (https://nodejs.org)
- PostgreSQL v14+ (https://postgresql.org)
- npm v9+

---

## Step 1 — PostgreSQL Setup

### 1a. Start PostgreSQL and open psql:
```bash
psql -U postgres
```

### 1b. Create the database:
```sql
CREATE DATABASE tasktracker;
\c tasktracker
```

### 1c. Create tables (paste from schema.sql or run):
```sql
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP           DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT         DEFAULT '',
    status      VARCHAR(20)  DEFAULT 'Pending'
                             CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email   ON users(email);
```

### 1d. Verify tables:
```sql
\dt
```

---

## Step 2 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy env file
cp .env.example .env
```

### Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tasktracker
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password
JWT_SECRET=my_super_secret_key_change_this_32chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Run the backend:
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

You should see:
```
✅ Connected to PostgreSQL database
🚀 Server running on http://localhost:5000
```

---

## Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open: http://localhost:5173

---

## API Endpoints

### Authentication

| Method | Endpoint              | Description         | Auth Required |
|--------|-----------------------|---------------------|---------------|
| POST   | /api/auth/register    | Create new account  | No            |
| POST   | /api/auth/login       | Login & get token   | No            |

### Tasks

| Method | Endpoint              | Description         | Auth Required |
|--------|-----------------------|---------------------|---------------|
| GET    | /api/tasks            | Get all user tasks  | Yes (Bearer)  |
| GET    | /api/tasks/:id        | Get single task     | Yes (Bearer)  |
| POST   | /api/tasks            | Create task         | Yes (Bearer)  |
| PUT    | /api/tasks/:id        | Update task         | Yes (Bearer)  |
| DELETE | /api/tasks/:id        | Delete task         | Yes (Bearer)  |

---

## Sample API Requests & Responses

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secret123"
}

Response 201:
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "secret123"
}

Response 200:
{
  "success": true,
  "message": "Logged in successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Jane Smith", "email": "jane@example.com" }
}
```

### Get All Tasks
```
GET /api/tasks
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "id": 1,
      "title": "Set up project",
      "description": "Install deps and configure env",
      "status": "Completed",
      "created_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Build API",
      "description": "",
      "status": "In Progress",
      "created_at": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Write tests",
  "description": "Add unit tests for controllers",
  "status": "Pending"
}

Response 201:
{
  "success": true,
  "message": "Task created successfully!",
  "task": {
    "id": 3,
    "title": "Write tests",
    "description": "Add unit tests for controllers",
    "status": "Pending",
    "created_at": "2024-01-15T11:00:00.000Z"
  }
}
```

### Update Task
```
PUT /api/tasks/3
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress"
}

Response 200:
{
  "success": true,
  "message": "Task updated successfully!",
  "task": { "id": 3, "title": "Write tests", "status": "In Progress", ... }
}
```

### Delete Task
```
DELETE /api/tasks/3
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Task deleted successfully!"
}
```

---

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

Common HTTP status codes:
- `400` — Bad request (missing fields, validation error)
- `401` — Unauthorized (no token, invalid/expired token)
- `404` — Resource not found
- `409` — Conflict (email already exists)
- `500` — Server error

---

## Testing with curl

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"pass123"}'

# 2. Login (save the token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# 3. Create task (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","status":"Pending"}'

# 4. Get all tasks
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

---

## How Authentication Works

```
1. User registers/logs in
      ↓
2. Backend hashes password with bcrypt (cost factor 12)
      ↓
3. Backend generates JWT (signed with JWT_SECRET, expires in 7d)
      ↓
4. Frontend stores token in localStorage
      ↓
5. Every API request includes: Authorization: Bearer <token>
      ↓
6. authMiddleware.js verifies token on protected routes
      ↓
7. req.user is set with { id, email } from the token payload
      ↓
8. Controllers use req.user.id to scope data per user
```

---

## Common Issues & Fixes

**"Error connecting to PostgreSQL"**
→ Check DB_PASSWORD in .env matches your PostgreSQL password
→ Make sure PostgreSQL service is running: `sudo service postgresql start`

**"CORS error" in browser**
→ Make sure CLIENT_URL in .env is exactly `http://localhost:5173`
→ Restart the backend after changing .env

**"Token expired"**
→ Log out and log in again to get a fresh token

**Port already in use**
→ Change PORT in .env (backend) or edit vite.config.js (frontend)

---

## Package Versions

### Backend
```
express@4.18.2      — Web framework
pg@8.11.3           — PostgreSQL client
bcryptjs@2.4.3      — Password hashing
jsonwebtoken@9.0.2  — JWT generation & verification
cors@2.8.5          — Cross-origin resource sharing
dotenv@16.3.1       — Environment variable loader
nodemon@3.0.2       — Dev auto-restart
```

### Frontend
```
react@18.2.0              — UI library
react-dom@18.2.0          — React DOM renderer
react-router-dom@6.21.1   — Client-side routing
axios@1.6.5               — HTTP client
vite@5.0.8                — Build tool & dev server
```
