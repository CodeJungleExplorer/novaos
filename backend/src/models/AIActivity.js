import mongoose from "mongoose";

const aiActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["parse", "suggestion", "insight"],
      required: true,
    },
    action: {
      type: String, // habit_created, todo_created, insight_generated
      required: true,
    },
    sourceText: String, // what user typed
    resultType: String, // habit / todo / insight
  },
  { timestamps: true }
);

export default mongoose.model("AIActivity", aiActivitySchema);
