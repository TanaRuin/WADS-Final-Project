const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const CommentSchema = new mongoose.Schema({
  commentId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  ticketId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
