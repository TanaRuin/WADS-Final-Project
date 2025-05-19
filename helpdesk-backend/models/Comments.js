const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../database");

const Comment = sequelize.define("Comment", {
    commentId: {
        type: String,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    ticketId: {
        type: String,
        allowNull: false,
        required: true
    },
    userId: {
        type: String,
        allowNull: false,
        required: true
    },
    content: {
        type: String,
        allowNull: false,
        required: true
    },
     createdAt: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: true,
    updatedAt: false 
});


module.exports = Comment;