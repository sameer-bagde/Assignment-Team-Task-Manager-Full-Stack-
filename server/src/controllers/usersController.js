const { User } = require('../models');
const { Op } = require('sequelize');
<<<<<<< HEAD

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

=======
const bcrypt = require('bcryptjs');

// GET /api/users — list all users (for member sections)
exports.listUsers = async (req, res) => {
  try {
    const currentUser = await User.findByPk(req.user.id);
    if (!currentUser) return res.status(404).json({ error: 'User not found.' });

    let filter;
    
    if (currentUser.role === 'ADMIN') {
      // ADMINs see themselves, anyone they created, and global members (MEMBER role only)
      filter = {
        [Op.or]: [
          { id: currentUser.id },
          { creatorId: currentUser.id },
          { role: 'MEMBER', creatorId: null }
        ]
      };
    } else {
      // MEMBERs see themselves, their specific admin, their teammates, and global members
      filter = {
        [Op.or]: [
          { id: currentUser.id },
          { id: currentUser.creatorId }, // Their admin
          { creatorId: currentUser.creatorId }, // Their teammates
          { role: 'MEMBER', creatorId: null } // Global members
        ]
      };
    }

>>>>>>> 1978db6c7bc8e3ec64dc6038bf813c48f00bae27
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
