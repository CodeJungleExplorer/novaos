import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";

export default function WeeklyDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/weekly`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-300">
        Loading weekly dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="p-6 space-y-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold">
        📊 Weekly Productivity Overview
      </h1>

      {/* PRODUCTIVITY SCORE */}
      <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
        <p className="text-sm text-gray-400 mb-2">
          Productivity Score
        </p>

        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold">
            {summary.productivityScore}
          </span>
          <span className="text-gray-400">/ 100</span>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-white/10 h-3 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-green-400 to-blue-500 transition-all"
            style={{
              width: `${summary.productivityScore}%`,
            }}
          />
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Todos"
          value={summary.pendingTodos}
        />
        <StatCard
          label="Completed Todos"
          value={summary.completedTodos}
        />
        <StatCard
          label="Habits Done"
          value={summary.habitsDone}
        />
        <StatCard
          label="Notes Created"
          value={summary.notesCreated}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-xl p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
