const express = require('express');
const router = express.Router();

const {
  getTicketComments,
  addComment,
  deleteComment
} = require('../controllers/commentController');

// Comment routes
//Get ticket comments
router.get('/get/:ticketId', getTicketComments);
//Add comments
router.post('/add/:ticketId', addComment);
//Delete comments
router.delete('/delete/:commentId', deleteComment);

module.exports = router;
