const { v4: uuidv4 } = require("uuid");
const Comment = require("../models/Comments");
const Ticket = require("../models/Tickets");

// Get all comments for a specific ticket
const getTicketComments = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findOne({ ticketId });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 }).lean();

        const formattedComments = comments.map(comment => ({
            id: comment.commentId,
            author: comment.userId === 'system' ? 'System' : 'Support Staff',
            text: comment.content,
            timestamp: new Date(comment.createdAt).toLocaleDateString('en-GB') + ' ' +
                       new Date(comment.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        }));

        res.status(200).json(formattedComments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Comment content is required." });
        }

        const ticket = await Ticket.findOne({ ticketId });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        const newComment = new Comment({
            commentId: uuidv4(),
            ticketId,
            userId: req.user.id,  
            content
        });

        await newComment.save();

        // Fetch user info for the author name
        const user = await User.findOne({ userId: req.user.id });

        const authorName = user && `${user.firstName} ${user.lastName}`;

        const formattedComment = {
            id: newComment.commentId,
            author: authorName,
            text: newComment.content,
            timestamp: new Date(newComment.createdAt).toLocaleDateString('en-GB') + ' ' +
                       new Date(newComment.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
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

        const comment = await Comment.findOne({ commentId });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        await comment.deleteOne();

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
