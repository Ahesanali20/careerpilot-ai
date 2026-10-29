import { useEffect, useMemo, useState } from "react";
import { Bookmark, BriefcaseBusiness, Clock3, MapPin, Search, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Job } from "../types/job";
import {
  clearSavedJobs,
  getSavedJobs,
  removeSavedJob,
  SAVED_JOBS_UPDATED_EVENT,
} from "../utils/savedJobs";
import AnimatedPage from "../components/animations/AnimatedPage";
import AnimatedCard from "../components/animations/AnimatedCard";

function SavedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"match" | "recent">("match");

  useEffect(() => {
    const refresh = () => setJobs(getSavedJobs());
    refresh();
    window.addEventListener(SAVED_JOBS_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(SAVED_JOBS_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...jobs]
      .filter((job) =>
        !normalizedQuery ||
        [job.title, job.company, job.location, ...job.skills].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      )
      .sort((a, b) => sortBy === "match" ? b.matchScore - a.matchScore : 0);
  }, [jobs, query, sortBy]);

  const handleClear = () => {
    if (jobs.length && window.confirm("Remove all saved jobs?")) clearSavedJobs();
  };

  return (
    <AnimatedPage className="mx-auto w-full max-w-7xl p-6 md:p-8">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">YOUR CAREER</p>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">Saved Jobs</h1>
          <p className="mt-2 text-text-secondary">Keep track of job opportunities you want to revisit.</p>
        </div>
        {jobs.length > 0 && (
          <button type="button" onClick={handleClear} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
            <Trash2 size={16} aria-hidden="true" /> Clear all
          </button>
        )}
      </header>

      {jobs.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search saved jobs</span>
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, company, location or skill" className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X size={16} /></button>}
          </label>
          <label className="sr-only" htmlFor="saved-jobs-sort">Sort saved jobs</label>
          <select id="saved-jobs-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value as "match" | "recent")} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="match">Best match</option>
            <option value="recent">Recently saved</option>
          </select>
        </div>
      )}

      {jobs.length === 0 ? (
        <AnimatedCard className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center shadow-sm" delay={2}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-primary"><Bookmark size={30} aria-hidden="true" /></div>
          <h2 className="mt-5 text-lg font-semibold text-text-primary">No saved jobs yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">Save interesting opportunities from your job matches and they will appear here for easy follow-up.</p>
          <Link to="/job-matcher" className="mt-6 inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover">Find matching jobs</Link>
        </AnimatedCard>
      ) : filteredJobs.length === 0 ? (
        <AnimatedCard className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center" delay={2}><Search className="mx-auto text-slate-400" size={28} aria-hidden="true" /><h2 className="mt-4 font-semibold text-text-primary">No jobs match your search</h2><button type="button" onClick={() => setQuery("")} className="mt-3 text-sm font-semibold text-primary hover:underline">Clear search</button></AnimatedCard>
      ) : (
        <section aria-label="Saved job opportunities" className="grid gap-4 xl:grid-cols-2">
          {filteredJobs.map((job) => (
            <motion.article key={job.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} transition={{ duration: 0.35 }} className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-indigo-400 to-accent opacity-80" />
              <div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-primary"><BriefcaseBusiness size={22} aria-hidden="true" /></div><div className="min-w-0"><h2 className="truncate text-lg font-bold text-text-primary">{job.title}</h2><p className="mt-1 truncate text-sm font-medium text-text-secondary">{job.company}</p></div></div><div className="shrink-0 rounded-xl bg-emerald-50 px-3 py-2 text-center"><p className="text-lg font-bold leading-none text-emerald-700">{job.matchScore}%</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700/80">Match</p></div></div>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary"><span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-slate-400" aria-hidden="true" />{job.location}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={15} className="text-slate-400" aria-hidden="true" />Posted {job.postedAt}</span></div>
              <div className="my-5 border-t border-border" /><div className="flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="rounded-lg border border-indigo-100 bg-indigo-50/70 px-2.5 py-1.5 text-xs font-medium text-indigo-700">{skill}</span>)}</div>
              <div className="mt-5 flex items-center justify-between gap-3"><p className="text-sm font-bold text-text-primary">{job.salary}</p><button type="button" onClick={() => removeSavedJob(job.id)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"><Trash2 size={16} aria-hidden="true" /> Remove</button></div>
            </motion.article>
          ))}
        </section>
      )}
    </AnimatedPage>
  );
}

export default SavedJobs;
