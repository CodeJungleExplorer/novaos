import TodosWidget from "./widgets/TodosWidget";
import NotesWidget from "./widgets/NotesWidget";

export default function Dashboard() {
  return (
    <div className="flex-1 p-6 grid grid-cols-3 gap-6">
      <TodosWidget />
      <NotesWidget />
    </div>
  );
}
