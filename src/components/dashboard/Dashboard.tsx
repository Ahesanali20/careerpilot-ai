import { dashboardStats } from "../../data/dashboardStats";
import StatCard from "./StatCard";
import DashboardHeader from "../layout/DashboardHeader";
import QuickActions from "./QuickActions";
import JobMatchCard from "./JobMatchCard";
import { recentJobs } from "../../data/recentJobs";
import AnimatedPage from "../animations/AnimatedPage";

function Dashboard() {
  return (
    <AnimatedPage className="min-w-0 flex-1">
      <DashboardHeader />

      <main className="p-6 md:p-8">
        {/* Page heading */}
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-primary">OVERVIEW</p>

          <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Your Career Dashboard
          </h2>

          <p className="mt-2 text-sm text-text-secondary md:text-base">
            Track your resume, discover matching jobs, and manage your career
            journey.
          </p>
        </header>

        {/* Statistics */}
        <section
          aria-label="Career statistics"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {dashboardStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        {/* Quick Actions */}
        <QuickActions />

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Job Matches
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Opportunities matched to your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {recentJobs.map((job) => (
              <JobMatchCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      </main>
    </AnimatedPage>
  );
}

export default Dashboard;
