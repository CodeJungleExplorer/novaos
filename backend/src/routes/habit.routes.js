import express from "express";
import Habit from "../models/Habit.js";

const router = express.Router();

// GET habits
router.get("/", async (req, res) => {
  const habits = await Habit.find().sort({ createdAt: -1 });
  res.json(habits);
});

// --------- WEEKLY HABIT HISTORY ---------
router.get("/:id/weekly", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // week range (Mon–Sun)
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(now);
    start.setDate(now.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const entry = habit.history.find(
        (h) =>
          new Date(h.date).toDateString() ===
          date.toDateString()
      );

      let status = "pending";

      if (date < new Date().setHours(0, 0, 0, 0)) {
        status = entry?.done ? "done" : "missed";
      }

      if (date > new Date()) {
        status = "pending";
      }

      week.push(status);
    }

    res.json(week);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE habit
router.post("/", async (req, res) => {
  const habit = await Habit.create({
    name: req.body.name,
  });
  res.status(201).json(habit);
});

// TOGGLE complete
router.patch("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (typeof name === "string") {
      habit.name = name;
    }

    await habit.save();

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/complete", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // last completed date normalize
    const last = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null;

    if (last) last.setHours(0, 0, 0, 0);

    // 🛑 already completed today → do nothing
    if (last && last.getTime() === today.getTime()) {
      return res.json({
        message: "Already completed today",
        streak: habit.streak,
        lastCompletedAt: habit.lastCompletedAt,
      });
    }

    // 🧮 calculate difference in days
    let newStreak = 1;

    if (last) {
      const diffDays = (today - last) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        // yesterday done → continue streak
        newStreak = habit.streak + 1;
      } else {
        // missed one or more days → reset
        newStreak = 1;
      }
    }

    habit.streak = newStreak;
    habit.lastCompletedAt = today;
    // ---------- UPDATE HISTORY ----------
    const existingEntry = habit.history.find(
      (h) => new Date(h.date).getTime() === today.getTime()
    );

    if (!existingEntry) {
      habit.history.push({
        date: today,
        done: true,
      });
    }

    await habit.save();

    res.json({
      streak: habit.streak,
      lastCompletedAt: habit.lastCompletedAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE habit
router.delete("/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ message: "Habit deleted" });
});

export default router;
