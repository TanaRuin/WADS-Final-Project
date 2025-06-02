const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection configuration
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MongoDB URI not found in environment variables');
  process.exit(1);
}

// MongoDB connection options optimized for backend server
const options = {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Minimum number of connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  // Note: bufferMaxEntries and bufferCommands are Mongoose options, not MongoDB driver options
};

let client;
let clientPromise;

// Initialize MongoDB connection
const connectToDatabase = async () => {
  if (clientPromise) {
    return clientPromise;
  }

  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    
    console.log('Connecting to MongoDB...');
    await clientPromise;
    console.log('Successfully connected to MongoDB');
    
    return clientPromise;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

// Get database instance
const getDatabase = async () => {
  const client = await connectToDatabase();
  return client.db();
};

// Graceful shutdown
const closeConnection = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectToDatabase,
  getDatabase,
  closeConnection
};