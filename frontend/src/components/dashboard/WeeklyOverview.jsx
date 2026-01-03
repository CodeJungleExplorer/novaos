import { API_BASE_URL } from "../../utils/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WeeklyOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/weekly`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="bg-white/10 rounded-2xl p-5 text-gray-400">
        Loading weekly overview...
      </div>
    );
  }

  const { summary } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 border border-white/10 rounded-2xl p-5 space-y-4"
    >
      <h3 className="text-lg font-semibold">📊 Weekly Productivity</h3>

      {/* SCORE */}
      <div>
        <p className="text-sm text-gray-400 mb-1">Productivity Score</p>

        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">
            {summary.productivityScore}
          </span>
          <span className="text-gray-400">/ 100</span>
        </div>

        <div className="w-full h-3 bg-white/10 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-green-400 to-blue-500 transition-all"
            style={{
              width: `${summary.productivityScore}%`,
            }}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Stat label="Pending Todos" value={summary.pendingTodos} />
        <Stat label="Completed Todos" value={summary.completedTodos} />
        <Stat label="Habits Done" value={summary.habitsDone} />
        <Stat label="Notes Created" value={summary.notesCreated} />
      </div>
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
