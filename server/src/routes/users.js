const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const users   = require('../controllers/usersController');
const authMw  = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// POST /api/users         — public signup
router.post('/', auth.signupValidation, auth.signup);

// POST /api/users/sign_in — public signin
router.post('/sign_in', auth.signinValidation, auth.signin);

// GET  /api/users         — list all users (any authenticated user)
router.get('/', authMw, users.listUsers);

// DELETE /api/users/:id   — admin removes a user
router.delete('/:id', authMw, requireRole('ADMIN'), users.removeUser);

module.exports = router;
