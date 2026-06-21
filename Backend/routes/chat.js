import Thread from "../models/Thread.js";
import express from "express";
import mongoose from "mongoose";
import getOpenAIAPIResponse from "../utils/openai.js";
const router = express.Router();
//test
router.post("/test", async (req, res) => {
  
    });
    
//1st Route
// Get All Threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); // Sort by updatedAt in descending order
     res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching threads" });
  }
  
});
//2nd Route
// Get Thread by ID ( GET /Thread/:Thread id)
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  console.log(threadId);
  try {
    const thread = await Thread.findById(threadId);//threadId:threadId _id:threadId
    console.log(thread);
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching chat" });
  }
});
//3rd Route
//DELETE Thread by ID ( DELETE /Thread/:Thread id)

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedthread = await Thread.findByIdAndDelete(threadId);
    if (!deletedthread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed deleting thread" });
  }
});

//4th Route
// POST /chat
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  try {
    let thread;

    // Only find existing thread if valid threadId is provided
    if (threadId && mongoose.Types.ObjectId.isValid(threadId)) {
      thread = await Thread.findById(threadId);
    }

    // If no valid thread, create a new one
    if (!thread) {
      thread = new Thread({
        threadId: new mongoose.Types.ObjectId(), // temporary ID for frontend
        title: message,
        messages: [{ role: "user", content: message }]
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    // Send the Mongo-generated _id back to frontend
    res.json({ reply: assistantReply, threadId: thread._id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});




router.post("/thread", async (req, res) => {
  try {
    const { title, messages } = req.body;

    const newThread = new Thread({
      title: title || "New Chat",
      messages: messages || []
    });

    const savedThread = await newThread.save();
    res.status(201).json(savedThread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating thread" });
  }
});

export default router;

