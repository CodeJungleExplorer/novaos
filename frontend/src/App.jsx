import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import NotesPage from "./pages/NotesPage";
import HabitsPage from "./pages/HabitsPage";
import TodosPage from "./pages/TodosPage";
import CalendarPage from "./pages/CalendarPage";
import WeeklyDashboard from "./pages/WeeklyDashboard";
import AIAssistant from "./pages/AIAssistant";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/dashboard/weekly" element={<WeeklyDashboard />} />
          <Route path="/ai" element={<AIAssistant />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
