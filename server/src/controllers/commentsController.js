const { body, validationResult } = require('express-validator');
const { Comment, User } = require('../models');

// ── GET /api/projects/:pid/tasks/:tid/comments ────────────────────────────────
exports.listComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { taskId: req.params.tid },
      include: [{ model: User, as: 'User', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(comments);
  } catch (err) {
    console.error('List comments error:', err);
    return res.status(500).json({ error: 'Failed to fetch comments.' });
  }
};

// ── POST /api/projects/:pid/tasks/:tid/comments ───────────────────────────────
exports.createCommentValidation = [
  body('description').trim().notEmpty().withMessage('Comment cannot be empty'),
];

exports.createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { description } = req.body;
    const comment = await Comment.create({
      description,
      taskId: req.params.tid,
      userId: req.user.id,
    });
    const full = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'User', attributes: ['id', 'name'] }],
    });
    return res.status(201).json(full);
  } catch (err) {
    console.error('Create comment error:', err);
    return res.status(500).json({ error: 'Failed to add comment.' });
  }
};
