const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  closeTicket, 
  getTicketsByUserId,
  createTicket
} = require('../controllers/TicketController');

const { authenticate, authorizeLevel } = require('../middleware/authMiddleware');

/**
 * @openapi
 * tags:
 *   name: Tickets
 *   description: Ticket management endpoints
 */

/**
 * @openapi
 * /api/ticket/getall:
 *   get:
 *     summary: Get all tickets with optional filters
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter tickets by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter tickets by category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter tickets by priority
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter tickets by user ID
 *     responses:
 *       200:
 *         description: List of tickets retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/getall', authenticate, getAllTickets);

/**
 * @openapi
 * /api/ticket/get/{ticketId}:
 *   get:
 *     summary: Get a ticket by its ID
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket unique ID
 *     responses:
 *       200:
 *         description: Ticket data retrieved successfully
 *       401:
 *         description: Unauthorized (authentication required)
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.get('/get/:ticketId', authenticate, getTicketById);

router.post('/add', authenticate,createTicket )

router.get('/user',authenticate, getTicketsByUserId)


/**
 * @openapi
 * /api/ticket/close/{ticketId}:
 *   post:
 *     summary: Close a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket unique ID
 *     responses:
 *       200:
 *         description: Ticket closed successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.post('/close/:ticketId', authenticate, closeTicket);

module.exports = router;


























