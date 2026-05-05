const { User } = require('../models');
const { Op } = require('sequelize');

// GET /api/users — list all users
exports.listUsers = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'ADMIN') {
      // Admins see themselves, members they created, and global signup members
      filter = {
        [Op.or]: [
          { id: req.user.id },
          { creatorId: req.user.id },
          { [Op.and]: [{ creatorId: null }, { role: 'MEMBER' }] }
        ]
      };
    } else {
      // MEMBERs can only see ADMINs
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

    // Check permissions
    const isAllowed = 
      user.creatorId === req.user.id || 
      (user.creatorId === null && user.role === 'MEMBER');

    if (!isAllowed) {
      return res.status(403).json({ error: 'Permission denied. You can only remove members you created or global members.' });
    }

    await user.destroy();
    return res.json({ message: 'User removed successfully.' });
  } catch (err) {
    console.error('Remove user error:', err);
    return res.status(500).json({ error: 'Failed to remove user.' });
  }
};
