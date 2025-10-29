import dotenv from "dotenv";
import prisma from './db/prisma';
import { app } from './app' // <-- Import the configured app

// --- Load Environment Variables ---
// This should be at the very top
dotenv.config({
  path: './.env' // Explicitly point to your .env file
});

const PORT = process.env.SERVERPORT || 8000; // Add a fallback port

// --- Server Startup Function ---
const startServer = async () => {
  try {
    // 1. Connect to the database
    await prisma.$connect();
    console.log("Database connected successfully!");

    // 2. Start the web server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.log("Error starting server or connecting to Database!");
    console.log(error);
    process.exit(1);
  }
};

// --- Execute Server Start ---
startServer();