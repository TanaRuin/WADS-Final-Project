// routes/attachments.js or routes/tickets.js
const express = require('express');
const router = express.Router();
const {
  uploadAttachment,
  getTicketAttachments,
  downloadAttachment,
  deleteAttachment
} = require('../controllers/attachmentController');

// Importing mmiddleware
const upload = require('../middleware/uploadAttachments');
const { authenticate } = require('../middleware/authMiddleware');

// Upload file to ticket
router.post('/upload/:ticketId', authenticate, upload.single('file'), uploadAttachment);

// Get all attachments for a ticket
router.get('/getall/:ticketId', authenticate, getTicketAttachments);

// Download attachment
router.get('/download/:attachmentId', authenticate, downloadAttachment);

// Delete attachment
router.delete('/delete/:attachmentId', authenticate, deleteAttachment);

module.exports = router;
