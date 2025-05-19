const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("../database");

const Attachment = sequelize.define("Attachment", {
    attachmentId: {
        type: String,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    ticketId: {
        type: String,
        allowNull: false,
        required: true
    },
    fileName: {
        type: String,
        allowNull: false,
        required: true
    },
    filePath: {
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



module.exports = Attachment;