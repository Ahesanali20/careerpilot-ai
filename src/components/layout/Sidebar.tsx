import { NavLink } from "react-router-dom";
import { BriefcaseBusiness, Menu, Sparkles, X } from "lucide-react";
import { navigationItems } from "../../data/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
      {/* Mobile Top Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-sidebar/95 px-4 text-white shadow-lg backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary-hover to-accent shadow-md shadow-primary/25 ring-1 ring-white/25">
            <BriefcaseBusiness size={18} strokeWidth={2.4} className="text-white" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-sidebar" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">
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
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <motion.aside
        id="mobile-navigation"
        aria-label="Main navigation"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[min(19rem,85vw)] flex-col justify-between overflow-y-auto border-r border-white/10 bg-sidebar px-4 py-6 text-white shadow-2xl transition-transform duration-300 ease-out md:sticky md:top-0 md:z-auto md:w-64 md:translate-x-0 md:pt-6 md:shadow-none ${
          isOpen ? "translate-x-0 pt-20" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand (Desktop View) */}
          <div className="mb-8 hidden items-center gap-3 px-2 md:flex">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary-hover to-accent shadow-lg shadow-primary/25 ring-1 ring-white/25">
              <BriefcaseBusiness size={20} strokeWidth={2.4} className="text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-sidebar" />
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight text-white">
                CareerPilot AI
              </h1>
              <p className="text-xs text-slate-400">Your career companion</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Pages">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/30 ring-1 ring-white/15"
                        : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={19}
                    className="shrink-0 transition-transform duration-150 group-hover:scale-110"
                  />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Feature Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles size={15} />
          </div>
          <p className="text-xs font-semibold text-white">
            Career growth starts here
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            Find opportunities that match your skills.
          </p>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
