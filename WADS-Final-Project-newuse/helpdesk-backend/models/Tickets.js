const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  Issue: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'open',
    required: true
  }
}, {
  timestamps: true 
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
