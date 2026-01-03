import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaStickyNote,
  FaFire,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";

import { API_BASE_URL } from "../utils/api";
import HabitAnalyticsCard from "../components/dashboard/HabitAnalyticsCard";
import WeeklyOverview from "../components/dashboard/WeeklyOverview";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/summary`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        console.error("Dashboard fetch failed:", err);
      });
  }, []);

  if (!data) {
    return (
      <p className="text-gray-400 p-4">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <h1 className="text-lg sm:text-2xl font-bold">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Notes" value={data.notes} icon={<FaStickyNote />} />
        <StatCard title="Habits" value={data.habits} icon={<FaFire />} />
        <StatCard title="Todos" value={data.todos} icon={<FaCheckCircle />} />
        <StatCard
          title="Completed Todos"
          value={data.completedTodos}
          icon={<FaCheckCircle />}
        />
        <StatCard
          title="Pending Todos"
          value={data.pendingTodos}
          icon={<FaHourglassHalf />}
        />
      </div>

      <motion.div whileHover={{ scale: 1.03 }}>
        <HabitAnalyticsCard />
      </motion.div>

      <motion.div whileHover={{ scale: 1.03 }}>
        <WeeklyOverview />
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.035 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="
        bg-white/10 border border-white/10 rounded-2xl p-5
        flex items-center gap-4
        hover:shadow-lg hover:shadow-black/30
        will-change-transform
      "
    >
      <div className="text-3xl text-blue-400 shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-400 truncate">
          {title}
        </p>
        <p className="text-2xl font-bold">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
