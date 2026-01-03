import { API_BASE_URL } from "../../utils/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HabitAnalyticsCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/habits`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="bg-white/10 rounded-2xl p-5 text-gray-400">
        Loading habits analytics...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 border border-white/10 rounded-2xl p-5 space-y-4"
    >
      <h3 className="text-lg font-semibold">🌱 Habit Consistency</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Stat label="Total Habits" value={data.totalHabits} />
        <Stat label="Done Today" value={data.habitsDoneToday} />
        <Stat label="Best Streak" value={`🔥 ${data.bestStreak}`} />
        <Stat label="Today %" value={`${data.completionRate}%`} />
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all"
            style={{ width: `${data.completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Today’s habit completion</p>
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
