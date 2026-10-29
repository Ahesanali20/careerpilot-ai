import {
  LayoutDashboard,
  FileSearch,
  Target,
  Bookmark,
  Settings,
  Sparkles,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Resume Analyzer",
    path: "/resume-analyzer",
    icon: FileSearch,
  },
  {
    label: "Job Matcher",
    path: "/job-matcher",
    icon: Target,
  },
  {
    label: "Saved Jobs",
    path: "/saved-jobs",
    icon: Bookmark,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

navigationItems.push({
  label: "AI Cover Letter",
  path: "/cover-letter",
  icon: Sparkles,
});
