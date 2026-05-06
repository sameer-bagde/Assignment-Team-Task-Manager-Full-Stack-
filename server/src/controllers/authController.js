const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

// ── Signup ────────────────────────────────────────────────────────────────────
exports.signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { name, email, password, role: requestedRole } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered.' });

    const userCount = await User.count();
    let finalRole = (userCount === 0) ? 'ADMIN' : 'MEMBER';

    // ── Check Authorization ──────────────────────────────────────────────────
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // Admin is adding a user
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Only administrators can add members.' });
        }
        
        // Prevent admin from adding themselves
        if (decoded.email === email) {
          return res.status(400).json({ error: 'Admin cannot be a member of their own team (you are already the Admin).' });
        }

        // Admin can specify the role
        finalRole = requestedRole === 'ADMIN' ? 'ADMIN' : 'MEMBER';
      } catch (err) {
        return res.status(401).json({ error: 'Invalid token.' });
      }
    } else {
      // Public signup — Handle MEMBER and ADMIN signup
      const { adminKey } = req.body;
      const ADMIN_SECRET = process.env.ADMIN_SECRET || 'supersecret';

      if (adminKey) {
        if (adminKey === ADMIN_SECRET) {
          finalRole = 'ADMIN';
        } else {
          return res.status(403).json({ 
            error: 'Invalid admin secret key.' 
          });
        }
      }
      // If no adminKey and userCount is 0, finalRole is already ADMIN.
      // If no adminKey and userCount > 0, finalRole is MEMBER.
    }

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role: finalRole,
      creatorId: token ? jwt.verify(token, process.env.JWT_SECRET).id : null 
    });

    // If Admin added a user, we don't need to return a new token for the new user
    if (token) {
      return res.status(201).json({
        message: 'User created successfully.',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    // Otherwise (First Admin Signup), return token for login
    const newToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token: newToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Server error during signup.' });
  }
};

// ── Signin ────────────────────────────────────────────────────────────────────
exports.signinValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ error: 'Server error during signin.' });
  }
};
