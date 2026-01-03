import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import OpenAI from "openai";
import AIActivity from "../models/AIActivity.js";
import Habit from "../models/Habit.js";
import Todo from "../models/Todo.js";
import Note from "../models/Note.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ---------------- PARSE TASK (AUTO SAVE) ---------------- */
router.post("/parse-task", async (req, res) => {
  const { input } = req.body;
  if (!input || !input.trim()) {
    return res.json({ type: "unknown" });
  }

  try {
    const prompt = `
Classify the input.

Rules:
- Repeating action → habit
- One-time task → todo
- Thought / reflection / question → note
- Keep text EXACTLY same as input

Return STRICT JSON only:
{
  "type": "habit" | "todo" | "note" | "unknown",
  "text": string,
  "frequency": "daily" | "weekly" | null
}

Input: "${input}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const parsed = JSON.parse(
      completion.choices[0].message.content
    );

    if (parsed.type === "habit") {
      await Habit.create({
        name: parsed.text,
        frequency: parsed.frequency || "daily",
      });

      await AIActivity.create({
        type: "parse",
        action: "habit_created",
        resultType: "habit",
      });
    }

    if (parsed.type === "todo") {
      await Todo.create({ text: parsed.text });

      await AIActivity.create({
        type: "parse",
        action: "todo_created",
        resultType: "todo",
      });
    }

    if (parsed.type === "note") {
      await Note.create({ content: parsed.text });

      await AIActivity.create({
        type: "parse",
        action: "note_created",
        resultType: "note",
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error("AI parse error:", err);
    res.json({ type: "unknown" });
  }
});

/* ---------------- AI INSIGHTS ---------------- */
router.get("/insights", async (req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const usage = await AIActivity.countDocuments({
    createdAt: { $gte: since },
  });

  const habits = await AIActivity.countDocuments({
    action: "habit_created",
    createdAt: { $gte: since },
  });

  const todos = await AIActivity.countDocuments({
    action: "todo_created",
    createdAt: { $gte: since },
  });

  const notes = await AIActivity.countDocuments({
    action: "note_created",
    createdAt: { $gte: since },
  });

  res.json({ usage, habits, todos, notes });
});

/* ---------------- AI SUGGESTIONS (FIXED & SPECIFIC) ---------------- */
router.post("/suggest", async (req, res) => {
  const { query } = req.body;

  const prompt = `
You are a professional productivity advisor.

Respond in EXACTLY this format:

Answer:
(one short paragraph directly answering the user's question)

Action Points:
- practical step 1
- practical step 2
- practical step 3

Conclusion:
(one short motivating but realistic closing sentence)

Rules:
- Be specific to the user's question
- Use generic motivational language
- Use emojis
- No headings other than the three specified

User Question:
"${query}"
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [{ role: "user", content: prompt }],
  });

  await AIActivity.create({
    type: "suggestion",
    action: "suggestion_generated",
    resultType: "insight",
  });

  res.json({
    suggestions: completion.choices[0].message.content.trim(),
  });
});


/* ---------------- NOTE SUMMARY (WORKING) ---------------- */
router.post("/summarize", async (req, res) => {
  try {
    const { noteId } = req.body;

    if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid noteId" });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const prompt = `
Summarize the note STRICTLY based on what is written.

Rules:
- Use ONLY simple factual bullet points
- Do NOT add explanations, advice, or extra context
- Do NOT use headings
- Do NOT generalize
- Do NOT assume intent beyond the text
- Maximum 3 bullets
- Each bullet must be one clear sentence

NOTE:
"${note.content}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    const summary = completion.choices[0].message.content.trim();

    note.summary = summary;
    await note.save();

    res.json({ noteId: note._id, summary });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ message: "AI summarization failed" });
  }
});


export default router;
