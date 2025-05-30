const { v4: uuidv4 } = require("uuid");
const Attachment = require("../models/Attachments");
const Ticket = require("../models/Tickets");
const fs = require("fs");
const path = require("path");

// Get all attachments for a specific ticket
const getTicketAttachments = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        // Verify that the ticket exists using custom ticketId
        const ticket = await Ticket.findOne({ ticketId });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Fetch attachments for the ticket
        const attachments = await Attachment.find({ ticketId }).lean();
        
        // Format attachments to match frontend expectations
        const formattedAttachments = attachments.map(attachment => {
            const fileExtension = path.extname(attachment.fileName).toLowerCase();
            
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
                id: attachment.attachmentId,   // custom id field
                name: attachment.fileName,
                type: fileType,
                url: `/api/attachments/${attachment.attachmentId}`  // use custom id here
            };
        });
        
        res.status(200).json(formattedAttachments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Upload an attachment to a ticket
const uploadAttachment = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        
        // Check if ticket exists using custom ticketId
        const ticket = await Ticket.findOne({ ticketId });
        
        if (!ticket) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Create new attachment with custom attachmentId
        const newAttachment = new Attachment({
            attachmentId: uuidv4(),  // custom id instead of _id
            ticketId,
            fileName: req.file.originalname,
            filePath: req.file.path
        });
        
        await newAttachment.save();
        
        const fileExtension = path.extname(newAttachment.fileName).toLowerCase();
        
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
        
        const formattedAttachment = {
            id: newAttachment.attachmentId,
            name: newAttachment.fileName,
            type: fileType,
            url: `/api/attachments/${newAttachment.attachmentId}`
        };
        
        res.status(201).json(formattedAttachment);
    } catch (error) {
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
        
        // Find by custom attachmentId
        const attachment = await Attachment.findOne({ attachmentId });
        
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found." });
        }
        
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
        
        // Find by custom attachmentId
        const attachment = await Attachment.findOne({ attachmentId });
        
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found." });
        }
        
        if (fs.existsSync(attachment.filePath)) {
            fs.unlinkSync(attachment.filePath);
        }
        
        await attachment.deleteOne();
        
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
