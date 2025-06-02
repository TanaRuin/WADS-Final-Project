const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  closeTicket, 
} = require('../controllers/TicketController');

const { authenticate, authorizeLevel } = require('../middleware/authMiddleware');

// Ticket routes
router.get('/getall',authenticate, authorizeLevel('admin'), getAllTickets);
router.get('/get/:id', getTicketById, authenticate);
router.patch('/updatestatus/:id', authenticate, authorizeLevel('admin'), updateTicketStatus);
router.post('/close/:id', authenticate, authorizeLevel('admin'), closeTicket);






module.exports = router;