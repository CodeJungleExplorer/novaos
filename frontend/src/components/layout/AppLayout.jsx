import NovaLogo from "../../assets/novaos-logo.svg";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Footer from "./Footer";

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col overflow-x-hidden">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img
        src={NovaLogo}
        alt="NovaOS Logo"
        className="w-64 cursor-pointer select-none"
      />
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1">
        {/* DESKTOP SIDEBAR (ONLY DESKTOP) */}
        <aside className="hidden md:flex">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>

      {/* FOOTER (FULL WIDTH, MERGED VISUALLY) */}
      <Footer />

      {/* MOBILE SIDEBAR DRAWER (ONLY MOBILE) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* SIDEBAR */}
          <div className="relative w-64 h-full">
            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
