const { v4: uuidv4 } = require("uuid");
const Attachment = require("../models/Attachments");
const Ticket = require("../models/Tickets");
const fs = require("fs");



// Get all attachments for a specific ticket
const getTicketAttachments = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        // Verify that the ticket exists
        const ticket = await Ticket.findOne({ 
            where: { ticketId } 
        });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Fetch attachments for the ticket
        const attachments = await Attachment.findAll({
            where: { ticketId }
        });
        
        // Format attachments to match frontend expectations
        const formattedAttachments = attachments.map(attachment => {
            const attachmentData = attachment.toJSON ? attachment.toJSON() : attachment;
            const fileExtension = path.extname(attachmentData.fileName).toLowerCase();
            
            // Determine file type based on extension
            let fileType = 'file';
            if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(fileExtension)) {
                fileType = 'image';
            } else if (fileExtension === '.pdf') {
                fileType = 'pdf';
            } else if (['.xls', '.xlsx'].includes(fileExtension)) {
                fileType = 'excel';
            } else if (fileExtension === '.txt') {
                fileType = 'text';
            }
            
            return {
                id: attachmentData.attachmentId,
                name: attachmentData.fileName,
                type: fileType,
                url: `/api/attachments/${attachmentData.attachmentId}`
            };
        });
        
        res.status(200).json(formattedAttachments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Upload an attachment to a ticket
const uploadAttachment = async (req, res) => {
    // Note: This controller should be used with the multer middleware
    // Example usage in routes: router.post('/tickets/:ticketId/attachments', upload.single('file'), uploadAttachment);
    try {
        const { ticketId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        
        // Check if ticket exists
        const ticket = await Ticket.findOne({ 
            where: { ticketId } 
        });
        
        if (!ticket) {
            // Delete the uploaded file if ticket doesn't exist
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Create new attachment record
        const newAttachment = await Attachment.create({
            attachmentId: uuidv4(),
            ticketId,
            fileName: req.file.originalname,
            filePath: req.file.path
        });
        
        const attachmentData = newAttachment.toJSON ? newAttachment.toJSON() : newAttachment;
        const fileExtension = path.extname(attachmentData.fileName).toLowerCase();
        
        // Determine file type based on extension
        let fileType = 'file';
        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(fileExtension)) {
            fileType = 'image';
        } else if (fileExtension === '.pdf') {
            fileType = 'pdf';
        } else if (['.xls', '.xlsx'].includes(fileExtension)) {
            fileType = 'excel';
        } else if (fileExtension === '.txt') {
            fileType = 'text';
        }
        
        // Format the response
        const formattedAttachment = {
            id: attachmentData.attachmentId,
            name: attachmentData.fileName,
            type: fileType,
            url: `/api/attachments/${attachmentData.attachmentId}`
        };
        
        res.status(201).json(formattedAttachment);
    } catch (error) {
        // If there was an error and a file was uploaded, delete it
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: error.message });
    }
};

// Download a specific attachment
const downloadAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        
        const attachment = await Attachment.findOne({
            where: { attachmentId }
        });
        
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found." });
        }
        
        // Send the file as a download
        res.download(attachment.filePath, attachment.fileName, (err) => {
            if (err) {
                return res.status(500).json({ message: "Error downloading file." });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete an attachment
const deleteAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        
        const attachment = await Attachment.findOne({
            where: { attachmentId }
        });
        
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found." });
        }
        
        // Check if file exists and delete it
        if (fs.existsSync(attachment.filePath)) {
            fs.unlinkSync(attachment.filePath);
        }
        
        // Delete the database record
        await attachment.destroy();
        
        res.status(200).json({ message: "Attachment deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTicketAttachments,
    uploadAttachment,
    downloadAttachment,
    deleteAttachment
};