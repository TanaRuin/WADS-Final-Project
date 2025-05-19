const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  closeTicket, 
  getDashboardStats
} = require('../controllers/TicketController');


// Ticket routes
router.get('/getall', getAllTickets);
router.get('/dashboard', getDashboardStats);
router.get('/get/:id', getTicketById);
router.patch('/updatestatus/:id', updateTicketStatus);
router.post('/close/:id', closeTicket);






module.exports = router;