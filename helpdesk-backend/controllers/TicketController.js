const { v4: uuidv4 } = require("uuid");
const Ticket = require("../models/Tickets");
const Comment = require("../models/Comments");
const User = require('../models/Users'); 

//get all tickets
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
//get ticket by User ID
const getTicketsByUserId = async (req, res) => {
    try {
        const userId = req.user.userId;

    
        const tickets = await Ticket.findOne({ userId });


        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "No tickets found for this user." });
        }


        let userName = 'Unknown User';
        try {
            const user = await User.findOne({ userId }).lean();
            if (user) {
                userName = `${user.firstName} ${user.lastName}`;
            }
        } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
        }

        // Format each ticket with comments
        const formattedTickets = await Promise.all(
            tickets.map(async (ticket) => {
                const comments = await Comment.find({ ticketId: ticket.ticketId }).sort({ createdAt: 1 });
                const formattedComments = await Promise.all(
                    comments.map(async (comment) => {
                        let authorName = 'Unknown User';
                        
                        try {
                            const user = await User.findOne({ userId: comment.userId });
                            authorName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
                        } catch (err) {
                            authorName = 'Unknown User';
                        }

                        return {
                            id: comment.commentId,
                            author: authorName,
                            message: comment.content,
                            timestamp: comment.createdAt.toISOString()
                        };
                    })
                );

                // Format ticket data
                const ticketData = ticket.toObject();
                return {
                    ticketId: ticketData.ticketId,
                    user: userName,
                    dateIssued: new Date(ticketData.createdAt).toLocaleDateString('en-GB'),
                    status: ticketData.status,
                    category: ticketData.category,
                    issue: ticketData.Issue,
                    priority: ticketData.priority,
                    description: ticketData.description,
                    comments: formattedComments
                };
            })
        );

        res.status(200).json(formattedTickets);
    } catch (error) {
        console.error('getTicketsByUserId error:', error);
        return res.status(500).json({ message: error.message });
    }
};

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { category, priority, Issue, description } = req.body;
    const userId = req.user.userId; 

    const newTicket = new Ticket({
      ticketId: uuidv4(),
      userId,
      category,
      priority,
      Issue,
      description,
      status: 'open'
    });

    await newTicket.save();

    res.status(201).json({ ticketId: newTicket.ticketId });
  } catch (error) {
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

        let userName = 'Unknown User';
        try {
            const user = await User.findOne({ userId: ticket.userId }).lean();
            if (user) {
                userName = `${user.firstName} ${user.lastName}`;
            }
        } catch (err) {
            console.error(`Error fetching user for ticket ${ticket.ticketId}:`, err);
        }

        const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 });
        const formattedComments = await Promise.all(
            comments.map(async (comment) => {
                let authorName = 'Unknown User';

                try {
                    const user = await User.findOne({ userId: comment.userId });
                    authorName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
                } catch (err) {
                    authorName = 'Unknown User';
                }

                return {
                    id: comment.commentId,
                    author: authorName,
                    message: comment.content,
                    timestamp: comment.createdAt.toISOString()
                };
            })
        );

        const ticketData = ticket.toObject();
        const formattedTicket = {
    ticketId: ticketData.ticketId,
    user: userName,
    createdAt: ticketData.createdAt.toISOString(), // Add this
    dateIssued: new Date(ticketData.createdAt).toLocaleDateString('en-GB'),
    status: ticketData.status,
    category: ticketData.category,
    Issue: ticketData.Issue,  // Uppercase 'I'
    priority: ticketData.priority,
    description: ticketData.description,
    comments: formattedComments
};

        res.status(200).json(formattedTicket);
    } catch (error) {
        console.error('getTicketById error:', error);
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
    getTicketsByUserId,
    closeTicket,
    createTicket
};