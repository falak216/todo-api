import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import dotenv from "dotenv";
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import Task from './models/task.js';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// 1. GET ALL TASKS
app.get("/tasks", async (req, res) => {
  try {
    const { completed } = req.query;
    let query = {};
    if (completed !== undefined) {
      query.completed = completed === "true";
    }
    const allTasks = await Task.find(query); 
    res.json({ success: true, count: allTasks.length, tasks: allTasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. CREATE TASK (POST)
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    const newTask = await Task.create({ title: title.trim() });
    res.status(201).json({ success: true, message: "Task created in MongoDB!", task: newTask });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 3. UPDATE TASK (PUT)
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (completed !== undefined) updates.completed = completed;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: 'after' }
    );

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. DELETE TASK (NEW)
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted from DB" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── THE MISSING PIECE: START THE SERVER ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server live at http://localhost:${PORT}`);
});