import type { Job } from "../types/job";

export const recentJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Remote",
    matchScore: 92,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    salary: "₹6–10 LPA",
    postedAt: "2 days ago",
  },
  {
    id: 2,
    title: "React Developer",
    company: "PixelWorks",
    location: "Remote",
    matchScore: 85,
    skills: ["React", "JavaScript", "REST API"],
    salary: "₹5–8 LPA",
    postedAt: "4 days ago",
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "CloudBridge",
    location: "Hybrid",
    matchScore: 78,
    skills: ["TypeScript", "CSS", "Git"],
    salary: "₹7–12 LPA",
    postedAt: "1 week ago",
  },
];
