import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// GET all todos
router.get("/", async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// CREATE todo
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
  });
  res.status(201).json(todo);
});

// TOGGLE complete
router.patch("/:id", async (req, res) => {
  try {
    const { text, done } = req.body;

    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // ✅ ONLY update what is sent
    if (typeof text === "string") {
      todo.text = text;
    }

    if (typeof done === "boolean") {
      todo.done = done;
    }

    await todo.save();

    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE todo
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

export default router;
