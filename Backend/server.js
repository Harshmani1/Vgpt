
import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import  getOpenAIAPIResponse  from "./utils/openai.js";
const app = express();
const PORT = 8083;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
   connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
};
