const { v4: uuidv4 } = require("uuid");
const Comment = require("../models/Comments");
const Ticket = require("../models/Tickets");

// Get all comments for a specific ticket
const getTicketComments = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        // Verify that the ticket exists
        const ticket = await Ticket.findOne({ 
            where: { ticketId } 
        });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Fetch comments for the ticket
        const comments = await Comment.findAll({
            where: { ticketId },
            order: [['createdAt', 'ASC']]
        });
        
        // Format comments to match frontend expectations
        const formattedComments = comments.map(comment => {
            const commentData = comment.toJSON ? comment.toJSON() : comment;
            return {
                id: commentData.commentId,
                author: commentData.userId === 'system' ? 'System' : 'Support Staff',
                text: commentData.content,
                timestamp: new Date(commentData.createdAt).toLocaleDateString('en-GB') + ' ' + 
                          new Date(commentData.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            };
        });
        
        res.status(200).json(formattedComments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Add a comment to a ticket
const addComment = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: "Comment content is required." });
        }
        
        // Check if ticket exists
        const ticket = await Ticket.findOne({ 
            where: { ticketId } 
        });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Create new comment
        const newComment = await Comment.create({
            commentId: uuidv4(),
            ticketId,
            userId: req.user.id, // From authentication middleware
            content
        });
        
        const commentData = newComment.toJSON ? newComment.toJSON() : newComment;
        
        // Format the comment to match frontend expectations
        const formattedComment = {
            id: commentData.commentId,
            author: 'Support Staff',
            text: commentData.content,
            timestamp: new Date(commentData.createdAt).toLocaleDateString('en-GB') + ' ' + 
                      new Date(commentData.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        };
        
        res.status(201).json(formattedComment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        
        const comment = await Comment.findOne({ 
            where: { commentId } 
        });
        
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }
        
        // Only admins or the comment author should be able to delete
        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized to delete this comment." });
        }
        
        await comment.destroy();
        
        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTicketComments,
    addComment,
    deleteComment
};