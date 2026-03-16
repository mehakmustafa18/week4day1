import express, { Request, Response } from "express";
import cors from "cors";
import { Task, CreateTaskDTO } from "./types";

const app = express();
app.use(
  cors({
    origin: "https://week4day1-yp8k.vercel.app",
  }),
);
app.use(express.json());

// Default 2 tasks loaded on server start
let tasks: Task[] = [
  {
    id: 1,
    title: "Daily Team Standup Meeting",
    description:
      "Attend daily standup, share yesterday progress and today plan with the team",
    priority: "medium",
    category: "general",
    dueDate: "2026-03-17",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Review Pull Requests",
    description:
      "Review and approve pending pull requests from team members on GitHub",
    priority: "high",
    category: "general",
    dueDate: "2026-03-16",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

// GET /api/tasks - return all tasks
app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

// POST /api/tasks - add task with validation
app.post("/api/tasks", (req: Request, res: Response) => {
  const body = req.body as CreateTaskDTO;

  if (!body.title || body.title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const validPriorities = ["low", "medium", "high"];
  const validCategories = ["general", "work", "personal", "study"];

  if (body.priority && !validPriorities.includes(body.priority)) {
    return res.status(400).json({ error: "Invalid priority value" });
  }
  if (body.category && !validCategories.includes(body.category)) {
    return res.status(400).json({ error: "Invalid category value" });
  }

  const newTask: Task = {
    id: nextId++,
    title: body.title.trim(),
    description: body.description?.trim() || "",
    priority: body.priority || "medium",
    category: body.category || "general",
    dueDate: body.dueDate || "",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - toggle complete/incomplete
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.completed = !task.completed;
  res.json(task);
});

// DELETE /api/tasks/:id - delete task
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const exists = tasks.find((t) => t.id === id);
  if (!exists) return res.status(404).json({ error: "Task not found" });
  tasks = tasks.filter((t) => t.id !== id);
  res.json({ message: "Task deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running → http://localhost:${PORT}`);
  console.log(`📋 2 default tasks loaded!`);
});
