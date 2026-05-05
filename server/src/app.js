require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');

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

// ── Static Files (Frontend) ──────────────────────────────────────────────────
const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/users',      usersRouter);
app.use('/api/projects',   projectsRouter);

// Nested: /api/projects/:id/tasks/:taskId/comments
app.use('/api/projects/:id/tasks/:tid/comments', commentsRouter);
app.use('/api/projects/:id/tasks',               tasksRouter);

app.use('/api/dashboard',  dashboardRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Client-side routing support ───────────────────────────────────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`❌  Frontend index.html not found at: ${indexPath}`);
      res.status(404).send('Frontend not built. Please check your build logs on Railway.');
    }
  } else {
    res.status(404).json({ error: 'API route not found.' });
  }
});

// ── 404 fallback for API ──────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

module.exports = app;
