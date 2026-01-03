import { API_BASE_URL } from "../utils/api";
import { useEffect, useState } from "react";
import { FaRobot, FaMagic } from "react-icons/fa";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState(null);

  const [insights, setInsights] = useState(null);

  // Structured suggestions
  const [answer, setAnswer] = useState("");
  const [points, setPoints] = useState([]);
  const [conclusion, setConclusion] = useState("");

  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  /* ---------------- LOAD INSIGHTS ---------------- */
  const loadInsights = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/insights`);
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error("Failed to load insights");
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  /* ---------------- ANALYZE INPUT ---------------- */
  const analyze = async () => {
    if (!input.trim()) return;

    setLoadingAnalyze(true);
    resetSuggestions();

    const isQuestion =
      input.trim().endsWith("?") ||
      input.toLowerCase().startsWith("how") ||
      input.toLowerCase().startsWith("what") ||
      input.toLowerCase().startsWith("why");

    // 👉 Questions → Suggestions
    if (isQuestion) {
      await getSuggestions(input);
      setLoadingAnalyze(false);
      return;
    }

    // 👉 Task / Habit / Note
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/ai/parse-task`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        }
      );

      const data = await res.json();

      if (data.type && data.type !== "unknown") {
        setPreview(data);

        // 🔥 Update insights immediately
        loadInsights();

        // Auto clear preview
        setTimeout(() => {
          setPreview(null);
          setInput("");
        }, 2000);
      }
    } catch (err) {
      console.error("Analyze failed");
    } finally {
      setLoadingAnalyze(false);
    }
  };

  /* ---------------- GET SUGGESTIONS ---------------- */
  const getSuggestions = async (text) => {
    if (!text.trim()) return;

    setLoadingSuggest(true);
    resetSuggestions();

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/ai/suggest`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        }
      );

      const data = await res.json();
      parseSuggestion(data.suggestions);

      loadInsights();
    } catch (err) {
      console.error("Suggestion failed");
    } finally {
      setLoadingSuggest(false);
    }
  };

  /* ---------------- PARSE AI RESPONSE ---------------- */
  const parseSuggestion = (text) => {
    let mode = "";
    let ans = "";
    let concl = "";
    const pts = [];

    text.split("\n").forEach((line) => {
      const l = line.trim();

      if (/answer/i.test(l)) mode = "answer";
      else if (/action/i.test(l)) mode = "points";
      else if (/conclusion/i.test(l)) mode = "conclusion";
      else if (mode === "points" && l.startsWith("-")) {
        pts.push(l.replace("-", "").trim());
      } else if (mode === "answer") {
        ans += l + " ";
      } else if (mode === "conclusion") {
        concl += l + " ";
      }
    });

    setAnswer(ans.trim());
    setPoints(pts);
    setConclusion(concl.trim());
  };

  const resetSuggestions = () => {
    setAnswer("");
    setPoints([]);
    setConclusion("");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold flex gap-2 items-center">
        <FaRobot /> AI Assistant
      </h1>

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && analyze()}
        placeholder="Type task, habit, note, or question…"
        className="w-full h-12 bg-white/5 px-4 rounded-xl outline-none"
      />

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={analyze}
          disabled={loadingAnalyze}
          className="px-4 py-2 bg-purple-500 rounded-lg disabled:opacity-50 cursor-pointer"
        >
          {loadingAnalyze ? "Analyzing..." : "Analyze"}
        </button>

        <button
          onClick={() => getSuggestions(input)}
          disabled={loadingSuggest}
          className="px-4 py-2 bg-indigo-500 rounded-lg disabled:opacity-50 cursor-pointer"
        >
          {loadingSuggest ? "Thinking..." : "Get Suggestions"}
        </button>
      </div>

      {/* PREVIEW */}
      {preview && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Auto added</p>
          <p>
            {preview.type === "habit" && "🌱 Habit: "}
            {preview.type === "todo" && "✅ Todo: "}
            {preview.type === "note" && "📝 Note: "}
            <strong>{preview.text}</strong>
          </p>
        </div>
      )}

      {/* INSIGHTS */}
      {insights && (
        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">📊 Weekly AI Insights</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>✨ AI used: {insights.usage}</p>
            <p>🌱 Habits: {insights.habits}</p>
            <p>✅ Todos: {insights.todos}</p>
            <p>📝 Notes: {insights.notes}</p>
          </div>
        </div>
      )}

      {/* STRUCTURED SUGGESTIONS */}
      {(answer || points.length > 0 || conclusion) && (
        <div className="bg-white/5 p-5 rounded-xl space-y-4">
          <h3 className="font-semibold flex gap-2 items-center">
            <FaMagic /> Personalized Guidance
          </h3>

          {answer && (
            <div>
              <h4 className="text-purple-400 font-semibold mb-1">💡 Answer</h4>
              <p className="text-sm text-gray-200">{answer}</p>
            </div>
          )}

          {points.length > 0 && (
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">
                📌 Action Points
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {conclusion && (
            <div className="bg-green-500/10 p-3 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-1">
                ✅ Conclusion
              </h4>
              <p className="text-sm">{conclusion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
