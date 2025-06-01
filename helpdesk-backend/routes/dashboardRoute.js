const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../controllers/admindashboardController');
const { authenticate, authorizeLevel } = require('../middleware/authMiddleware');

// Protect route: only authenticated admins can access
router.get('/get', getDashboardStats);

module.exports = router;
