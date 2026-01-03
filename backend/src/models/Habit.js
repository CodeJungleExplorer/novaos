import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    name: String,
    frequency: { type: String, default: "Daily" },

    streak: { type: Number, default: 0 },
    lastCompletedAt: Date,

    // 🆕 WEEKLY HISTORY
    history: [
      {
        date: Date,
        done: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
