import express from "express";
import dotenv from "dotenv";
import prisma = require("./db/prisma");

dotenv.config();
const app = express();
const PORT = process.env.SERVERPORT || 3000;

app.use(express.json());

const startserver = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Error in connecting to Database!");
    console.log(error);
    process.exit(1);
  }
};

startserver();