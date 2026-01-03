const dotStyle = {
  done: "bg-green-400",
  missed: "bg-red-400/70",
  pending: "bg-gray-500/50",
};

export default function WeeklyDots({ weekly }) {
  return (
    <div className="flex gap-2 mt-3">
      {weekly.map((status, index) => (
        <span
          key={index}
          className={`w-3 h-3 rounded-full ${dotStyle[status]}`}
          title={status}
        />
      ))}
    </div>
  );
}
