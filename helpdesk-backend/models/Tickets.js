const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../database");

const Ticket = sequelize.define("Ticket", {
    ticketId: {
        type: String,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    userId: {
        type: String,
        allowNull: false,
        required: true
    },
    Issue:{
        type: String,
        allowNull: false,
        required: true
    },
    description: {
        type: String,
        allowNull: false,
        required: true
    },
    category: {
        type: String,
        allowNull: false,
        required: true
    },
    priority: {
        type: String,
        allowNull: false,
        required: true
    },
    status: {
        type: String,
        allowNull: false,
        defaultValue: 'open',
        required: true
    },
     createdAt: {
    type: Date,
    default: Date.now
  },
     updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: true
});

module.exports = Ticket;