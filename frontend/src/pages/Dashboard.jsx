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
  const [loading, setLoading] = useState(true);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/summary`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);

        // appreciation message
        setShowThanks(true);
        setTimeout(() => setShowThanks(false), 2500);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {/* MESSAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 space-y-2"
        >
          <motion.p
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-lg"
          >
            ⏳ Just a moment… waking things up for you ☕
          </motion.p>

          <motion.p
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm text-gray-500"
          >
            Good things take a second ✨
          </motion.p>
        </motion.div>

        {/* SKELETON CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* ================= SAFETY ================= */
  if (!data) {
    return (
      <div className="p-6 text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <h1 className="text-lg sm:text-2xl font-bold">
        Dashboard Overview
      </h1>

      {/* THANK YOU MESSAGE */}
      {showThanks && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-green-400 text-sm"
        >
          💜 You’re very patient <br />
          <span className="text-green-300">
            let’s go! 🚀
          </span>
        </motion.div>
      )}

      {/* STATS */}
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

/* ================= STAT CARD ================= */

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
      "
    >
      <div className="text-3xl text-blue-400 shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ================= SKELETON CARD ================= */

function SkeletonCard() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      className="
        bg-white/5 border border-white/10 rounded-2xl p-5
        flex items-center gap-4
      "
    >
      <div className="w-10 h-10 bg-white/10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-5 w-16 bg-white/20 rounded" />
      </div>
    </motion.div>
  );
}
