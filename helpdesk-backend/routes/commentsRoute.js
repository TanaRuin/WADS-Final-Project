const express = require('express');
const router = express.Router();

const {
  getTicketComments,
  addComment,
  deleteComment
} = require('../controllers/commentController');

// Comment routes
router.get('/get/:ticketId', getTicketComments);
router.post('/add/:ticketId', addComment);
router.delete('/delete/:commentId', deleteComment);

module.exports = router;
