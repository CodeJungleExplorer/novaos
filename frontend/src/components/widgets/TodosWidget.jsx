import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/api";

const formatDateTime = (ts) =>
  new Date(ts).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function TodosWidget() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ---------------- FETCH ----------------
  const fetchTodos = async () => {
    const res = await fetch(`${API_BASE_URL}/api/todos`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ---------------- ADD ----------------
  const addTodo = async () => {
    if (!input.trim()) return;

    await fetch(`${API_BASE_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    setInput("");
    fetchTodos();
  };

  // ---------------- TOGGLE ----------------
  const toggleTodo = async (todo) => {
    await fetch(`${API_BASE_URL}/api/todos/${todo._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });

    fetchTodos();
  };

  // ---------------- EDIT ----------------
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditValue(todo.text);
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;

    await fetch(`${API_BASE_URL}/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editValue }),
    });

    setEditingId(null);
    setEditValue("");
    fetchTodos();
  };

  // ---------------- DELETE ----------------
  const deleteTodo = async (id) => {
    await fetch(`${API_BASE_URL}/api/todos/${id}`, {
      method: "DELETE",
    });

    fetchTodos();
  };

  // ---------------- FILTER + SPLIT ----------------
  const filtered = todos.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  const pendingTodos = filtered.filter((t) => !t.done);
  const completedTodos = filtered.filter((t) => t.done);

  // ---------------- UI ----------------
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">🧾 Todos</h1>
        <p className="text-gray-400 text-sm mt-1">
          Focus on what matters. One task at a time.
        </p>
      </div>

      {/* ADD TODO */}
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTodo();
            }
          }}
          placeholder="Add a new todo..."
          className="flex-1 h-10 bg-white/5 px-3 rounded-lg outline-none"
        />

        <button
          onClick={addTodo}
          className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center"
        >
          <FaPlus />
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search todos..."
        className="h-9 w-full bg-white/5 px-3 rounded-lg outline-none text-sm mb-4"
      />

      {/* LIST */}
      <div className="space-y-8 pb-10">
        {/* -------- PENDING -------- */}
        <div className="space-y-4">
          <h4 className="text-sm text-gray-300">⏳ Pending</h4>

          {pendingTodos.length === 0 && (
            <p className="text-xs text-gray-500">No pending todos</p>
          )}

          {pendingTodos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              editingId={editingId}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={startEdit}
              saveEdit={saveEdit}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </div>

        {/* -------- COMPLETED -------- */}
        <div className="space-y-4">
          <h4 className="text-sm text-gray-300">✅ Completed</h4>

          {completedTodos.length === 0 && (
            <p className="text-xs text-gray-500">No completed todos</p>
          )}

          {completedTodos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              editingId={editingId}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={startEdit}
              saveEdit={saveEdit}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- TODO CARD ----------------
function TodoCard({
  todo,
  editingId,
  editValue,
  setEditValue,
  startEdit,
  saveEdit,
  toggleTodo,
  deleteTodo,
}) {
  return (
    <div
      className="
        bg-white/5 border border-white/10 rounded-2xl p-4
        transition-transform duration-300 ease-out
        hover:scale-[1.03] hover:shadow-xl hover:shadow-black/30
      "
    >
      <div className="flex gap-3 items-start">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo)}
          className="mt-1 cursor-pointer"
        />

        <div className="flex-1">
          {editingId === todo._id ? (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveEdit(todo._id);
                }
              }}
              autoFocus
              className="bg-white/10 px-2 py-1 rounded outline-none w-full"
            />
          ) : (
            <p
              onDoubleClick={() => startEdit(todo)}
              className={`cursor-pointer hover:underline ${
                todo.done ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.text}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            🕒 {formatDateTime(todo.createdAt)}
          </p>
        </div>

        <button
          onClick={() => deleteTodo(todo._id)}
          className="text-red-400 hover:text-red-400 cursor-pointer"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
