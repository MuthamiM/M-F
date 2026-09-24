// src/app/careers/CareersClient.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Calendar,
  Share2,
  Check,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
  Paperclip,
  Loader2,
  Lock,
} from "lucide-react";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  experience: string;
  portfolio: string;
  coverNote: string;
  website: string; // Honeypot
}

type DocumentKind = "cv" | "resume";
type DocumentUploadStatus = "idle" | "uploading" | "done" | "error";

interface UploadedDocument {
  token: string;
  name: string;
  size: number;
}

const initialFormState: ApplicationForm = {
  name: "",
  email: "",
  phone: "",
  experience: "2-4 years",
  portfolio: "",
  coverNote: "",
  website: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function CareersClient() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [form, setForm] = useState<ApplicationForm>(initialFormState);
  const [copiedShare, setCopiedShare] = useState(false);

  // ── Step 1: Documents are stored as soon as each file is selected. ─────────
  const [cvUpload, setCvUpload] = useState<UploadedDocument | null>(null);
  const [resumeUpload, setResumeUpload] = useState<UploadedDocument | null>(null);
  const [cvUploadStatus, setCvUploadStatus] = useState<DocumentUploadStatus>("idle");
  const [resumeUploadStatus, setResumeUploadStatus] = useState<DocumentUploadStatus>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const documentsReady = Boolean(cvUpload || resumeUpload);

  // ── Step 2: Submission state ───────────────────────────────────────────────
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  const scrollToApply = useCallback(() => {
    const el = document.getElementById("apply-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsApplyModalOpen(true);
    }
  }, []);

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  }, []);

  const handleInputChange = (field: keyof ApplicationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateDocument = (label: string, file: File) => {
    const allowedTypes = [
      "",
      "application/pdf",
      "application/x-pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/octet-stream",
      "binary/octet-stream",
    ];
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

    if (![".pdf", ".doc", ".docx"].includes(extension) || (file.type && !allowedTypes.includes(file.type))) {
      return `${label} must be a PDF, DOC, or DOCX document.`;
    }
    if (file.size === 0) {
      return `${label} is empty. Please choose a valid document.`;
    }
    if (file.size > 10 * 1024 * 1024) {
      return `${label} exceeds the 10 MB limit.`;
    }
    return null;
  };

  const handleDocumentSelected = async (kind: DocumentKind, file: File | null) => {
    if (!file) return;

    const label = kind === "cv" ? "CV" : "Résumé";
    const validationError = validateDocument(label, file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    const setUpload = kind === "cv" ? setCvUpload : setResumeUpload;
    const setStatus = kind === "cv" ? setCvUploadStatus : setResumeUploadStatus;
    const input = kind === "cv" ? cvInputRef.current : resumeInputRef.current;

    setUpload(null);
    setStatus("uploading");
    setUploadError(null);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append(kind, file);

      const response = await fetch("/api/careers/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json().catch(() => null);
      const uploadedFile = data?.files?.[kind];

      if (!response.ok || !uploadedFile?.token) {
        throw new Error(data?.error ?? `Unable to upload your ${label}.`);
      }

      setUpload({
        token: uploadedFile.token,
        name: uploadedFile.name,
        size: uploadedFile.size,
      });
      setStatus("done");
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : `Unable to upload your ${label}. Please try again.`
      );
      setStatus("error");
    } finally {
      // Keep the native input empty so the same file can be selected again.
      if (input) input.value = "";
    }
  };

  const removeDocument = (kind: DocumentKind) => {
    if (kind === "cv") {
      setCvUpload(null);
      setCvUploadStatus("idle");
      if (cvInputRef.current) cvInputRef.current.value = "";
    } else {
      setResumeUpload(null);
      setResumeUploadStatus("idle");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
    setUploadError(null);
  };

  const resetApplicationDocuments = () => {
    setCvUpload(null);
    setResumeUpload(null);
    setCvUploadStatus("idle");
    setResumeUploadStatus("idle");
    setUploadError(null);
    if (cvInputRef.current) cvInputRef.current.value = "";
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  // ── Step 2: Submit application ─────────────────────────────────────────────
  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return; // Honeypot

    setSubmitError(null);

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.coverNote.trim()) {
      setSubmitError("Please complete all required fields.");
      setSubmitStatus("error");
      return;
    }

    if (!documentsReady || (!cvUpload && !resumeUpload)) {
      setSubmitError("Please upload your CV before submitting.");
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("submitting");

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          experience: form.experience,
          portfolio: form.portfolio.trim(),
          coverNote: form.coverNote.trim(),
          cvUploadToken: cvUpload?.token || resumeUpload?.token || "",
          resumeUploadToken: resumeUpload?.token || "",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? "Unable to submit your application.");
      }

      setSubmitStatus("success");
      setForm(initialFormState);
      resetApplicationDocuments();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Unable to submit right now. Please email info@mftechnologies.org directly."
      );
      setSubmitStatus("error");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Reusable form UI (used in both page and modal)
  // ─────────────────────────────────────────────────────────────────────────
  const renderApplicationForm = (isModal: boolean = false) => (
    <div className="space-y-6">
      {/* ── STEP 1: Upload Documents ────────────────────────────────────── */}
      <div className={`rounded-lg border ${documentsReady ? "border-emerald-200 bg-emerald-50/60" : "border-fog/30 bg-cloud/40"} p-4 space-y-3`}>
        {/* Step header */}
        <div className="flex items-center gap-2.5">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${documentsReady ? "bg-emerald-600 text-white" : "bg-graphite text-white"}`}>
            {documentsReady ? <Check className="h-3.5 w-3.5" /> : "1"}
          </div>
          <div>
            <p className="text-xs font-bold text-graphite">Upload Your Documents</p>
            <p className="text-[10px] text-slate">Each file is securely saved now and attached when you submit</p>
          </div>
        </div>

        {uploadError && (
          <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-[11px]" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-graphite flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Curriculum Vitae (CV) <span className="text-red-500">*</span>
            </label>
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={cvUploadStatus === "uploading"}
              onChange={(event) => {
                void handleDocumentSelected("cv", event.target.files?.[0] ?? null);
              }}
              className="w-full px-2.5 py-1.5 rounded border border-fog/30 text-xs text-graphite bg-white file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-graphite file:text-white file:cursor-pointer hover:border-graphite transition-colors disabled:opacity-60"
            />
            {cvUploadStatus === "uploading" && (
              <p className="text-[10px] text-slate flex items-center gap-1" aria-live="polite">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving CV securely…
              </p>
            )}
            {cvUpload && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-white border border-emerald-200 text-[11px] text-emerald-800">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold truncate">{cvUpload.name}</span>
                  <span className="text-slate shrink-0">({(cvUpload.size / 1024).toFixed(0)} KB)</span>
                </div>
                <button type="button" onClick={() => removeDocument("cv")} className="text-slate hover:text-red-600 shrink-0" aria-label="Remove CV">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {!cvUpload && cvUploadStatus !== "uploading" && <p className="text-[10px] text-slate">PDF, DOC, DOCX — Max 10 MB</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-graphite flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              Résumé / Cover Letter <span className="text-red-500">*</span>
            </label>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={resumeUploadStatus === "uploading"}
              onChange={(event) => {
                void handleDocumentSelected("resume", event.target.files?.[0] ?? null);
              }}
              className="w-full px-2.5 py-1.5 rounded border border-fog/30 text-xs text-graphite bg-white file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-graphite file:text-white file:cursor-pointer hover:border-graphite transition-colors disabled:opacity-60"
            />
            {resumeUploadStatus === "uploading" && (
              <p className="text-[10px] text-slate flex items-center gap-1" aria-live="polite">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving résumé securely…
              </p>
            )}
            {resumeUpload && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-white border border-emerald-200 text-[11px] text-emerald-800">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold truncate">{resumeUpload.name}</span>
                  <span className="text-slate shrink-0">({(resumeUpload.size / 1024).toFixed(0)} KB)</span>
                </div>
                <button type="button" onClick={() => removeDocument("resume")} className="text-slate hover:text-red-600 shrink-0" aria-label="Remove résumé">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {!resumeUpload && resumeUploadStatus !== "uploading" && <p className="text-[10px] text-slate">PDF, DOC, DOCX — Max 10 MB</p>}
          </div>
        </div>
      </div>

      {/* ── STEP 2: Application details ──────────────────────────────────── */}
      <form onSubmit={handleApplicationSubmit} className="space-y-4">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Step header */}
        <div className={`flex items-center gap-2.5 p-3 rounded-lg border ${documentsReady ? "border-fog/30 bg-white" : "border-fog/20 bg-fog/5 opacity-60"}`}>
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${documentsReady ? "bg-graphite text-white" : "bg-fog/30 text-slate"}`}>
            {documentsReady ? "2" : <Lock className="h-3 w-3" />}
          </div>
          <div>
            <p className="text-xs font-bold text-graphite">
              {documentsReady ? "Fill In Your Details" : "Your Application Details"}
            </p>
            <p className="text-[10px] text-slate">
              {documentsReady
                ? "Your documents are saved; complete your personal information below"
                : "Upload both documents first to unlock this step"}
            </p>
          </div>
        </div>

        {/* Fields — disabled until upload done */}
        <fieldset disabled={!documentsReady} className={!documentsReady ? "opacity-50 pointer-events-none select-none" : ""}>
          <div className="space-y-4">
            {submitError && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-graphite block text-xs">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g. Jane Wanjiru"
                className="w-full px-3 py-2 rounded border border-fog/30 text-xs text-graphite focus:outline-hidden focus:border-graphite bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-graphite block text-xs">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2 rounded border border-fog/30 text-xs text-graphite focus:outline-hidden focus:border-graphite bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-graphite block text-xs">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full px-3 py-2 rounded border border-fog/30 text-xs text-graphite focus:outline-hidden focus:border-graphite bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-graphite block text-xs">
                  Work Experience
                </label>
                <select
                  value={form.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  className="w-full px-3 py-2 rounded border border-fog/30 text-xs text-graphite focus:outline-hidden focus:border-graphite bg-white"
                >
                  <option value="1-2 years">1–2 years</option>
                  <option value="2-4 years">2–4 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-graphite block text-xs">
                  GitHub / Portfolio URL
                </label>
                <input
                  type="url"
                  value={form.portfolio}
                  onChange={(e) => handleInputChange("portfolio", e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded border border-fog/30 text-xs text-graphite focus:outline-hidden focus:border-graphite bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-graphite block text-xs">
                Summary of Qualifications &amp; Background{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.coverNote}
                onChange={(e) => handleInputChange("coverNote", e.target.value)}
                placeholder="Briefly describe your experience with Python, PostgreSQL, and core backend architecture..."
                className="w-full px-3 py-2 rounded border border-fog/30 text-xs text-graphite focus:outline-hidden focus:border-graphite bg-white resize-y"
              />
            </div>
          </div>
        </fieldset>

        {/* Submit row */}
        <div className="pt-2 flex items-center justify-between border-t border-fog/20 gap-3">
          <div className="text-[11px] text-slate">
            Sent to{" "}
            <span className="font-mono text-graphite font-semibold">
              info@mftechnologies.org
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isModal && (
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="px-4 py-2 rounded text-slate hover:text-graphite text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitStatus === "submitting" || !documentsReady}
              className="px-6 py-2.5 rounded bg-graphite hover:bg-slate text-white text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-xs"
            >
              {submitStatus === "submitting" ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting…</>
              ) : (
                <><Send className="h-3.5 w-3.5" /> Submit Application</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <main className="min-h-screen bg-cloud text-graphite">
      {/* Top Breadcrumb & Portal Bar */}
      <section className="bg-white border-b border-fog/20">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Careers", href: "/careers" }, { label: "Job Details" }]} />
        </div>
      </section>

      {/* Job Header Card */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white border border-fog/20 rounded-lg p-6 sm:p-8 mb-6 shadow-2xs">
          <div className="text-xs font-medium text-slate uppercase tracking-wider mb-2">
            M&amp;F Technologies &bull; Full time
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-graphite mb-2">
            Software Developer (Backend &amp; Core Systems)
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate mb-6">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate" />
              Nairobi Area, Kenya
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate" />
              Posted on 18/09/2026
            </span>
            <span>&bull;</span>
            <span>Job ID: MFT-2026-01</span>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-fog/20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={scrollToApply}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-graphite hover:bg-slate text-white text-xs font-semibold transition-colors shadow-xs"
              >
                I&apos;m interested
              </button>

              <a
                href="mailto:?subject=Job%20Opening:%20Software%20Developer%20at%20M%26F%20Technologies&body=Here%20is%20a%20job%20opening%20at%20M%26F%20Technologies:%0A%0Ahttps://mftechnologies.org/careers"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-fog/30 bg-white hover:bg-cloud text-graphite text-xs font-medium transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-slate" />
                Share job via email
              </a>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate hover:text-graphite transition-colors"
            >
              {copiedShare ? (
                <>
                  <Check className="h-3.5 w-3.5 text-graphite" />
                  <span className="font-semibold">Link copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share this job with your network</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Two Column Layout: Main Content + Job Information Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-fog/20 rounded-lg p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-slate leading-relaxed">
              {/* About Us */}
              <section className="space-y-3">
                <h2 className="text-base font-bold text-graphite">About Us</h2>
                <p>
                  M&amp;F Technologies is a financial technology company based in Nairobi, Kenya. We build and maintain
                  core financial infrastructure, lending management platforms, double-entry accounting ledgers, and transaction
                  middleware for financial institutions and credit providers across East Africa.
                </p>
                <p>
                  Our engineering team focuses on building reliable, secure, and maintainable software systems that handle
                  continuous transactional workflows with zero downtime and strict data consistency.
                </p>
              </section>

              {/* Job Description */}
              <section className="space-y-3">
                <h2 className="text-base font-bold text-graphite">Job Description</h2>
                <p>
                  We are looking for a dedicated and disciplined Software Developer to join our backend engineering team
                  working onsite at our Nairobi office in Westlands. You will be responsible for designing, implementing,
                  and supporting backend APIs, database schemas, and integration services that power our core financial systems.
                </p>
                <p>
                  The ideal candidate has a solid foundation in Python, practical experience with relational databases (PostgreSQL),
                  and experience integrating third-party payment rails or RESTful web services. A detail-oriented and systematic approach
                  to software reliability, data integrity, and clean code is essential.
                </p>
              </section>

              {/* Responsibilities */}
              <section className="space-y-3">
                <h2 className="text-base font-bold text-graphite">Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Develop, test, and maintain backend web services and RESTful APIs using Python (Django / Flask).</li>
                  <li>Design and optimize PostgreSQL database schemas, write efficient queries, and ensure strict ACID transaction compliance.</li>
                  <li>Integrate and maintain payment gateways, mobile money APIs (such as M-Pesa Daraja), and bank settlement webhooks.</li>
                  <li>Build background transaction processing queues, automated reconciliation jobs, and error handling routines.</li>
                  <li>Collaborate with senior engineers to plan software sprints, review pull requests, and deploy updates via Docker.</li>
                  <li>Investigate and resolve operational bugs, performance bottlenecks, and system alerts to maintain high uptime.</li>
                  <li>Maintain clear technical documentation for APIs, data schemas, and deployment processes.</li>
                </ul>
              </section>

              {/* Requirements */}
              <section className="space-y-3">
                <h2 className="text-base font-bold text-graphite">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Proven experience as a backend or full-stack software developer (1–3+ years production experience).</li>
                  <li>Solid proficiency in Python programming (clean code principles, modular structure, error handling).</li>
                  <li>Working experience with Python web frameworks such as Django, Flask, or FastAPI.</li>
                  <li>Demonstrated competence with relational databases, specifically PostgreSQL (queries, indexes, joins, transactions).</li>
                  <li>Experience integrating external RESTful APIs, webhooks, and JSON data structures.</li>
                  <li>Familiarity with Git version control, basic Linux command-line operations, and Docker containers.</li>
                  <li>Strong analytical and problem-solving abilities with high attention to detail.</li>
                  <li>Good written and verbal communication skills.</li>
                  <li>Must be legally authorized to work in Kenya and available to work full-time onsite at our Westlands, Nairobi office.</li>
                  <li>Bachelor&apos;s degree in Computer Science, Software Engineering, Information Technology, or equivalent practical portfolio.</li>
                </ul>
              </section>

              {/* APPLICATION SECTION */}
              <section id="apply-section" className="space-y-5 pt-6 border-t border-fog/20">
                <div>
                  <h2 className="text-lg font-bold text-graphite flex items-center gap-2">
                    <Upload className="h-5 w-5 text-graphite" />
                    Submit Your Application
                  </h2>
                  <p className="text-xs text-slate mt-1">
                    Your CV and résumé are saved as soon as you choose them, so the final application submits without waiting for file uploads.
                  </p>
                </div>

                {submitStatus === "success" ? (
                  <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                      <Check className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-emerald-900">Application Received Successfully</h3>
                    <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                      Thank you for applying. Your details, CV, and Resume have been saved and queued for our engineering
                      leadership at{" "}
                      <span className="font-semibold">info@mftechnologies.org</span>.
                      Shortlisted candidates will be contacted for technical interviews.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitStatus("idle");
                        resetApplicationDocuments();
                      }}
                      className="mt-2 px-5 py-2 rounded bg-graphite text-white text-xs font-semibold hover:bg-slate transition-colors"
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-fog/30 p-5 shadow-2xs">
                    {renderApplicationForm(false)}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Right Column: Job Information Card */}
          <div className="space-y-6">
            <div className="bg-white border border-fog/20 rounded-lg p-6 space-y-5">
              <h2 className="text-sm font-bold text-graphite uppercase tracking-wider border-b border-fog/20 pb-3">
                Job Information
              </h2>

              <dl className="space-y-3 text-xs">
                <div>
                  <dt className="text-slate font-medium">Date Opened</dt>
                  <dd className="text-graphite font-semibold mt-0.5">18/09/2026</dd>
                </div>
                <div>
                  <dt className="text-slate font-medium">Job Type</dt>
                  <dd className="text-graphite font-semibold mt-0.5">Full time</dd>
                </div>
                <div>
                  <dt className="text-slate font-medium">Industry</dt>
                  <dd className="text-graphite font-semibold mt-0.5">Financial Technology / Banking Software</dd>
                </div>
                <div>
                  <dt className="text-slate font-medium">Work Experience</dt>
                  <dd className="text-graphite font-semibold mt-0.5">1–3 years</dd>
                </div>
                <div>
                  <dt className="text-slate font-medium">City</dt>
                  <dd className="text-graphite font-semibold mt-0.5">Nairobi Area</dd>
                </div>
                <div>
                  <dt className="text-slate font-medium">State/Province</dt>
                  <dd className="text-graphite font-semibold mt-0.5">Nairobi City</dd>
                </div>
                <div>
                  <dt className="text-slate font-medium">Country</dt>
                  <dd className="text-graphite font-semibold mt-0.5">Kenya</dd>
                </div>
                <div>
                  <dt className="text-slate font-medium">Zip/Postal Code</dt>
                  <dd className="text-graphite font-semibold mt-0.5">00100</dd>
                </div>
                <div>
                  <dt className="text-slate font-medium">Work Location</dt>
                  <dd className="text-graphite font-semibold mt-0.5">Onsite (The Pavilion, 4th Floor, Westlands)</dd>
                </div>
              </dl>

              <div className="pt-4 border-t border-fog/20">
                <button
                  type="button"
                  onClick={scrollToApply}
                  className="w-full py-2.5 rounded-md bg-graphite hover:bg-slate text-white text-xs font-semibold text-center transition-colors block shadow-xs"
                >
                  I&apos;m interested
                </button>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white border border-fog/20 rounded-lg p-5 text-xs space-y-2.5">
              <Link href="/about" className="block text-slate hover:text-graphite transition-colors">
                &rarr; About M&amp;F Technologies
              </Link>
              <Link href="/contact" className="block text-slate hover:text-graphite transition-colors">
                &rarr; Contact Office &amp; Directions
              </Link>
              <Link href="/" className="block text-slate hover:text-graphite transition-colors">
                &rarr; Visit main website
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal fallback */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/60 backdrop-blur-xs">
          <div
            className="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-fog/20 overflow-hidden max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-fog/20 bg-cloud flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate block">
                  Application Form
                </span>
                <h3 className="text-sm sm:text-base font-bold text-graphite">
                  Software Developer (Backend &amp; Core Systems)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="h-7 w-7 rounded border border-fog/30 bg-white flex items-center justify-center text-slate hover:text-graphite transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {submitStatus === "success" ? (
                <div className="text-center py-8 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-cloud border border-fog/30 text-graphite mx-auto flex items-center justify-center">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-graphite">Application Received</h4>
                  <p className="text-slate leading-relaxed">
                    Thank you for your interest in M&amp;F Technologies. Your CV &amp; Resume have been submitted
                    to our recruitment team. Qualified candidates will be contacted via email or phone.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      setSubmitStatus("idle");
                      resetApplicationDocuments();
                    }}
                    className="mt-4 px-6 py-2 rounded-md bg-graphite text-white font-medium hover:bg-slate transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                renderApplicationForm(true)
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
