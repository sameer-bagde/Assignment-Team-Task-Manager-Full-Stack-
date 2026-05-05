const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/projectsController');
const authMw  = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// GET  /api/projects
router.get('/', authMw, ctrl.listProjects);

// POST /api/projects  — ADMIN only
router.post('/', authMw, requireRole('ADMIN'), ctrl.createProjectValidation, ctrl.createProject);

// DELETE /api/projects/:id  — ADMIN only
router.delete('/:id', authMw, requireRole('ADMIN'), ctrl.deleteProject);

// GET  /api/projects/:id/members
router.get('/:id/members', authMw, ctrl.listProjectMembers);

// POST /api/projects/:id/members  — ADMIN only
router.post('/:id/members', authMw, requireRole('ADMIN'), ctrl.addProjectMember);

// DELETE /api/projects/:id/members/:userId  — ADMIN only
router.delete('/:id/members/:userId', authMw, requireRole('ADMIN'), ctrl.removeProjectMember);

module.exports = router;
