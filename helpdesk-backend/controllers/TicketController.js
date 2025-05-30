const { v4: uuidv4 } = require("uuid");
const Ticket = require("../models/Tickets");
const Comment = require("../models/Comments");
const Attachment = require("../models/Attachments");
const path = require("path");

// Get all tickets (with optional filtering)
const getAllTickets = async (req, res) => {
    try {
        const { status, category, priority, userId } = req.query;
        let filter = {};
        
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (userId) filter.userId = userId;
        
        const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
        
        const formattedTickets = tickets.map(ticket => {
            const ticketData = ticket.toObject();
            return {
                code: ticketData.ticketId.substring(0, 8),
                user: ticketData.userId,
                dateIssued: new Date(ticketData.createdAt).toLocaleDateString('en-GB'),
                status: ticketData.status,
                category: ticketData.category,
                issue: ticketData.Issue,
                priority: ticketData.priority,
                description: ticketData.description
            };
        });
        
        res.status(200).json(formattedTickets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get a single ticket with comments and attachments
const getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        const ticket = await Ticket.findOne({ ticketId });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 });
        const attachments = await Attachment.find({ ticketId });
        
        const formattedComments = comments.map(comment => {
            const commentData = comment.toObject();
            return {
                author: commentData.userId === 'system' ? 'System' : 'Support Staff',
                text: commentData.content,
                timestamp: new Date(commentData.createdAt).toLocaleDateString('en-GB') + ' ' + 
                          new Date(commentData.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            };
        });
        
        const formattedAttachments = attachments.map(attachment => {
            const attachmentData = attachment.toObject();
            const fileExtension = path.extname(attachmentData.fileName).toLowerCase();
            
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
                name: attachmentData.fileName,
                type: fileType,
                url: `/api/attachments/${attachmentData.attachmentId}`
            };
        });
        
        const ticketData = ticket.toObject();
        const formattedTicket = {
            code: ticketData.ticketId.substring(0, 8),
            user: ticketData.userId,
            dateIssued: new Date(ticketData.createdAt).toLocaleDateString('en-GB'),
            status: ticketData.status,
            category: ticketData.category,
            issue: ticketData.Issue,
            priority: ticketData.priority,
            description: ticketData.description,
            comments: formattedComments,
            attachments: formattedAttachments
        };
        
        res.status(200).json(formattedTicket);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update a ticket status
const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: "Status field is required." });
        }
        
        const ticket = await Ticket.findOne({ ticketId });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        ticket.status = status;
        await ticket.save();
        
        await Comment.create({
            commentId: uuidv4(),
            ticketId: ticketId, 
            userId: "system", 
            content: `Ticket status changed to ${status}`
        });
        
        res.status(200).json({ message: "Ticket status updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Close a ticket
const closeTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        const ticket = await Ticket.findOne({ ticketId });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        ticket.status = 'closed';
        await ticket.save();
        
        await Comment.create({
            commentId: uuidv4(),
            ticketId: ticketId, 
            userId: "system",
            content: "This ticket has been marked as closed. Awaiting user confirmation."
        });
        
        res.status(200).json({ message: "Ticket closed successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTickets,
    getTicketById,
    updateTicketStatus,
    closeTicket,
};
