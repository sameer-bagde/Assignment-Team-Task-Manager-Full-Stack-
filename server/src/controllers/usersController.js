const { User } = require('../models');
const bcrypt = require('bcryptjs');

// GET /api/users — list all users (for member picker dropdown)
exports.listUsers = async (req, res) => {
  try {
    let filter = {};
    // MEMBERs can only see ADMINs
    if (req.user.role !== 'ADMIN') {
      filter = { role: 'ADMIN' };
    }

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'creatorId'],
      where: filter,
      order: [['name', 'ASC']],
    });
    return res.json(users);
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// DELETE /api/users/:id — ADMIN removes a user
exports.removeUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself.' });

    await user.destroy();
    return res.json({ message: 'User removed successfully.' });
  } catch (err) {
    console.error('Remove user error:', err);
    return res.status(500).json({ error: 'Failed to remove user.' });
  }
};
