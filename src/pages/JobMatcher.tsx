import { useState } from "react";
import { fetchJson } from "../utils/api";
import type { Job } from "../types/job";
import { isJobSaved, toggleSavedJob } from "../utils/savedJobs";
import { loadSettings } from "../utils/settings";
import {
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
  LoaderCircle,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Lightbulb,
  XCircle,
} from "lucide-react";

type MatchCategory =
  | "Strong Match"
  | "Moderate Match"
  | "Partial Match"
  | "Low Match";

type JobMatchResult = {
  matchScore: number;
  matchCategory: MatchCategory;
  scoreExplanation: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
};

function isJobMatchResult(value: unknown): value is JobMatchResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const result = value as Record<string, unknown>;

  return (
    typeof result.matchScore === "number" &&
    Number.isInteger(result.matchScore) &&
    result.matchScore >= 0 &&
    result.matchScore <= 100 &&
    ["Strong Match", "Moderate Match", "Partial Match", "Low Match"].includes(
      result.matchCategory as string,
    ) &&
    typeof result.scoreExplanation === "string" &&
    Array.isArray(result.matchingSkills) &&
    result.matchingSkills.every((item) => typeof item === "string") &&
    Array.isArray(result.missingSkills) &&
    result.missingSkills.every((item) => typeof item === "string") &&
    Array.isArray(result.strengths) &&
    result.strengths.every((item) => typeof item === "string") &&
    Array.isArray(result.suggestions) &&
    result.suggestions.every((item) => typeof item === "string")
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function getScoreBarColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-primary";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

function getCategoryStyle(category: MatchCategory) {
  switch (category) {
    case "Strong Match":
      return "bg-emerald-500/10 text-emerald-700";
    case "Moderate Match":
      return "bg-primary/10 text-primary";
    case "Partial Match":
      return "bg-amber-500/10 text-amber-700";
    case "Low Match":
      return "bg-red-500/10 text-red-700";
  }
}

function getJobId(title: string, company: string, description: string) {
  const source = `${title}|${company}|${description}`;
  return Array.from(source).reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0) >>> 0;
}

function createSavedJob(
  id: number,
  result: JobMatchResult,
  title: string,
  company: string,
): Job {
  return {
    id,
    title: title.trim() || "Matched opportunity",
    company: company.trim() || "Company not specified",
    location: "Not specified",
    matchScore: result.matchScore,
    skills: result.matchingSkills.slice(0, 6),
    salary: "Not specified",
    postedAt: "Just now",
  };
}

function SaveMatchButton({ job }: { job: Job }) {
  const [saved, setSaved] = useState(() => isJobSaved(job.id));

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleSavedJob(job))}
      aria-pressed={saved}
      className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
    >
      {saved ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}
      {saved ? "Saved" : "Save job"}
    </button>
  );
}

type ResultListProps = {
  title: string;
  items: string[];
  emptyMessage: string;
  icon: typeof CheckCircle2;
  iconClassName: string;
  iconBackground: string;
};

function ResultList({
  title,
  items,
  emptyMessage,
  icon: Icon,
  iconClassName,
  iconBackground,
}: ResultListProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ${iconBackground} ${iconClassName}`}>
          <Icon size={22} />
        </div>

        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-start gap-2.5 text-sm leading-6 text-text-primary"
            >
              <CheckCircle2
                size={17}
                className={`mt-1 shrink-0 ${iconClassName}`}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-text-secondary">{emptyMessage}</p>
      )}
    </section>
  );
}

function JobMatcher() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [matchedJobId, setMatchedJobId] = useState<number | null>(null);

  const isReadyToCompare =
    resumeText.trim().length >= 50 && jobDescription.trim().length >= 50;

  const handleCompare = async () => {
    setError("");
    setResult(null);
    setMatchedJobId(null);

    if (resumeText.trim().length < 50) {
      setError("Resume must contain at least 50 characters.");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError("Job description must contain at least 50 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const { response, data } = await fetchJson<{
        result?: unknown;
        error?: string;
      }>("/api/match-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(data.error || "Job matching failed. Please try again.");
      }

      if (!isJobMatchResult(data.result)) {
        throw new Error(
          "The server returned an invalid result. Please try again.",
        );
      }

      const jobId = getJobId(jobTitle.trim(), companyName.trim(), jobDescription.trim());
      setMatchedJobId(jobId);
      setResult(data.result);

      if (loadSettings().saveMatchesAutomatically && data.result.matchScore >= 80) {
        const job = createSavedJob(jobId, data.result, jobTitle, companyName);
        if (!isJobSaved(job.id)) toggleSavedJob(job);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl p-5 md:p-8">
      {/* Page heading */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles size={16} />
          <span>AI TOOLS</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Job Matcher
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary md:text-base">
          Compare your resume with a job description, discover skill gaps, and
          get actionable suggestions to improve your job application.
        </p>
      </div>

      {/* Input cards */}
      <div className="mb-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-text-primary">Job title (optional)
          <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="e.g. Frontend Developer" className="mt-2 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <label className="text-sm font-medium text-text-primary">Company name (optional)
          <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="e.g. TechNova" className="mt-2 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <label
              htmlFor="resumeText"
              className="text-base font-semibold text-text-primary"
            >
              Resume Text
            </label>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Your profile
            </span>
          </div>

          <textarea
            id="resumeText"
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your complete resume here, including skills, projects, education and experience..."
            rows={12}
            maxLength={30000}
            aria-describedby="resume-help"
            className="w-full resize-y rounded-xl border border-border bg-background p-4 text-sm leading-6 text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <div
            id="resume-help"
            className="mt-2 flex items-center justify-between gap-2 text-xs text-text-secondary"
          >
            <span>Minimum 50 characters</span>
            <span className="tabular-nums">{resumeText.length}/30000</span>
          </div>

          {resumeText.length > 0 && resumeText.trim().length < 50 && (
            <p className="mt-2 text-xs text-amber-600">
              Add more resume details to continue.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <label
              htmlFor="jobDescription"
              className="text-base font-semibold text-text-primary"
            >
              Job Description
            </label>

            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600">
              Target role
            </span>
          </div>

          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the complete job description here, including responsibilities, required skills and qualifications..."
            rows={12}
            maxLength={20000}
            aria-describedby="job-description-help"
            className="w-full resize-y rounded-xl border border-border bg-background p-4 text-sm leading-6 text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <div
            id="job-description-help"
            className="mt-2 flex items-center justify-between gap-2 text-xs text-text-secondary"
          >
            <span>Minimum 50 characters</span>
            <span className="tabular-nums">{jobDescription.length}/20000</span>
          </div>

          {jobDescription.length > 0 && jobDescription.trim().length < 50 && (
            <p className="mt-2 text-xs text-amber-600">
              Add more job details to continue.
            </p>
          )}
        </section>
      </div>

      {/* Compare button */}
      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleCompare}
          disabled={!isReadyToCompare || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Comparing...
            </>
          ) : (
            <>
              <Target size={18} />
              Compare Resume
            </>
          )}
        </button>

        <p className="text-xs leading-5 text-text-secondary">
          Your results are based on the resume and job description you provide.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600"
          role="alert"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div
          className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center"
          role="status"
          aria-live="polite"
        >
          <LoaderCircle
            size={32}
            className="mx-auto animate-spin text-primary"
          />

          <h2 className="mt-4 font-semibold text-text-primary">
            Analyzing your job match
          </h2>

          <p className="mt-2 text-sm text-text-secondary">
            Comparing skills, experience and job requirements...
          </p>
        </div>
      )}

      {/* Analysis results */}
      {result && !isLoading && (
        <section className="mt-8">
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-primary">YOUR RESULTS</p>
              {matchedJobId !== null && (
                <SaveMatchButton job={createSavedJob(matchedJobId, result, jobTitle, companyName)} />
              )}
            </div>

            <h2 className="mt-1 text-xl font-bold text-text-primary md:text-2xl">
              Job Match Analysis
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Review your strengths and identify areas for improvement.
            </p>
          </div>

          {/* Match score card */}
          <section className="mb-6 rounded-2xl border border-border bg-surface p-5 md:p-7">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-background p-6 md:min-w-44">
                <p className="text-sm font-medium text-text-secondary">
                  Match Score
                </p>

                <p
                  className={`mt-2 text-5xl font-bold tracking-tight ${getScoreColor(result.matchScore)}`}
                >
                  {result.matchScore}%
                </p>

                <span
                  className={`mt-3 rounded-full px-3 py-1 text-xs font-semibold ${getCategoryStyle(result.matchCategory)}`}
                >
                  {result.matchCategory}
                </span>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" />

                  <h3 className="font-semibold text-text-primary">
                    Your compatibility overview
                  </h3>
                </div>

                <p className="text-sm leading-7 text-text-secondary">
                  {result.scoreExplanation}
                </p>

                <div
                  className="mt-5 h-3 overflow-hidden rounded-full bg-background"
                  role="progressbar"
                  aria-label="Resume and job match score"
                  aria-valuenow={result.matchScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(result.matchScore)}`}
                    style={{ width: `${result.matchScore}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-text-secondary">
                  <span>0% — Low match</span>
                  <span>100% — Strong match</span>
                </div>
              </div>
            </div>
          </section>

          {/* Matching and missing skills */}
          <div className="mb-6 grid gap-5 md:grid-cols-2">
            <ResultList
              title="Matching Skills"
              items={result.matchingSkills}
              emptyMessage="No specific matching skills were returned."
              icon={CheckCircle2}
              iconClassName="text-emerald-600"
              iconBackground="bg-emerald-500/10"
            />

            <ResultList
              title="Missing or Weak Skills"
              items={result.missingSkills}
              emptyMessage="No specific skill gaps were returned."
              icon={XCircle}
              iconClassName="text-amber-600"
              iconBackground="bg-amber-500/10"
            />
          </div>

          {/* Strengths */}
          <div className="mb-6">
            <ResultList
              title="Your Strengths"
              items={result.strengths}
              emptyMessage="No specific strengths were returned."
              icon={CheckCircle2}
              iconClassName="text-emerald-600"
              iconBackground="bg-emerald-500/10"
            />
          </div>

          {/* Suggestions */}
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <Lightbulb size={22} />
              </div>

              <div>
                <h3 className="text-base font-semibold text-text-primary">
                  Suggestions to Improve
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                  Practical next steps based on your comparison.
                </p>
              </div>
            </div>

            {result.suggestions.length > 0 ? (
              <ol className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <li
                    key={`${suggestion}-${index}`}
                    className="flex items-start gap-3 text-sm leading-6 text-text-primary"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>

                    <span className="pt-0.5">{suggestion}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-text-secondary">
                No specific suggestions were returned.
              </p>
            )}
          </section>
        </section>
      )}
    </main>
  );
}

export default JobMatcher;
