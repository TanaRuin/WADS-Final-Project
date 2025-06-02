const { v4: uuidv4 } = require("uuid");
const Ticket = require("../models/Tickets");
const Comment = require("../models/Comments");
const Attachment = require("../models/Attachments");
const User = require('../models/Users'); 
const path = require("path");

const getAllTickets = async (req, res) => {
    try {
        const { status, category, priority, userId } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (userId) filter.userId = userId;

        const tickets = await Ticket.find(filter).lean().sort({ createdAt: -1 });

        const formattedTickets = await Promise.all(
            tickets.map(async (ticket) => {
                console.log('Ticket:', ticket);
                let userName = 'Unknown User';

                try {
                    const user = await User.findOne({ userId: ticket.userId }).lean();
                    if (user) {
                        userName = `${user.firstName} ${user.lastName}`;
                    }
                } catch (err) {
                    console.error(`Error fetching user for ticket ${ticket._id}:`, err);
                }

                return {
                    ticketId: ticket.ticketId,
                    user: userName,
                    dateIssued: new Date(ticket.createdAt).toLocaleDateString('en-GB'),
                    status: ticket.status,
                    category: ticket.category,
                    issue: ticket.Issue, 
                    priority: ticket.priority,
                    description: ticket.description
                };
            })
        );

        res.status(200).json(formattedTickets);
    } catch (error) {
        console.error('getAllTickets error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findOne({ ticketId });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        // Get user's full name
        let userName = 'Unknown User';
        try {
            const user = await User.findOne({ userId: ticket.userId }).lean();
            if (user) {
                userName = `${user.firstName} ${user.lastName}`;
            }
        } catch (err) {
            console.error(`Error fetching user for ticket ${ticket.ticketId}:`, err);
        }

        // Get comments
        const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 });
        const formattedComments = comments.map(comment => {
            const commentData = comment.toObject();
            return {
                author: commentData.userId === 'system' ? 'System' : 'Support Staff',
                text: commentData.content,
                timestamp:
                    new Date(commentData.createdAt).toLocaleDateString('en-GB') +
                    ' ' +
                    new Date(commentData.createdAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
            };
        });

        // Get attachments
        const attachments = await Attachment.find({ ticketId });
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
                url: `/api/attachments/${attachmentData.attachmentId}`,
            };
        });

        // Final formatted ticket
        const ticketData = ticket.toObject();
        const formattedTicket = {
            ticketId: ticketData.ticketId,
            user: userName,
            dateIssued: new Date(ticketData.createdAt).toLocaleDateString('en-GB'),
            status: ticketData.status,
            category: ticketData.category,
            issue: ticketData.Issue,
            priority: ticketData.priority,
            description: ticketData.description,
            comments: formattedComments,
            attachments: formattedAttachments,
        };

        res.status(200).json(formattedTicket);
    } catch (error) {
        console.error('getTicketById error:', error);
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
