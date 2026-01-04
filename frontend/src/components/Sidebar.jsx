import NovaLogo from "../assets/novaos-logo.svg";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaStickyNote,
  FaFire,
  FaCheckCircle,
  FaRobot,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Sidebar({ onNavigate, mobile = false }) {
  const base = `
  flex items-center gap-3
  px-4 py-2.5
  rounded-xl
  text-[14.5px]
  tracking-wide
  transition-all
`;

  const inactive = "text-gray-400 hover:text-white hover:bg-white/5";

  const active = "bg-white/10 text-white font-medium shadow-inner";

  const linkClass = ({ isActive }) => `${base} ${isActive ? active : inactive}`;

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <aside
      className="
    w-56 min-h-screen
    bg-[#020617]
    md:bg-black/30
    md:backdrop-blur-xl
    border-r border-white/10
    px-4 py-6
    flex flex-col
  "
    >
      {/* LOGO */}
      <img
        src={NovaLogo}
        alt="NovaOS Logo"
        className="
    w-64
    mx-auto
    mb-6
    cursor-pointer
    select-none
    opacity-95
    drop-shadow-[0_0_18px_rgba(99,102,241,0.45)]
  "
      />

      {/* NAV */}
      <nav className="space-y-1 flex-1">
        <NavLink to="/" end className={linkClass} onClick={handleClick}>
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/notes" className={linkClass} onClick={handleClick}>
          <FaStickyNote /> Notes
        </NavLink>

        <NavLink to="/habits" className={linkClass} onClick={handleClick}>
          <FaFire /> Habits
        </NavLink>

        <NavLink to="/todos" className={linkClass} onClick={handleClick}>
          <FaCheckCircle /> Todos
        </NavLink>

        <NavLink to="/calendar" className={linkClass} onClick={handleClick}>
          <FaCalendarAlt /> Calendar
        </NavLink>

        <NavLink to="/ai" className={linkClass} onClick={handleClick}>
          <FaRobot /> AI Assistant
        </NavLink>
      </nav>
    </aside>
  );
}
