// backend/config/db.js

// Import mongoose to interact with MongoDB
const mongoose = require('mongoose');

// This function connects our app to the MongoDB database
const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we use await
    // process.env.MONGO_URI reads the connection string from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, log the host we connected to (helpful for debugging)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error clearly
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Exit the Node process with failure code (1)
    // There's no point running a server that can't reach its database
    process.exit(1);
  }
};

// Export the function so server.js can call it
module.exports = connectDB;