import { useState } from "react";
import {
  FileText,
  BriefcaseBusiness,
  Building2,
  Sparkles,
  LoaderCircle,
  Copy,
  RotateCcw,
} from "lucide-react";
import { fetchJson } from "../utils/api";
import AnimatedCard from "../components/animations/AnimatedCard";
import AnimatedPage from "../components/animations/AnimatedPage";
import FloatingIcon from "../components/animations/FloatingIcon";
import LoadingDots from "../components/animations/LoadingDots";

export default function CoverLetter() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setError("");
    setCoverLetter("");

    if (
      !resumeText.trim() ||
      !jobDescription.trim() ||
      !companyName.trim() ||
      !jobTitle.trim()
    ) {
      setError(
        "Please enter your resume, job description, company name, and job title.",
      );
      return;
    }

    if (
      resumeText.length > 30000 ||
      jobDescription.length > 20000 ||
      companyName.length > 100 ||
      jobTitle.length > 100
    ) {
      setError(
        "Please keep your resume under 30,000 characters, the job description under 20,000, and names under 100.",
      );
      return;
    }

    setIsGenerating(true);

    try {
      const { response, data } = await fetchJson<{
        coverLetter?: unknown;
        error?: string;
      }>("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          companyName,
          jobTitle,
        }),
      });

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cover letter.");
      }

      if (typeof data.coverLetter !== "string" || !data.coverLetter.trim()) {
        throw new Error("AI returned an empty cover letter.");
      }

      setCoverLetter(data.coverLetter);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResumeText("");
    setJobDescription("");
    setCompanyName("");
    setJobTitle("");
    setCoverLetter("");
    setError("");
  };

  const handleCopy = async () => {
    if (!coverLetter) return;

    try {
      await navigator.clipboard.writeText(coverLetter);
    } catch {
      setError("Unable to copy. Please select and copy the text manually.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <AnimatedPage className="mx-auto max-w-6xl space-y-8 px-5 pb-10 sm:px-8 lg:px-10">
      <header>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <FileText size={25} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          AI Cover Letter Generator
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Create a personalized cover letter based on your resume and the job
          you want to apply for.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnimatedCard className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6" delay={2}>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Your Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add your resume and target job details.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="resumeText">
              Resume Text <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="resumeText"
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste your resume text here..."
              rows={7}
              maxLength={15000}
              className={`${inputClass} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {resumeText.length}/15000
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="jobDescription">
              Job Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here..."
              rows={7}
              maxLength={15000}
              className={`${inputClass} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {jobDescription.length}/15000
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="jobTitle">
                <BriefcaseBusiness className="mr-1 inline" size={15} />
                Job Title
              </label>
              <input
                id="jobTitle"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                placeholder="Frontend Developer"
                maxLength={100}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="companyName">
                <Building2 className="mr-1 inline" size={15} />
                Company Name
              </label>
              <input
                id="companyName"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Company name"
                maxLength={100}
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              aria-busy={isGenerating}
              aria-label={
                isGenerating
                  ? "Generating cover letter"
                  : "Generate cover letter"
              }
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
            >
              {isGenerating ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Sparkles size={18} aria-hidden="true" />
              )}
              {isGenerating ? (
                <>
                  Generating <LoadingDots />
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={17} />
              Reset
            </button>
          </div>
        </AnimatedCard>

        <AnimatedCard className="flex min-h-[400px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6" delay={3}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Generated Cover Letter
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your personalized letter will appear here.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!coverLetter}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Copy size={15} />
              Copy
            </button>
          </div>

          <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            {coverLetter ? (
              <p className="w-full whitespace-pre-wrap text-left text-sm leading-7 text-slate-700">
                {coverLetter}
              </p>
            ) : (
              <>
                <FloatingIcon className="mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                    <FileText size={28} />
                  </div>
                </FloatingIcon>
                <h3 className="font-semibold text-slate-800">
                  Your cover letter starts here
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Fill in your resume and job description, then generate your
                  personalized letter.
                </p>
              </>
            )}
          </div>
        </AnimatedCard>
      </div>
    </AnimatedPage>
  );
}
