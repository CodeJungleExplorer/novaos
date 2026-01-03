import express from "express";
import Note from "../models/Note.js";
import Todo from "../models/Todo.js";
import Habit from "../models/Habit.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const notesCount = await Note.countDocuments();
    const todosCount = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ done: true });
    const habitsCount = await Habit.countDocuments();

    res.json({
      notes: notesCount,
      todos: todosCount,
      completedTodos,
      pendingTodos: todosCount - completedTodos,
      habits: habitsCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= WEEKLY DASHBOARD =================
router.get("/weekly", async (req, res) => {
  try {
    // ---- week range (Mon–Sun) ----
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // ---- TODOS ----
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({
      done: true,
      updatedAt: { $gte: weekStart, $lte: weekEnd },
    });
    const pendingTodos = totalTodos - completedTodos;

    // ---- NOTES ----
    const notesThisWeek = await Note.countDocuments({
      createdAt: { $gte: weekStart, $lte: weekEnd },
    });

    // ---- HABITS ----
    const habitsThisWeek = await Habit.countDocuments({
      lastCompletedAt: { $gte: weekStart, $lte: weekEnd },
    });

    // ---- PRODUCTIVITY SCORE (A: 50/30/20) ----
    const todoScore = Math.min(completedTodos * 10, 50);
    const habitScore = Math.min(habitsThisWeek * 10, 30);
    const noteScore = Math.min(notesThisWeek * 5, 20);

    const productivityScore = todoScore + habitScore + noteScore;

    res.json({
      week: {
        start: weekStart,
        end: weekEnd,
      },
      summary: {
        pendingTodos,
        completedTodos,
        habitsDone: habitsThisWeek,
        notesCreated: notesThisWeek,
        productivityScore,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let doneToday = 0;
    let bestStreak = 0;

    habits.forEach((h) => {
      if (h.streak > bestStreak) {
        bestStreak = h.streak;
      }

      if (h.lastCompletedAt) {
        const last = new Date(h.lastCompletedAt);
        last.setHours(0, 0, 0, 0);

        if (last.getTime() === today.getTime()) {
          doneToday++;
        }
      }
    });

    const total = habits.length;
    const completionRate =
      total === 0 ? 0 : Math.round((doneToday / total) * 100);

    res.json({
      totalHabits: total,
      habitsDoneToday: doneToday,
      completionRate,
      bestStreak,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
