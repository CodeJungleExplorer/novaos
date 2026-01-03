console.log("🚀 RUNNING BACKEND FROM:", import.meta.url);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dashboardRoutes from "./routes/dashboard.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import habitRoutes from "./routes/habit.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import connectDB from "./db.js";
import noteRoutes from "./routes/note.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB connect
connectDB();

app.use("/api/todos", todoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);


// test route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "NovaOS backend + DB running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
