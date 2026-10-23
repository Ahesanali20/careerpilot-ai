import { NavLink } from "react-router-dom";
import { navigationItems } from "../../data/navigation";

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-sidebar px-4 py-6 text-white">
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <span className="text-lg font-bold">C</span>
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight">CareerPilot AI</h1>
          <p className="text-xs text-slate-400">Your career companion</p>
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold">Career growth starts here</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Find opportunities that match your skills.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
