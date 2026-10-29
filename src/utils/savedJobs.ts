import type { Job } from "../types/job";

export const SAVED_JOBS_STORAGE_KEY = "careerpilot-saved-jobs";
export const SAVED_JOBS_UPDATED_EVENT = "careerpilot:saved-jobs-updated";

export function getSavedJobs(): Job[] {
  if (typeof window === "undefined") return [];

  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(SAVED_JOBS_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(value) ? (value as Job[]) : [];
  } catch {
    return [];
  }
}

function setSavedJobs(jobs: Job[]) {
  window.localStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event(SAVED_JOBS_UPDATED_EVENT));
}

export function isJobSaved(jobId: number) {
  return getSavedJobs().some((job) => job.id === jobId);
}

export function toggleSavedJob(job: Job) {
  const jobs = getSavedJobs();
  const isSaved = jobs.some((savedJob) => savedJob.id === job.id);
  setSavedJobs(isSaved ? jobs.filter((savedJob) => savedJob.id !== job.id) : [job, ...jobs]);
  return !isSaved;
}

export function removeSavedJob(jobId: number) {
  setSavedJobs(getSavedJobs().filter((job) => job.id !== jobId));
}

export function clearSavedJobs() {
  setSavedJobs([]);
}
