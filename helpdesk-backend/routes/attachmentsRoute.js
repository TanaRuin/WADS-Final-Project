// routes/attachments.js or routes/tickets.js
const express = require('express');
const router = express.Router();
const {
  uploadAttachment,
  getTicketAttachments,
  downloadAttachment,
  deleteAttachment
} = require('../controllers/attachmentController');

const upload = require('../middleware/uploadAttachments'); // ✅ import multer middleware

// Upload file to ticket
router.post('/upload/:ticketId', upload.single('file'), uploadAttachment);

// Get all attachments for a ticket
router.get('/getall/:ticketId', getTicketAttachments);

// Download attachment
router.get('/download/:attachmentId', downloadAttachment);

// Delete attachment
router.delete('/delete/:attachmentId', deleteAttachment);

module.exports = router;
