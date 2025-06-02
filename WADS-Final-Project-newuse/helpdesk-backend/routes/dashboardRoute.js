const express = require('express');
const router = express.Router();
const { createTicket } = require('../controllers/TicketController');

const { getDashboardStats } = require('../controllers/admindashboardController');
const { authenticate, authorizeLevel } = require('../middleware/authMiddleware');

// Protect route: only authenticated admins can access
router.get('/get', authenticate, authorizeLevel('admin'), getDashboardStats);
router.post('/create', authenticate, createTicket);

module.exports = router;
