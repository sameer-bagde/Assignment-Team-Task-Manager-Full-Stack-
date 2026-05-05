const express = require('express');
const router  = express.Router({ mergeParams: true });
const ctrl    = require('../controllers/commentsController');
const authMw  = require('../middleware/auth');

// GET  /api/projects/:pid/tasks/:tid/comments
router.get('/', authMw, ctrl.listComments);

// POST /api/projects/:pid/tasks/:tid/comments
router.post('/', authMw, ctrl.createCommentValidation, ctrl.createComment);

module.exports = router;
