const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../controllers/admindashboardController');
const { authenticate, authorizeLevel } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /admindashboard/get:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns statistics about tickets for the admin dashboard. Requires admin authentication.
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of tickets
 *                 recent:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       description: User full name who submitted the ticket
 *                     submitted:
 *                       type: string
 *                       format: date
 *                       description: Date ticket was submitted
 *                     subject:
 *                       type: string
 *                       description: Ticket subject (shortened)
 *                     issue:
 *                       type: string
 *                       description: Full issue description
 *                     category:
 *                       type: string
 *                     priority:
 *                       type: string
 *                     status:
 *                       type: string
 *                 priorityData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       value:
 *                         type: integer
 *                       color:
 *                         type: string
 *                 statusData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       value:
 *                         type: integer
 *                       color:
 *                         type: string
 *                 monthlyData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       resolved:
 *                         type: integer
 *       401:
 *         description: Unauthorized - authentication required or failed
 *       403:
 *         description: Forbidden - user does not have admin rights
 *       500:
 *         description: Internal Server Error
 */
router.get('/get', authenticate, authorizeLevel('admin'), getDashboardStats);

module.exports = router;
