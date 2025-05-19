const { MongoSequelize } = require("sequelize-mongodb");
require('dotenv').config();

const sequelize = new MongoSequelize(process.env.MONGO_URI);  

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = { sequelize, connectDB };
