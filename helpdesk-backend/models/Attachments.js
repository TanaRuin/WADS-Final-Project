const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const AttachmentSchema = new mongoose.Schema({
  attachmentId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  ticketId: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
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

const Attachment = mongoose.model("Attachment", AttachmentSchema);

module.exports = Attachment;
