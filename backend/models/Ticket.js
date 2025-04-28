const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  category: { type: String, required: true },
  priority: { type: String, required: true },
  issue: { type: String, required: true },
  description: { type: String, required: true },
  attachments: { type: String }, // You can expand this for file uploads
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);
