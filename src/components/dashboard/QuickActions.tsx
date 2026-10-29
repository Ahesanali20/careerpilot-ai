import { FileSearch, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const actions = [
  {
    title: "Analyze Resume",
    description: "Review your resume and identify areas to improve.",
    path: "/resume-analyzer",
    icon: FileSearch,
    iconColor: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Match a Job",
    description: "Compare your skills with a job description.",
    path: "/job-matcher",
    icon: Target,
    iconColor: "bg-teal-50 text-teal-600",
  },
];

function QuickActions() {
  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Quick Actions
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Take the next step in your career journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <MotionLink
              key={action.path}
              to={action.path}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className={`shrink-0 rounded-xl p-3 ${action.iconColor}`}>
                <Icon size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-text-primary">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm leading-5 text-text-secondary">
                  {action.description}
                </p>
              </div>

              <ArrowRight
                size={18}
                className="shrink-0 text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-primary"
              />
            </MotionLink>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;
