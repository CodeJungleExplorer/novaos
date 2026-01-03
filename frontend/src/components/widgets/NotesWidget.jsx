import { API_BASE_URL } from "../../utils/api";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

/**
 * Helper: date + time format
 */
const formatDateTime = (ts) =>
  new Date(ts).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function NotesWidget() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch(`${API_BASE_URL}/api/notes`);
    const data = await res.json();

    setNotes(
      data.map((n) => ({
        id: n._id,
        text: n.content,
        summary: n.summary,
        createdAt: n.createdAt,
      }))
    );
  };

  // ---------------- ADD ----------------
  const addNote = async () => {
    if (!input.trim()) return;

    const res = await fetch(`${API_BASE_URL}/api/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });

    const data = await res.json();

    setNotes((prev) => [
      {
        id: data._id,
        text: data.content,
        summary: data.summary,
        createdAt: data.createdAt,
      },
      ...prev,
    ]);

    setInput("");
  };

  // ---------------- DELETE ----------------
  const deleteNote = async (id) => {
    await fetch(`${API_BASE_URL}/api/notes/${id}`, {
      method: "DELETE",
    });

    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // ---------------- EDIT ----------------
  const startEditing = (note) => {
    setEditingId(note.id);
    setEditValue(note.text);
  };

  const saveEdit = async () => {
    if (!editValue.trim()) return;

    await fetch(`${API_BASE_URL}/api/notes/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editValue }),
    });

    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingId ? { ...n, text: editValue } : n
      )
    );

    setEditingId(null);
    setEditValue("");
  };

  // ---------------- AI SUMMARY ----------------
  const summarizeNote = async (noteId) => {
    if (!noteId) return;

    setLoadingId(noteId);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to summarize");
      }

      const data = await res.json();

      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, summary: data.summary } : n
        )
      );
    } catch (err) {
      console.error("Summarize failed:", err.message);
      alert("❌ Could not summarize note. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  // ---------------- SEARCH ----------------
  const filteredNotes = notes.filter((n) =>
    n.text.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- UI ----------------
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">📝 Notes</h1>
        <p className="text-gray-400 text-sm mt-1">
          Capture thoughts. Let AI organize them.
        </p>
      </div>

      {/* ADD NOTE */}
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Add a new note..."
          className="flex-1 h-10 bg-white/5 px-3 rounded-lg outline-none"
        />
        <button
          onClick={addNote}
          className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center"
        >
          <FaPlus />
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
        className="h-9 w-full bg-white/5 px-3 rounded-lg outline-none text-sm mb-4"
      />

      {/* NOTES LIST */}
      <div className="space-y-5 pb-10">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="
              bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3
              transition-transform duration-300 ease-out
              hover:scale-[1.03] hover:shadow-xl hover:shadow-black/30
            "
          >
            {/* TOP */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {editingId === note.id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    autoFocus
                    className="bg-white/10 px-2 py-1 rounded outline-none w-full"
                  />
                ) : (
                  <p
                    onDoubleClick={() => startEditing(note)}
                    className="cursor-pointer hover:underline font-medium wrap-break-word"
                  >
                    {note.text}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  🕒 {formatDateTime(note.createdAt)}
                </p>
              </div>

              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-400 hover:text-red-400 cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>

            {/* AI SUMMARY */}
            {note.summary && (
              <div className="text-sm text-purple-300 bg-white/5 p-2 rounded">
                <strong>AI Summary:</strong>
                <p className="mt-1 whitespace-pre-wrap">
                  {note.summary}
                </p>
              </div>
            )}

            {/* ACTION */}
            <button
              onClick={() => summarizeNote(note.id)}
              className="text-purple-400 text-sm hover:underline cursor-pointer"
            >
              {loadingId === note.id ? "Summarizing..." : "✨ Summarize"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
