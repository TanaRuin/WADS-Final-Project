const express = require('express');
const router = express.Router();

const {
  getComments,
  addComment,
} = require('../controllers/commentController');

const { authenticate, authorizeLevel } = require('../middleware/authMiddleware');




/**
 * @openapi
 * /api/comments/get/{ticketId}:
 *   get:
 *     summary: Get all comments for a specific ticket
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         description: The ID of the ticket to get comments for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments for the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   author:
 *                     type: string
 *                   text:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     description: Date and time of comment in 'DD/MM/YYYY HH:mm' format
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.get('/get/:ticketId', authenticate, getComments);

/**
 * @openapi
 * /api/comments/add/{ticketId}:
 *   post:
 *     summary: Add a comment to a specific ticket
 *     tags:
 *       - Comments
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         description: The ID of the ticket to add a comment to
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment content to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is a comment.
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 text:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       400:
 *         description: Comment content is required
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.post('/add/:ticketId', authenticate, addComment);


module.exports = router;
