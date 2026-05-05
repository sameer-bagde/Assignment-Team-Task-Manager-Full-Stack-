require('dotenv').config();
const express  = require('express');
const cors     = require('cors');

const usersRouter     = require('./routes/users');
const projectsRouter  = require('./routes/projects');
const tasksRouter     = require('./routes/tasks');
const commentsRouter  = require('./routes/comments');
const dashboardRouter = require('./routes/dashboard');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/users',      usersRouter);
app.use('/api/projects',   projectsRouter);

// Nested: /api/projects/:id/tasks/:taskId/comments
app.use('/api/projects/:id/tasks/:tid/comments', commentsRouter);
app.use('/api/projects/:id/tasks',               tasksRouter);

app.use('/api/dashboard',  dashboardRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

module.exports = app;
