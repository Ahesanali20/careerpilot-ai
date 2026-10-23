import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navigationItems } from "../../data/navigation";
import { useEffect, useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-sidebar px-4 text-white shadow-lg md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold">
            C
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">
              CareerPilot AI
            </p>
            <p className="text-[11px] text-slate-400">Your career companion</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px] transition-opacity md:hidden"
        />
      )}

      <aside
        id="mobile-navigation"
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-[min(19rem,85vw)] flex-col overflow-y-auto border-r border-white/10 bg-sidebar px-4 py-6 pt-20 text-white shadow-2xl transition-transform duration-300 ease-out md:sticky md:top-0 md:z-auto md:w-64 md:translate-x-0 md:border-0 md:pt-6 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="mb-10 hidden items-center gap-3 px-2 md:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-bold">C</span>
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">CareerPilot AI</h1>
            <p className="text-xs text-slate-400">Your career companion</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-2" aria-label="Pages">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-indigo-950/30"
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
    </>
  );
}

export default Sidebar;
