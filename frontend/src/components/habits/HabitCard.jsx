
import { FaFire } from "react-icons/fa";

const days = ["M", "T", "W", "T", "F", "S", "S"];

const isToday = (date) => {
  if (!date) return false;
  return new Date(date).toDateString() === new Date().toDateString();
};

const isYesterday = (date) => {
  if (!date) return false;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return new Date(date).toDateString() === y.toDateString();
};

export default function HabitCard({ habit, onMarkDone }) {
  // backend week starts from Monday
  const jsDay = new Date().getDay(); // 0=Sun,1=Mon...
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

  return (
    <div className="space-y-3">
      {/* STATUS */}
      <p className="text-sm text-gray-300">
        {habit.lastCompletedAt
          ? isToday(habit.lastCompletedAt)
            ? "✅ Done today"
            : isYesterday(habit.lastCompletedAt)
            ? "🕒 Done yesterday"
            : "⏳ Not done today"
          : "⏳ Not done yet"}
      </p>

      {/* MARK AS DONE */}
      {!isToday(habit.lastCompletedAt) && (
        <button
          onClick={onMarkDone}
          className="text-sm text-green-400 hover:underline cursor-pointer"
        >
          Mark as done
        </button>
      )}

      {/* STREAK */}
      <div className="flex items-center gap-2 text-orange-400">
        <FaFire />
        <span className="text-sm font-medium">{habit.streak} day streak</span>
      </div>

      {/* WEEK LABELS */}
      <div className="flex justify-between text-xs text-gray-400">
        {days.map((d, i) => (
          <span key={i} className="w-4 text-center">
            {d}
          </span>
        ))}
      </div>

      {/* WEEKLY DOTS */}
<div className="flex justify-between">
  {habit.weekly.map((_, i) => {
    const isDoneToday =
      i === todayIndex &&
      isToday(habit.lastCompletedAt);

    return (
      <span
        key={i}
        className={`w-3 h-3 rounded-full ${
          isDoneToday ? "bg-green-400" : "bg-gray-600"
        }`}
      />
    );
  })}
</div>

    </div>
  );
}
