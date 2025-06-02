const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  closeTicket, 
  createTicket
} = require('../controllers/TicketController');

const { authenticate, authorizeLevel } = require('../middleware/authMiddleware');

// Ticket routes
router.get('/getall', getAllTickets);
router.get('/get/:ticketId', authenticate, getTicketById);
router.patch('/updatestatus/:ticketId', authenticate, authorizeLevel('admin'), updateTicketStatus);
router.post('/close/:ticketId',closeTicket);






module.exports = router;