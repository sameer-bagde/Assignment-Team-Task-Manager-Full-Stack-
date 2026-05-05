const express = require('express');
const router  = express.Router({ mergeParams: true }); // inherit :id from projects
const ctrl    = require('../controllers/tasksController');
const authMw  = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// GET  /api/projects/:id/tasks
router.get('/', authMw, ctrl.listTasks);

// POST /api/projects/:id/tasks  — ADMIN only
router.post('/', authMw, requireRole('ADMIN'), ctrl.createTaskValidation, ctrl.createTask);

// PATCH /api/projects/:id/tasks/:taskId  — any authenticated user
router.patch('/:taskId', authMw, ctrl.updateTask);

// DELETE /api/projects/:id/tasks/:taskId  — ADMIN only
router.delete('/:taskId', authMw, requireRole('ADMIN'), ctrl.deleteTask);

module.exports = router;
