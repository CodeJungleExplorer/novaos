import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { monthWallpapers } from "./monthWallpapers";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const days = [
  "Sunday","Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday"
];

export default function SidebarCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthIndex = currentDate.getMonth();
  const background = monthWallpapers[monthIndex];

  const goPrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), monthIndex - 1, 1)
    );

  const goNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), monthIndex + 1, 1)
    );

  const goToday = () => setCurrentDate(new Date());

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${monthIndex}-${currentDate.getFullYear()}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="
            relative rounded-2xl overflow-hidden
            border border-white/10
          "
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

          {/* CONTENT */}
          <div className="relative p-4 text-white space-y-2">
            {/* MONTH NAV */}
            <div className="flex justify-between items-center text-xs uppercase tracking-wide text-gray-300">
              <button onClick={goPrevMonth} className="hover:text-white">
                ❮
              </button>

              <span>
                {months[monthIndex]} {currentDate.getFullYear()}
              </span>

              <button onClick={goNextMonth} className="hover:text-white">
                ❯
              </button>
            </div>

            {/* DAY */}
            <div className="text-sm text-gray-300">
              {days[currentDate.getDay()]}
            </div>

            {/* DATE */}
            <div className="text-4xl font-semibold">
              {currentDate.getDate()}
            </div>

            {/* TODAY */}
            <button
              onClick={goToday}
              className="text-xs text-indigo-300 hover:text-indigo-200"
            >
              Today
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
