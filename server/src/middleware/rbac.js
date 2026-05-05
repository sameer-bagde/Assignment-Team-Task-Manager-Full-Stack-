/**
 * Role-Based Access Control middleware factory.
 * Usage: router.post('/projects', auth, requireRole('ADMIN'), controller)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Access denied. Required role: ${roles.join(' or ')}.`,
    });
  }
  next();
};

module.exports = { requireRole };
