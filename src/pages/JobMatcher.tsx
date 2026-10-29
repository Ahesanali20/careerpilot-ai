import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function JobMatcher() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState("");

  const isReadyToCompare =
    resumeText.trim().length >= 50 && jobDescription.trim().length >= 50;

  // Extract the match score from the AI response.
  const matchScoreMatch = analysis.match(
    /Match Score\s*(?:\([^)]*\))?\s*:\s*(\d{1,3})/i,
  );

  const parsedScore = matchScoreMatch ? Number(matchScoreMatch[1]) : null;

  const matchScore =
    parsedScore !== null && parsedScore >= 0 && parsedScore <= 100
      ? parsedScore
      : null;

  const matchCategory =
    matchScore === null
      ? null
      : matchScore >= 80
        ? "Strong Match"
        : matchScore >= 60
          ? "Moderate Match"
          : matchScore >= 40
            ? "Partial Match"
            : "Low Match";

  // Extract individual sections from the AI-generated report.
  const extractSection = (heading: string) => {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const nextSection =
      "(?=\\n\\s*(?:#{1,6}\\s*)?(?:\\*\\*)?\\d+\\.|\\n\\s*---\\s*$|$)";

    const regex = new RegExp(
      `(?:#{1,6}\\s*)?(?:\\*\\*)?\\d*\\.?\\s*${escapedHeading}(?:\\*\\*)?\\s*:?\\s*\\n?([\\s\\S]*?)${nextSection}`,
      "i",
    );

    const match = analysis.match(regex);

    if (!match?.[1]) {
      return "";
    }

    return match[1].replace(/^\s*[:\-*]+\s*/, "").trim();
  };

  const matchingSkills = extractSection("Matching Skills");

  const missingSkills = extractSection("Missing or Weak Skills");

  const handleCompare = async () => {
    setError("");
    setAnalysis("");

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
      const response = await fetch("/api/match-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Job matching failed. Please try again.");
      }

      if (typeof data.analysis !== "string" || !data.analysis.trim()) {
        throw new Error("AI returned an empty analysis.");
      }

      setAnalysis(data.analysis);
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
          className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600"
          role="alert"
        >
          {error}
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
      {analysis && !isLoading && (
        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">YOUR RESULTS</p>

            <h2 className="mt-1 text-xl font-bold text-text-primary md:text-2xl">
              Job Match Analysis
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Review your strengths and identify areas for improvement.
            </p>
          </div>

          {/* Match score */}
          {matchScore !== null && (
            <div className="mb-6 rounded-2xl border border-border bg-surface p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    Resume Match Score
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-primary">
                      {matchScore}
                    </span>
                    <span className="text-lg text-text-secondary">/100</span>
                  </div>

                  {matchCategory && (
                    <p className="mt-2 text-sm font-semibold text-text-primary">
                      {matchCategory}
                    </p>
                  )}
                </div>

                <div className="w-full sm:max-w-md">
                  <div className="mb-2 flex justify-between text-xs text-text-secondary">
                    <span>Match progress</span>
                    <span>{matchScore}%</span>
                  </div>

                  <div
                    className="h-3 overflow-hidden rounded-full bg-border"
                    role="progressbar"
                    aria-label="Resume match score"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={matchScore}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${matchScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Matching and missing skills cards */}
          {(matchingSkills || missingSkills) && (
            <div className="mb-6 grid gap-5 md:grid-cols-2">
              {matchingSkills && (
                <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 md:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600">
                      <CheckCircle2 size={22} />
                    </div>

                    <h3 className="text-base font-semibold text-text-primary">
                      Matching Skills
                    </h3>
                  </div>

                  <div className="text-sm leading-7 text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_p]:my-2 [&_strong]:font-semibold">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {matchingSkills}
                    </ReactMarkdown>
                  </div>
                </section>
              )}

              {missingSkills && (
                <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 md:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600">
                      <AlertCircle size={22} />
                    </div>

                    <h3 className="text-base font-semibold text-text-primary">
                      Missing or Weak Skills
                    </h3>
                  </div>

                  <div className="text-sm leading-7 text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_p]:my-2 [&_strong]:font-semibold">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {missingSkills}
                    </ReactMarkdown>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Complete AI report */}
          <section className="rounded-2xl border border-border bg-surface p-5 md:p-7">
            <h3 className="mb-5 text-lg font-bold text-text-primary">
              Detailed Analysis
            </h3>

            <div className="text-sm leading-7 text-text-primary [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_li]:pl-1 [&_strong]:font-semibold [&_hr]:my-6 [&_hr]:border-border [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-background [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis}
              </ReactMarkdown>
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

export default JobMatcher;
