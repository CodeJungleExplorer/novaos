import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { monthWallpapers } from "../components/calendar/monthWallpapers";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const bg = monthWallpapers[month];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isSameMonthYear =
    year === today.getFullYear() && month === today.getMonth();

  const isToday = (d) => isSameMonthYear && d === today.getDate();

  const years = Array.from(
    { length: 41 },
    (_, i) => today.getFullYear() - 20 + i
  );

  const goPrev = () => setCurrentDate(new Date(year, month - 1, 1));

  const goNext = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${month}-${year}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-screen p-6"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.3px]" />

        <div className="relative max-w-5xl mx-auto text-white">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 text-2xl font-semibold">
            <button onClick={goPrev} className="hover:text-indigo-300">
              ❮
            </button>

            <div className="flex gap-6 relative">
              {/* MONTH */}
              <div className="relative">
                <span
                  onClick={() => {
                    setShowMonths((p) => !p);
                    setShowYears(false);
                  }}
                  className="cursor-pointer hover:text-indigo-300"
                >
                  {months[month]}
                </span>

                <AnimatePresence>
                  {showMonths && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="
                        absolute top-full left-1/2 -translate-x-1/2 mt-3
                        bg-[#0b1220]
                        border border-white/10
                        rounded-xl p-3
                        grid grid-cols-3 gap-2
                        `z-999`
                        min-w-[260px]
                      "
                    >
                      {months.map((m, i) => (
                        <button
                          key={m}
                          onClick={() => {
                            setCurrentDate(new Date(year, i, 1));
                            setShowMonths(false);
                          }}
                          className="
                            text-sm px-3 py-2 rounded-lg
                            hover:bg-white/10
                            text-center
                          "
                        >
                          {m}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* YEAR */}
              <div className="relative">
                <span
                  onClick={() => {
                    setShowYears((p) => !p);
                    setShowMonths(false);
                  }}
                  className="cursor-pointer hover:text-indigo-300"
                >
                  {year}
                </span>

                <AnimatePresence>
                  {showYears && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="
                        absolute top-full left-1/2 -translate-x-1/2 mt-3
                        bg-[#0b1220]
                        border border-white/10
                        rounded-xl p-2
                        max-h-60 overflow-y-auto
                        `z-999`
                        min-w-[140px]
                      "
                    >
                      {years.map((y) => (
                        <button
                          key={y}
                          onClick={() => {
                            setCurrentDate(new Date(y, month, 1));
                            setShowYears(false);
                          }}
                          className="
                            block w-full text-sm px-4 py-2
                            rounded-lg hover:bg-white/10
                            text-center
                          "
                        >
                          {y}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button onClick={goNext} className="hover:text-indigo-300">
              ❯
            </button>
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 text-center text-sm text-gray-300 mb-2">
            {daysShort.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              return (
                <div
                  key={day}
                  className={`
                    h-16 flex items-center justify-center rounded-xl
                    transition cursor-pointer
                    ${
                      isToday(day)
                        ? "bg-indigo-500/80 ring-2 ring-indigo-300 font-bold"
                        : "bg-white/10 hover:bg-white/20"
                    }
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {isSameMonthYear && (
            <p className="text-center text-sm text-white-900 mt-4">
              Today is highlighted 💜
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
