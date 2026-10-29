import type { Job } from "../../types/job";
import { BriefcaseBusiness, Bookmark, BookmarkCheck, Clock3, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { isJobSaved, SAVED_JOBS_UPDATED_EVENT, toggleSavedJob } from "../../utils/savedJobs";
import { motion } from "framer-motion";

type JobMatchCardProps = {
  job: Job;
};

function JobMatchCard({ job }: JobMatchCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refresh = () => setSaved(isJobSaved(job.id));
    refresh();
    window.addEventListener(SAVED_JOBS_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(SAVED_JOBS_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [job.id]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition duration-200 hover:border-indigo-200 hover:shadow-lg sm:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-indigo-400 to-accent opacity-80" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-primary ring-1 ring-indigo-100">
            <BriefcaseBusiness size={22} strokeWidth={1.8} />
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="truncate text-lg font-bold tracking-tight text-text-primary">{job.title}</h3>
            <p className="mt-1 truncate text-sm font-medium text-text-secondary">{job.company}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-start gap-2">
          <button type="button" onClick={() => setSaved(toggleSavedJob(job))} aria-pressed={saved} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} className="rounded-xl p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            {saved ? <BookmarkCheck size={19} aria-hidden="true" /> : <Bookmark size={19} aria-hidden="true" />}
          </button>
          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center ring-1 ring-emerald-100">
            <p className="text-lg font-bold leading-none text-emerald-700">{job.matchScore}%</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700/80">Match</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
        <span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-slate-400" />{job.location}</span>
        <span className="inline-flex items-center gap-1.5"><Clock3 size={15} className="text-slate-400" />Posted {job.postedAt}</span>
      </div>

      <div className="my-5 border-t border-border" />

      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">Skills that match</p>
      <div className="flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-lg border border-indigo-100 bg-indigo-50/70 px-2.5 py-1.5 text-xs font-medium text-indigo-700"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Salary range</p>
          <p className="mt-1 text-base font-bold text-text-primary">{job.salary}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default JobMatchCard;
