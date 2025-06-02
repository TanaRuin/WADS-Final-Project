const express = require('express');
const router = express.Router();
const {
  uploadAttachment,
  getTicketAttachments,
  downloadAttachment,
  deleteAttachment
} = require('../controllers/attachmentController');

const upload = require('../middleware/uploadAttachments');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /attachments/upload/{ticketId}:
 *   post:
 *     summary: Upload an attachment to a specific ticket
 *     tags:
 *       - Attachments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         description: The ID of the ticket to upload the attachment to
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Attachment file to upload
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Attachment uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.post('/upload/:ticketId', authenticate, upload.single('file'), uploadAttachment);

/**
 * @openapi
 * /attachments/getall/{ticketId}:
 *   get:
 *     summary: Get all attachments for a specific ticket
 *     tags:
 *       - Attachments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         description: The ID of the ticket to retrieve attachments for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of attachments for the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   url:
 *                     type: string
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.get('/getall/:ticketId', authenticate, getTicketAttachments);

/**
 * @openapi
 * /attachments/download/{attachmentId}:
 *   get:
 *     summary: Download a specific attachment by its ID
 *     tags:
 *       - Attachments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: attachmentId
 *         in: path
 *         required: true
 *         description: The ID of the attachment to download
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the requested file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Attachment not found
 *       500:
 *         description: Internal server error
 */
router.get('/download/:attachmentId', authenticate, downloadAttachment);

/**
 * @openapi
 * /attachments/delete/{attachmentId}:
 *   delete:
 *     summary: Delete a specific attachment by its ID
 *     tags:
 *       - Attachments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: attachmentId
 *         in: path
 *         required: true
 *         description: The ID of the attachment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       404:
 *         description: Attachment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:attachmentId', authenticate, deleteAttachment);

module.exports = router;
