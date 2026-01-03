import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import HabitCard from "../components/habits/HabitCard";
import { API_BASE_URL } from "../utils/api";

const formatDateTime = (ts) =>
  new Date(ts).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ---------- HELPERS ----------
  const fetchWeekly = async (habitId) => {
    const res = await fetch(
      `${API_BASE_URL}/api/habits/${habitId}/weekly`
    );
    return res.json();
  };

  const normalizeHabit = async (h) => {
    const weekly = await fetchWeekly(h._id);

    return {
      id: h._id,
      name: h.name,
      frequency: h.frequency || "Daily",
      streak: h.streak || 0,
      lastCompletedAt: h.lastCompletedAt,
      createdAt: h.createdAt,
      weekly,
    };
  };

  // ---------- FETCH ----------
  const loadHabits = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/habits`);
      const data = await res.json();
      const enriched = await Promise.all(data.map(normalizeHabit));
      setHabits(enriched);
    } catch (err) {
      console.error("Failed to load habits", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  // ---------- ADD ----------
  const addHabit = async () => {
    if (!input.trim()) return;

    try {
      setAdding(true);
      await fetch(`${API_BASE_URL}/api/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input }),
      });
      setInput("");
      loadHabits();
    } finally {
      setAdding(false);
    }
  };

  // ---------- DELETE ----------
  const deleteHabit = async (id) => {
    await fetch(`${API_BASE_URL}/api/habits/${id}`, {
      method: "DELETE",
    });
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // ---------- EDIT ----------
  const startEdit = (habit) => {
    setEditingId(habit.id);
    setEditValue(habit.name);
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;

    await fetch(`${API_BASE_URL}/api/habits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editValue }),
    });

    setEditingId(null);
    setEditValue("");
    loadHabits();
  };

  // ---------- DONE ----------
  const markAsDone = async (id) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, lastCompletedAt: new Date().toISOString() }
          : h
      )
    );

    await fetch(`${API_BASE_URL}/api/habits/${id}/complete`, {
      method: "PATCH",
    });

    loadHabits();
  };

  const filtered = habits.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Loading habits...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">🌱 Habits</h1>
        <p className="text-gray-400 text-sm mt-1">
          Build consistency. Small actions, every day.
        </p>
      </div>

      {/* ADD HABIT */}
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          placeholder="Add a new habit..."
          className="flex-1 h-10 bg-white/5 px-3 rounded-lg outline-none"
        />
        <button
          onClick={addHabit}
          disabled={adding}
          className="w-10 h-10 bg-orange-500/30 rounded-lg flex items-center justify-center"
        >
          <FaPlus />
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search habits..."
        className="h-9 w-full bg-white/5 px-3 rounded-lg outline-none text-sm mb-4"
      />

      {/* HABITS LIST */}
      <div className="space-y-5 pb-10">
        {filtered.map((habit) => (
          <div
            key={habit.id}
            className="
              bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3
              transition-transform duration-300 ease-out
              hover:scale-[1.03] hover:shadow-xl hover:shadow-black/30
            "
          >
            {/* TOP */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {editingId === habit.id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && saveEdit(habit.id)
                    }
                    autoFocus
                    className="bg-white/10 px-2 py-1 rounded outline-none w-full"
                  />
                ) : (
                  <h3
                    onDoubleClick={() => startEdit(habit)}
                    className="cursor-pointer hover:underline font-semibold wrap-break-word"
                  >
                    {habit.name}
                  </h3>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  🕒 {formatDateTime(habit.createdAt)}
                </p>
              </div>

              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-red-400 hover:text-red-500 cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>

            {/* HABIT CARD */}
            <HabitCard
              habit={habit}
              onMarkDone={() => markAsDone(habit.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
