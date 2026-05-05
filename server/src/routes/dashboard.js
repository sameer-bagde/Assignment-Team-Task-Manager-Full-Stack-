const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/dashboardController');
const authMw  = require('../middleware/auth');

// GET /api/dashboard?projectId=&userId=
router.get('/', authMw, ctrl.getDashboard);

module.exports = router;
