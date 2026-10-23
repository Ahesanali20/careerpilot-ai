import { FileText, Target, Bookmark, ChartNoAxesCombined } from "lucide-react";

import type { LucideIcon } from "lucide-react";

type DashboardStat = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconColor: string;
};

export const dashboardStats: DashboardStat[] = [
  {
    title: "Resumes Analyzed",
    value: 0,
    description: "Upload a resume to get started",
    icon: FileText,
    iconColor: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Jobs Matched",
    value: 0,
    description: "Relevant jobs will appear here",
    icon: Target,
    iconColor: "bg-teal-50 text-teal-600",
  },
  {
    title: "Saved Jobs",
    value: 0,
    description: "Keep track of interesting roles",
    icon: Bookmark,
    iconColor: "bg-violet-50 text-violet-600",
  },
  {
    title: "Average Match Score",
    value: "—",
    description: "Available after matching a job",
    icon: ChartNoAxesCombined,
    iconColor: "bg-amber-50 text-amber-600",
  },
];
