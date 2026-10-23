function DashboardHeader() {
  return (
    <header className="mb-8 flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-4 md:px-8">
      {/* Welcome message */}
      <div>
        <p className="text-sm text-text-secondary">Welcome back!</p>

        <h1 className="mt-1 text-lg font-semibold text-text-primary">
          Let's grow your career
        </h1>
      </div>

      {/* Profile area */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-primary"
          aria-label="User profile"
        >
          U
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-text-primary">User</p>
          <p className="text-xs text-text-secondary">Job Seeker</p>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
