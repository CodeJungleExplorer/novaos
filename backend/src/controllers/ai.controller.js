import openai from "../openai.js";
import Note from "../models/Note.js";

export const summarizeNote = async (req, res) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ message: "noteId is required" });
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const prompt = `
Summarize the following note in 2-3 concise bullet points.
Keep it clear and simple.

NOTE:
${note.content}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const summary = response.choices[0].message.content;

    note.summary = summary;
    await note.save();

    res.json({
      noteId: note._id,
      summary,
    });
  } catch (error) {
    console.error("AI Summary Error:", error.message);
    res.status(500).json({ message: "AI summarization failed" });
  }
};
