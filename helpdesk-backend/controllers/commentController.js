const { v4: uuidv4 } = require("uuid");
const Comment = require("../models/Comments");
const Ticket = require("../models/Tickets");
const User = require("../models/Users");

// Get all comments for a ticket
const getComments = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Check if ticket exists
        const ticket = await Ticket.findOne({ ticketId });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Get comments sorted by creation time
        const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 });

        // Format comments with user info including profile picture
        const formattedComments = await Promise.all(
            comments.map(async (comment) => {
                let authorName = 'Unknown User';
                let profilePicture = null;
                
                try {
                    const user = await User.findOne({ userId: comment.userId });
                    if (user) {
                        authorName = `${user.firstName} ${user.lastName}`;
                        profilePicture = user.profileImage || null; // Add this line
                    }
                } catch (err) {
                    authorName = 'Unknown User';
                    profilePicture = null;
                }

                return {
                    id: comment.commentId,
                    author: authorName,
                    message: comment.content,
                    timestamp: comment.createdAt.toISOString(),
                    profilePicture: profilePicture // Add this line
                };
            })
        );

        res.json(formattedComments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new comment
const addComment = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: "Comment content is required" });
        }

        // Check if ticket exists
        const ticket = await Ticket.findOne({ ticketId });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Get user info before creating comment
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create new comment
        const newComment = new Comment({
            commentId: uuidv4(),
            ticketId,
            userId: req.user.userId,
            content: content.trim()
        });

        await newComment.save();

        // If the commenter is an admin, update ticket status to pending
        if (user.accessLevel === 'admin') { 
            ticket.status = 'pending';
            await ticket.save();
        }

        const authorName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';

        const responseComment = {
            id: newComment.commentId,
            author: authorName,
            message: newComment.content,
            timestamp: newComment.createdAt.toISOString(),
            profilePicture: user.profileImage || null // Add this line
        };

        res.status(201).json(responseComment);
    } catch (error) {
        console.error("addComment error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComments,
    addComment
};