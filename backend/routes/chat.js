import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// get one thread messages
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadID: threadId });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// delete thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadID: threadId });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// post chat
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadID: threadId });

        if (!thread) {
            // Create new thread
            thread = new Thread({
                threadID: threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            // Append to existing thread
            thread.messages.push({ role: "user", content: message });
        }

        // Get assistant reply
        const assistantReply = await getOpenAIAPIResponse(message);

        // Add assistant reply
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        // Save
        await thread.save();

        res.json({ reply: assistantReply, thread });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "something went wrong" });
    }
});

export default router;

