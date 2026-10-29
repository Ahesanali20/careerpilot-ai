import { useRef, useState } from "react";
import {
  FileSearch,
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { fetchJson } from "../utils/api";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const analysisMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-7 text-2xl font-bold tracking-tight text-text-primary first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-7 border-b border-border pb-2 text-xl font-semibold tracking-tight text-text-primary first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-lg font-semibold text-text-primary">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-4 text-base font-semibold text-text-primary">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-3 leading-7 text-text-primary">{children}</p>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-inside list-decimal space-y-2 marker:font-semibold marker:text-primary">
      {children}
    </ol>
  ),
  ul: ({ children }) => (
    <ul className="my-4 list-inside list-disc space-y-2 marker:text-primary">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="leading-7 text-text-primary">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-primary/30 pl-4 text-text-secondary [&>p]:my-2">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div
      role="region"
      aria-label="Scrollable analysis table"
      tabIndex={0}
      className="my-5 w-full max-w-full overflow-x-auto rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <table className="w-full min-w-[640px] table-auto border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-background text-text-primary">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-border last:border-b-0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="border-b border-border px-4 py-3 text-left align-top font-semibold leading-5 break-words whitespace-normal">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 align-top leading-6 break-words whitespace-normal text-text-primary">
      {children}
    </td>
  ),
  hr: () => <hr className="my-6 border-border" />,
};

function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    handleSelectedFile(file);
  };

  const handleSelectedFile = (file: File) => {
    setSelectedFile(null);
    setExtractedText("");
    setAnalysis("");
    setError(null);

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be 5 MB or less.");
      return;
    }

    setSelectedFile(file);
  };

  return (
    <main className="mx-auto w-full max-w-4xl p-5 sm:p-8 lg:p-10">
      {/* Header Section */}
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 shadow-sm">
          <FileSearch className="h-6 w-6 text-primary" />
        </div>

        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary">
            AI Tools
          </span>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Resume Analyzer
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
            Get actionable insights into your resume, identify skill gaps, and
            discover opportunities to improve your profile.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="mt-6">
        <label
          htmlFor="resume-upload"
          onClick={(event) => {
            if (isAnalyzing) {
              event.preventDefault();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (isAnalyzing) return;
            setIsDragging(true);
          }}
          onDragLeave={() => {
            setIsDragging(false);
          }}
          onDrop={(event) => {
            if (isAnalyzing) return;
            event.preventDefault();
            setIsDragging(false);

            const file = event.dataTransfer.files[0];

            if (file) {
              handleSelectedFile(file);
            }
          }}
          className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 ${
            isAnalyzing
              ? "cursor-not-allowed opacity-60"
              : isDragging
                ? "cursor-pointer border-primary bg-indigo-50 shadow-md"
                : "cursor-pointer border-border bg-surface hover:border-primary hover:bg-indigo-50/30"
          }`}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-primary transition-transform duration-200 group-hover:scale-110">
            <UploadCloud className="h-7 w-7" />
          </div>

          <span className="text-base font-semibold text-text-primary sm:text-lg">
            Upload your resume
          </span>

          <span className="mt-1.5 text-sm text-text-secondary">
            Choose a PDF file from your computer
          </span>

          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-text-secondary">
            <FileText className="h-3.5 w-3.5" /> PDF only · Maximum file size 5
            MB
          </span>

          <span className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover">
            Browse files
          </span>
        </label>

        <input
          ref={fileInputRef}
          id="resume-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isAnalyzing}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Selected File Card */}
      {selectedFile && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
              <FileText className="h-5 w-5" />
            </div>

            <div className="truncate">
              <p className="truncate text-sm font-semibold text-text-primary">
                {selectedFile.name}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-text-secondary">
                <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setError(null);
              setExtractedText("");
              setAnalysis("");

              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Remove file"
            disabled={isAnalyzing}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!selectedFile || isAnalyzing}
          onClick={async () => {
            if (!selectedFile || isAnalyzing) return;

            setIsAnalyzing(true);
            setError(null);
            setExtractedText("");
            setAnalysis("");

            try {
              const { extractPdfText } = await import("../utils/extractPdfText");
              const text = await extractPdfText(selectedFile);

              if (!text.trim()) {
                setExtractedText("");
                setError(
                  "No readable text found in this PDF. It may be scanned or image-based.",
                );
                return;
              }

              if (text.trim().length < 50) {
                setExtractedText(text);
                setError("The extracted resume text must contain at least 50 characters.");
                return;
              }

              setExtractedText(text);
              const { response, data } = await fetchJson<{
                success?: boolean;
                analysis?: string;
                error?: string;
              }>("/api/analyze-resume", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  resumeText: text,
                }),
              });

              if (!response.ok) {
                throw new Error(data.error || "Resume analysis failed.");
              }

              setAnalysis(data.analysis ?? "");
            } catch (error) {
              console.error("Resume analysis failed:", error);

              setError(
                error instanceof Error
                  ? error.message
                  : "Resume analysis failed. Please try again.",
              );
            } finally {
              setIsAnalyzing(false);
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing Resume...</span>
            </>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </div>

      {/* Extracted Text Section */}
      {extractedText && (
        <section className="mt-8 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Extracted Resume Text
            </h2>
            <p className="mt-1 text-xs text-text-secondary sm:text-sm">
              Review the text extracted from your PDF before AI analysis.
            </p>
          </div>

          <textarea
            value={extractedText}
            readOnly
            rows={18}
            wrap="soft"
            aria-label="Extracted resume text"
            className="mt-4 block max-h-[70vh] min-h-[20rem] w-full max-w-full resize-y overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-background p-4 font-sans text-sm leading-7 tracking-[0.01em] text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-5"
            />
        </section>
      )}

      {analysis && (
        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              AI Resume Analysis
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Personalized feedback to help improve your resume.
            </p>
          </div>

          <div className="mt-4 min-w-0 text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={analysisMarkdownComponents}
            >
              {analysis}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </main>
  );
}

export default ResumeAnalyzer;
