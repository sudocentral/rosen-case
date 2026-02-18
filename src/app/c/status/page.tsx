"use client";

/**
 * Client Status Dashboard - Premium UI
 *
 * Features:
 * - Two-column responsive layout
 * - Progress tracker with stages
 * - Service type badge (VA Nexus / SSDI IMO)
 * - Secure message form (no exposed emails)
 * - Professional medical/legal aesthetic
 * - Multi-case roster with search + active/archived split
 * - Resubmit modal with checklist
 * - Secure invite link via API
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

// Minimal brand header - logo only, no navigation
function MinimalHeader() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center">
        <a href="https://rosenexperts.com" className="flex items-center">
          <img
            src="/brand/logo.png"
            alt="Rosen Experts"
            className="h-10 w-auto"
          />
        </a>
      </div>
    </header>
  );
}


const API_URL = "https://api.sudomanaged.com/api/rosen/public/client/status";
const CASES_URL = "https://api.sudomanaged.com/api/rosen/public/client/cases";
const FILES_URL = "https://api.sudomanaged.com/api/rosen/public/client/files";
const MESSAGE_URL = "https://api.sudomanaged.com/api/rosen/public/client/message";
const BASE_API = "https://api.sudomanaged.com/api/rosen/public/client";

interface CaseStatus {
  case_id: string;
  status: string;
  status_label: string;
  customer_name: string | null;
  customer_email: string;
  determination: "QUALIFIES" | "DOES_NOT_QUALIFY" | "NEEDS_MORE_INFO" | null;
  determination_visible: boolean;
  decision_ready_at: string | null;
  decision_reveal_at: string | null;
  invoice_amount_cents: number | null;
  letter_ready: boolean;
  letter_url: string | null;
  needs_more_info_message: string | null;
  created_at: string;
  updated_at: string;
  stripe_payment_method_id?: string | null;
  auto_charge_status?: string | null;
  claim_type?: string | null;
}

interface UploadedFile {
  id: string;
  filename: string;
  status: string;
  created_at: string;
}

// For multi-case roster
interface CaseSummary {
  case_id: string;
  patient_name: string | null;
  requestor_name: string | null;
  status: string;
  ai_decision: string | null;
  claim_type: string | null;
  created_at: string;
  updated_at: string;
  letter_url?: string | null;
}

// Status priority for sorting (lower = higher priority)
function getStatusPriority(c: CaseSummary): number {
  // 1. Letter Complete - ready for download (highest priority)
  if (["letter_ready", "final_pdf_ready", "delivered"].includes(c.status) && c.letter_url) {
    return 1;
  }
  // 2. Needs More Info / Needs Password / Under Review
  if (c.ai_decision === "NEEDS_MORE_INFO" || c.status === "needs_password") {
    return 2;
  }
  if (["ai_review", "qa_review", "intake_submitted", "physician_review"].includes(c.status)) {
    return 3;
  }
  // 3. Payment required
  if (c.status === "collect_letter_fee") {
    return 4;
  }
  // 4. In progress
  if (c.status === "intake_in_progress") {
    return 5;
  }
  // 5. Others (closed, delivered without letter, etc.)
  return 10;
}

// Determine if a case is "archived" (closed or delivered)
function isCaseArchived(c: CaseSummary): boolean {
  return c.status === "closed" || (c.status === "delivered" && !c.letter_url);
}

function getRosterStatusLabel(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    intake_in_progress: { label: "Intake In Progress", color: "bg-yellow-100 text-yellow-800" },
    intake_submitted: { label: "Under Review", color: "bg-blue-100 text-blue-800" },
    ai_review: { label: "Under Review", color: "bg-blue-100 text-blue-800" },
    qa_review: { label: "Under Review", color: "bg-blue-100 text-blue-800" },
    collect_letter_fee: { label: "Payment Required", color: "bg-orange-100 text-orange-800" },
    paid_letter_fee: { label: "Processing", color: "bg-blue-100 text-blue-800" },
    physician_review: { label: "Physician Review", color: "bg-purple-100 text-purple-800" },
    final_pdf_ready: { label: "Letter Ready", color: "bg-green-100 text-green-800" },
    letter_ready: { label: "Letter Ready", color: "bg-green-100 text-green-800" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
    closed: { label: "Closed", color: "bg-gray-100 text-gray-800" },
    needs_password: { label: "Needs Password", color: "bg-amber-100 text-amber-800" },
  };
  return statusMap[status] || { label: status.replace(/_/g, " "), color: "bg-gray-100 text-gray-800" };
}

function getRosterDecisionBadge(decision: string | null): { label: string; color: string } | null {
  if (!decision) return null;
  if (decision === "QUALIFIES") return { label: "Qualifies", color: "bg-emerald-100 text-emerald-800" };
  if (decision === "DOES_NOT_QUALIFY") return { label: "Does Not Qualify", color: "bg-red-100 text-red-800" };
  if (decision === "NEEDS_MORE_INFO") return { label: "Needs More Info", color: "bg-amber-100 text-amber-800" };
  return null;
}

function getRosterClaimType(claimType: string | null): string {
  // C-1: Only return known types, otherwise empty (no inference)
  if (!claimType || claimType === "AUTO") return "";
  const typeMap: Record<string, string> = {
    va: "VA Nexus",
    "va-disability": "VA Nexus",
    va_nexus: "VA Nexus",
    ssdi: "SSDI",
    ssi: "SSI",
    ssa: "SSI",
    insurance: "Insurance",
    insurance_denial: "Insurance",
    med_mal: "Med Mal",
    medical_malpractice: "Med Mal",
  };
  // Return mapped value or empty string (not raw claim_type)
  return typeMap[claimType.toLowerCase()] || "";
}

// Countdown hook for reveal gate with auto-refetch on expire (C-3)
function useRevealCountdown(
  revealAt: string | null,
  onExpire?: () => void
): { hours: number; minutes: number; seconds: number } | null {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    if (!revealAt) {
      setTimeLeft(null);
      setHasExpired(false);
      return;
    }

    const calculateTimeLeft = () => {
      const target = new Date(revealAt).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) return null;
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    setHasExpired(false);

    const interval = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      if (!left) {
        clearInterval(interval);
        // C-3: Auto-refetch when countdown expires
        if (!hasExpired && onExpire) {
          setHasExpired(true);
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [revealAt, onExpire, hasExpired]);

  return timeLeft;
}

// Progress stages based on status
const PROGRESS_STAGES = [
  { key: "intake", label: "Intake Received", icon: "clipboard" },
  { key: "review", label: "Records Under Review", icon: "search" },
  { key: "determination", label: "Qualification Decision", icon: "check-circle" },
  { key: "physician", label: "Physician Drafting", icon: "document" },
  { key: "ready", label: "Letter Ready", icon: "download" },
];

function getStageFromStatus(status: string, determination: string | null): number {
  if (["delivered", "letter_ready", "final_pdf_ready"].includes(status)) return 4;
  if (["physician_review", "paid_letter_fee"].includes(status)) return 3;
  if (determination) return 2;
  if (["intake_submitted", "ai_review", "qa_review"].includes(status)) return 1;
  return 0;
}

function getServiceTypeLabel(claimType: string | null): { label: string; color: string; fullName: string } {
  // C-1: Neutral label until claim_type is CONFIRMED and KNOWN
  // Never infer product meaning - use "Pending" when uncertain
  if (!claimType || claimType === "AUTO") {
    return { label: "Pending", color: "bg-gray-100 text-gray-800", fullName: "Pending Letter Type Determination" };
  }
  const type = claimType.toUpperCase();
  if (type === "VA" || type === "VA-DISABILITY" || type === "VA_NEXUS") {
    return { label: "VA Nexus Letter", color: "bg-blue-100 text-blue-800", fullName: "VA Nexus Letter" };
  }
  if (type === "SSDI" || type === "SSI" || type === "SSA") {
    return { label: "SSDI/SSI", color: "bg-purple-100 text-purple-800", fullName: "Social Security Disability" };
  }
  if (type === "INSURANCE" || type === "INSURANCE_DENIAL") {
    return { label: "Insurance", color: "bg-orange-100 text-orange-800", fullName: "Insurance Appeal" };
  }
  if (type === "MED_MAL" || type === "MEDICAL_MALPRACTICE") {
    return { label: "Med Mal", color: "bg-red-100 text-red-800", fullName: "Medical Malpractice Opinion" };
  }
  // Unknown type - return Pending, not IMO
  return { label: "Pending", color: "bg-gray-100 text-gray-800", fullName: "Pending Letter Type Determination" };
}

// Icons as inline SVG components
const Icons = {
  clipboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  "check-circle": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  document: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  copy: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  message: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  refresh: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
};

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white ml-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Resubmit Confirmation Modal
function ResubmitModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [checks, setChecks] = useState({
    medicalRecords: false,
    imaging: false,
    labResults: false,
    priorDecisions: false,
  });

  const allChecked = checks.medicalRecords && checks.imaging && checks.labResults && checks.priorDecisions;

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            {Icons.close}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              {Icons.refresh}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resubmit Case</h3>
              <p className="text-sm text-gray-500">Confirm you have the required documents</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Before resubmitting, please confirm you have uploaded the following:
          </p>

          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={checks.medicalRecords}
                onChange={() => toggleCheck("medicalRecords")}
                className="w-5 h-5 rounded border-gray-300 text-[#1a5f7a] focus:ring-[#1a5f7a]"
              />
              <span className="text-sm text-gray-700">Medical records</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={checks.imaging}
                onChange={() => toggleCheck("imaging")}
                className="w-5 h-5 rounded border-gray-300 text-[#1a5f7a] focus:ring-[#1a5f7a]"
              />
              <span className="text-sm text-gray-700">Imaging (X-rays, MRI, CT scans)</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={checks.labResults}
                onChange={() => toggleCheck("labResults")}
                className="w-5 h-5 rounded border-gray-300 text-[#1a5f7a] focus:ring-[#1a5f7a]"
              />
              <span className="text-sm text-gray-700">Lab results</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={checks.priorDecisions}
                onChange={() => toggleCheck("priorDecisions")}
                className="w-5 h-5 rounded border-gray-300 text-[#1a5f7a] focus:ring-[#1a5f7a]"
              />
              <span className="text-sm text-gray-700">Prior decisions/denials (if applicable)</span>
            </label>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!allChecked || isSubmitting}
              className="flex-1 px-4 py-3 bg-[#1a5f7a] text-white rounded-lg font-medium hover:bg-[#134a5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Confirm & Resubmit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  patientName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  patientName: string | null;
}) {
  const [confirmed, setConfirmed] = useState(false);

  // Reset checkbox when modal closes
  useEffect(() => {
    if (!isOpen) setConfirmed(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            {Icons.close}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              {Icons.trash}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Case</h3>
              <p className="text-sm text-gray-500">
                {patientName ? `Case for ${patientName}` : "This case"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete this case and all associated files. This action cannot be undone.
            </p>

            <label className="flex items-center gap-3 p-3 border border-red-200 rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
                className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">I understand this cannot be undone</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!confirmed || isDeleting}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Case"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Secure Message Modal Component
function SecureMessageModal({
  isOpen,
  onClose,
  caseId,
  token
}: {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  token: string;
}) {
  const [category, setCategory] = useState("question");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length > 4000) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch(MESSAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token,
        },
        body: JSON.stringify({
          case_id: caseId,
          category,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setSent(true);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            {Icons.close}
          </button>

          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent</h3>
              <p className="text-gray-600 mb-6">
                We've received your message and will respond within 1-2 business days.
              </p>
              <button
                onClick={onClose}
                className="bg-[#1a5f7a] text-white px-6 py-2 rounded-lg hover:bg-[#134a5f] transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1a5f7a]/10 rounded-full flex items-center justify-center">
                  {Icons.message}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Send a Secure Message</h3>
                  <p className="text-sm text-gray-500">Your message is encrypted and attached to your case</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent"
                  >
                    <option value="question">Question about my case</option>
                    <option value="upload">Upload or document issue</option>
                    <option value="billing">Billing inquiry</option>
                    <option value="status">Status update request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    maxLength={4000}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent resize-none"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">{message.length}/4000 characters</p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="w-full bg-[#1a5f7a] text-white py-3 rounded-lg font-medium hover:bg-[#134a5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Progress Tracker Component
function ProgressTracker({ currentStage }: { currentStage: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Progress</h3>
      <div className="space-y-4">
        {PROGRESS_STAGES.map((stage, index) => {
          const isComplete = index < currentStage;
          const isCurrent = index === currentStage;

          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isComplete
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-[#1a5f7a] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-sm ${
                  isComplete || isCurrent ? "text-gray-900 font-medium" : "text-gray-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ClientStatusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [caseStatus, setCaseStatus] = useState<CaseStatus | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [needsUpload, setNeedsUpload] = useState(false);
  const [needsCard, setNeedsCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [token, setToken] = useState("");
  // Multi-case roster state
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [showRoster, setShowRoster] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  // Client identity (account holder / magic link owner) - distinct from patient
  const [clientName, setClientName] = useState<string | null>(null);
  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Search
  const [searchQuery, setSearchQuery] = useState("");
  // Archived cases accordion
  const [showArchived, setShowArchived] = useState(false);
  // Resubmit modal
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [resubmitCaseId, setResubmitCaseId] = useState<string | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmitError, setResubmitError] = useState<string | null>(null);
  // Cases load error (for recoverable error UI instead of redirect loop)
  const [casesLoadError, setCasesLoadError] = useState<string | null>(null);
  // Copy link loading state
  const [copyingLinkCaseId, setCopyingLinkCaseId] = useState<string | null>(null);
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCaseId, setDeleteCaseId] = useState<string | null>(null);
  const [deleteCasePatient, setDeleteCasePatient] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // C-3: Auto-refetch callback when reveal countdown expires
  const handleRevealExpire = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rosen_client_token") : null;
    if (!token || !selectedCaseId) return;

    try {
      const statusUrl = `${API_URL}?case_id=${selectedCaseId}`;
      const res = await fetch(statusUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json", "x-intake-token": token },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCaseStatus(data.data);
        }
      }
    } catch (err) {
      console.error("[reveal-expire] Failed to refetch status:", err);
    }
  }, [selectedCaseId]);

  // Reveal countdown for decision gating - auto-refetches when countdown expires
  const revealCountdown = useRevealCountdown(caseStatus?.decision_reveal_at ?? null, handleRevealExpire);

  useEffect(() => {
    // Check for token in URL first (magic link from email)
    let authToken: string | null = null;
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        localStorage.setItem("rosen_client_token", urlToken);
        authToken = urlToken;
        // Clean URL
        window.history.replaceState({}, "", "/c/status");
      }
    }

    // Fall back to stored token
    if (!authToken) {
      authToken = typeof window !== "undefined" ? localStorage.getItem("rosen_client_token") : null;
    }

    if (!authToken) {
      router.push("/welcome");
      return;
    }

    setToken(authToken);

    // First, check how many cases the user has
    fetchCasesAndDecide(authToken);
  }, [router]);

  // Fetch cases list and decide: roster or single-case view
  const fetchCasesAndDecide = async (authToken: string) => {
    setCasesLoadError(null);
    try {
      const casesRes = await fetch(CASES_URL, {
        headers: { "x-intake-token": authToken },
      });

      if (casesRes.status === 401) {
        localStorage.removeItem("rosen_client_token");
        localStorage.removeItem("rosen_case_id");
        router.push("/welcome");
        return;
      }

      // Handle other error status codes - show recoverable error, don't redirect
      if (!casesRes.ok) {
        console.error("[status] Cases API returned non-OK status:", casesRes.status);
        setCasesLoadError("We couldn't load your cases. Please refresh or contact support.");
        setLoading(false);
        return;
      }

      const casesData = await casesRes.json();

      // Only redirect to /c/new-patient if API explicitly confirms success with 0 cases
      if (!casesData.success) {
        console.error("[status] Cases API returned success=false:", casesData.error);
        setCasesLoadError("We couldn't load your cases. Please refresh or contact support.");
        setLoading(false);
        return;
      }

      const casesList: CaseSummary[] = casesData.data?.cases || [];

      // Extract client name (account holder) from API response
      const apiClientName = casesData.data?.client_name || null;
      if (apiClientName) {
        setClientName(apiClientName);
      } else if (casesList.length > 0 && casesList[0].requestor_name) {
        setClientName(casesList[0].requestor_name);
      }

      // ONLY redirect if API confirms success AND truly has 0 cases
      if (casesList.length === 0) {
        router.push("/c/new-patient");
        return;
      }

      if (casesList.length === 1) {
        setCases(casesList);
        setSelectedCaseId(casesList[0].case_id);
        fetchStatusAndFiles(authToken);
      } else {
        setCases(casesList);
        setShowRoster(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("[status] Failed to fetch cases:", err);
      setCasesLoadError("We couldn't load your cases. Please refresh or contact support.");
      setLoading(false);
    }
  };

  // Select a case from roster and load its status
  const selectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setShowRoster(false);
    setLoading(true);
    localStorage.setItem("caseflow_active_case_id", caseId);
    fetchStatusAndFiles(token, caseId);
  };

  // Back to roster
  const backToRoster = () => {
    setShowRoster(true);
    setCaseStatus(null);
    setUploadedFiles([]);
    setNeedsUpload(false);
    setNeedsCard(false);
  };

  const fetchStatusAndFiles = async (authToken: string, caseId?: string) => {
    try {
      const statusUrl = caseId ? `${API_URL}?case_id=${caseId}` : API_URL;
      const filesUrl = caseId ? `${FILES_URL}?case_id=${caseId}` : FILES_URL;

      const [statusRes, filesRes] = await Promise.all([
        fetch(statusUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json", "x-intake-token": authToken },
        }),
        fetch(filesUrl, {
          method: "GET",
          headers: { "x-intake-token": authToken },
        }),
      ]);

      if (statusRes.status === 401) {
        localStorage.removeItem("rosen_client_token");
        localStorage.removeItem("rosen_case_id");
        router.push("/welcome");
        return;
      }

      const statusData = await statusRes.json();
      const filesData = await filesRes.json();

      if (!statusRes.ok || !statusData.success) {
        throw new Error(statusData.error || "Could not load your case status.");
      }

      setCaseStatus(statusData.data);

      const files = filesData.success
        ? (filesData.data.files || []).filter((f: any) => f.status === "uploaded")
        : [];
      setUploadedFiles(files);

      const status = statusData.data.status;

      if ((status === "intake_in_progress" || status === "intake_submitted") && files.length === 0) {
        setNeedsUpload(true);
      }

      if (files.length > 0 && status === "intake_in_progress" && !statusData.data.stripe_payment_method_id) {
        setNeedsCard(true);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Could not load your case status.";
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
        setError("Unable to connect. Please check your internet and try again.");
      } else if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
        localStorage.removeItem("rosen_client_token");
        localStorage.removeItem("rosen_case_id");
        setError("Your session has expired. Please request a new access link.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (caseStatus?.case_id) {
      navigator.clipboard.writeText(caseStatus.case_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // C1: Copy secure upload link via API
  const copyInviteLink = async (caseId: string) => {
    setCopyingLinkCaseId(caseId);
    try {
      const res = await fetch(`${BASE_API}/cases/${caseId}/invite-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate invite link");
      }

      const inviteUrl = data.data?.invite_url;
      if (inviteUrl) {
        await navigator.clipboard.writeText(inviteUrl);
        setToastMessage("Secure upload link copied (expires in 30 days)");
      } else {
        throw new Error("No invite URL returned");
      }
    } catch (err) {
      console.error("Failed to copy invite link:", err);
      setToastMessage("Failed to generate link. Please try again.");
    } finally {
      setCopyingLinkCaseId(null);
    }
  };

  // C3: Handle resubmit
  const handleResubmit = async () => {
    if (!resubmitCaseId) return;

    setIsResubmitting(true);
    setResubmitError(null);

    try {
      const res = await fetch(`${BASE_API}/cases/${resubmitCaseId}/resubmit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Check for limit reached
        if (data.code === "RESUBMIT_LIMIT_REACHED" || data.error?.includes("limit")) {
          setResubmitError("This case requires an operations review before another submission.");
        } else {
          throw new Error(data.error || "Failed to resubmit case");
        }
        return;
      }

      // Success - close modal and show toast
      setShowResubmitModal(false);
      setResubmitCaseId(null);
      setToastMessage("Case resubmitted for review");

      // Refresh the page data
      if (showRoster) {
        fetchCasesAndDecide(token);
      } else {
        fetchStatusAndFiles(token, resubmitCaseId);
      }
    } catch (err) {
      setResubmitError(err instanceof Error ? err.message : "Failed to resubmit case");
    } finally {
      setIsResubmitting(false);
    }
  };

  // Open resubmit modal
  const openResubmitModal = (caseId: string) => {
    setResubmitCaseId(caseId);
    setResubmitError(null);
    setShowResubmitModal(true);
  };

  // Determine if case can be resubmitted
  const canResubmit = (c: CaseSummary | CaseStatus): boolean => {
    const status = 'ai_decision' in c ? c.ai_decision : (c as CaseStatus).determination;
    return status === "NEEDS_MORE_INFO" || status === "DOES_NOT_QUALIFY";
  };

  // Determine if case can be deleted (only intake_in_progress with no Sherlock decision)
  const canDeleteCase = (c: CaseSummary): boolean => {
    return c.status === "intake_in_progress" && !c.ai_decision;
  };

  // Open delete modal
  const openDeleteModal = (caseId: string, patientName: string | null) => {
    setDeleteCaseId(caseId);
    setDeleteCasePatient(patientName);
    setShowDeleteModal(true);
  };

  // Handle delete case
  const handleDeleteCase = async () => {
    if (!deleteCaseId) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`${BASE_API}/cases/${deleteCaseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete case");
      }

      // Success - close modal and show toast
      setShowDeleteModal(false);
      setDeleteCaseId(null);
      setDeleteCasePatient(null);
      setToastMessage("Case deleted successfully");

      // Refresh the cases list
      fetchCasesAndDecide(token);
    } catch (err) {
      console.error("Failed to delete case:", err);
      setToastMessage(err instanceof Error ? err.message : "Failed to delete case");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      intake_in_progress: { bg: "bg-blue-100", text: "text-blue-800", label: "Intake In Progress" },
      intake_submitted: { bg: "bg-purple-100", text: "text-purple-800", label: "Records Submitted" },
      ai_review: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Under Review" },
      qa_review: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Under Review" },
      collect_letter_fee: { bg: "bg-amber-100", text: "text-amber-800", label: "Payment Needed" },
      paid_letter_fee: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Payment Received" },
      physician_review: { bg: "bg-teal-100", text: "text-teal-800", label: "Physician Drafting" },
      final_pdf_ready: { bg: "bg-green-100", text: "text-green-800", label: "Letter Ready" },
      letter_ready: { bg: "bg-green-100", text: "text-green-800", label: "Letter Ready" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
      closed: { bg: "bg-gray-100", text: "text-gray-800", label: "Closed" },
    };
    return configs[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  };

  const getNextStepContent = () => {
    if (!caseStatus) return null;

    const { status, determination, letter_url, needs_more_info_message } = caseStatus;

    if (["letter_ready", "final_pdf_ready", "delivered"].includes(status) && letter_url) {
      return {
        type: "success",
        title: "Your Letter is Ready",
        message: "Your physician-authored opinion letter has been completed and is ready for download.",
        action: { label: "Download Letter", href: letter_url },
      };
    }

    if (status === "physician_review" || status === "paid_letter_fee") {
      const serviceType = getServiceTypeLabel(caseStatus.claim_type ?? null);
      return {
        type: "progress",
        title: "Physician Review in Progress",
        message: `A licensed physician is currently preparing your ${serviceType.label.toLowerCase()}. You will be notified by email when it's ready.`,
      };
    }

    if (status === "collect_letter_fee") {
      const isCardFailure = caseStatus.auto_charge_status?.startsWith("failed_") ||
                             caseStatus.auto_charge_status === "no_payment_method";
      return {
        type: "action",
        title: isCardFailure ? "Payment Method Update Required" : "Payment Required",
        message: isCardFailure
          ? "Your case qualified, but we need to update your payment method to proceed."
          : "Your case qualified! Complete payment to begin your physician review.",
        action: {
          label: isCardFailure ? "Update Payment" : "Complete Payment",
          href: `/c/payment?case=${caseStatus.case_id}`,
        },
      };
    }

    if (determination === "NEEDS_MORE_INFO") {
      return {
        type: "action",
        title: "Additional Documents Needed",
        message: needs_more_info_message || "We need additional medical records to complete your review.",
        action: { label: "Upload Documents", href: "/c/upload" },
      };
    }

    // C-4: Only show DOES_NOT_QUALIFY message when determination is visible
    if (caseStatus.determination_visible && determination === "DOES_NOT_QUALIFY") {
      return {
        type: "neutral",
        title: "Review Complete",
        message: "After careful review, we were unable to establish sufficient medical evidence for a nexus opinion at this time. You have not been charged.",
      };
    }

    return {
      type: "progress",
      title: "Records Under Review",
      message: "Our team is reviewing your medical records. You will be notified by email when we have an update.",
    };
  };

  // C4: Filter and sort cases
  const { activeCases, archivedCases } = useMemo(() => {
    const filtered = cases.filter(c => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const name = (c.patient_name || c.requestor_name || "").toLowerCase();
      const claimType = getRosterClaimType(c.claim_type).toLowerCase();
      const status = getRosterStatusLabel(c.status).label.toLowerCase();
      return name.includes(query) || claimType.includes(query) || status.includes(query) || c.case_id.toLowerCase().includes(query);
    });

    const active = filtered.filter(c => !isCaseArchived(c)).sort((a, b) => {
      const priorityDiff = getStatusPriority(a) - getStatusPriority(b);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    const archived = filtered.filter(c => isCaseArchived(c)).sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return { activeCases: active, archivedCases: archived };
  }, [cases, searchQuery]);

  // Loading state
  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your case...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Cases load error state (recoverable - not redirect loop)
  if (casesLoadError) {
    return (
      <>
        <MinimalHeader />
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-xl mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Cases</h1>
            <p className="text-gray-600 mb-8">{casesLoadError}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-block bg-[#1a5f7a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#134a5f] transition-colors"
              >
                Retry
              </button>
              <a
                href="/c/status"
                className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Cases
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-xl mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Status</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <a href="/welcome" className="inline-block bg-[#1a5f7a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#134a5f] transition-colors">
              Request New Access Link
            </a>
          </div>
        </main>
      </>
    );
  }

  // Multi-case roster view
  if (showRoster && cases.length > 1) {
    return (
      <>
        <MinimalHeader />
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {clientName ? `Welcome back, ${clientName.split(" ")[0]}` : "Your Cases"}
              </h1>
              <p className="text-gray-600">Select a case to view details and status</p>
            </div>

            {/* Search + Add New Patient */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* C4: Search Box */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {Icons.search}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, type, or status..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  // Set intent flag - allows /c/new-patient access
                  sessionStorage.setItem("add_patient_intent", "true");
                  router.push("/c/new-patient");
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#2c8a6e] text-white rounded-lg hover:bg-[#247a5f] transition-colors font-medium whitespace-nowrap"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add New Patient
              </button>
            </div>

            {/* C4: Active Cases Section */}
            {activeCases.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Cases ({activeCases.length})</h2>
                <div className="space-y-4">
                  {activeCases.map((c) => {
                    const statusInfo = getRosterStatusLabel(c.status);
                    // C-2: Decision visibility is ONLY shown in detail view using determination_visible
                    // Roster view shows status only - no decision badges to prevent disagreement
                    const displayName = c.patient_name || c.requestor_name || "Patient";
                    const claimTypeLabel = getRosterClaimType(c.claim_type);
                    const updatedDate = new Date(c.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const isCopyingLink = copyingLinkCaseId === c.case_id;
                    // C-2: showResubmitBtn removed - resubmit only available in detail view with determination_visible
                    const isLetterReady = ["letter_ready", "final_pdf_ready", "delivered"].includes(c.status) && c.letter_url;

                    return (
                      <div
                        key={c.case_id}
                        className={`bg-white rounded-xl shadow-sm border ${isLetterReady ? "border-green-300 ring-2 ring-green-100" : "border-gray-200"} p-6 hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {displayName}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                              {/* C-2: Decision badge removed - only shown in detail view */}
                              {claimTypeLabel && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                  {claimTypeLabel}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-500 mb-3">
                              Last updated: {updatedDate}
                            </p>

                            {/* Action buttons row */}
                            <div className="flex flex-wrap items-center gap-3">
                              {/* Copy Secure Upload Link */}
                              <button
                                onClick={() => copyInviteLink(c.case_id)}
                                disabled={isCopyingLink}
                                className="inline-flex items-center text-sm text-[#1a5f7a] hover:text-[#134a5f] transition-colors disabled:opacity-50"
                              >
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                {isCopyingLink ? "Generating..." : "Copy Secure Upload Link"}
                              </button>

                              {/* C-2: Resubmit button removed from roster - decision-dependent actions only in detail view */}

                              {/* Delete button - only for intake_in_progress with no decision */}
                              {canDeleteCase(c) && (
                                <button
                                  onClick={() => openDeleteModal(c.case_id, c.patient_name || c.requestor_name)}
                                  className="inline-flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
                                >
                                  {Icons.trash}
                                  <span className="ml-1.5">Delete</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {isLetterReady && c.letter_url && (
                              <a
                                href={c.letter_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
                              >
                                {Icons.download}
                                Download Letter
                              </a>
                            )}
                            <button
                              onClick={() => selectCase(c.case_id)}
                              className="flex-shrink-0 px-6 py-3 bg-[#1a5f7a] text-white rounded-lg hover:bg-[#164e66] transition-colors font-medium"
                            >
                              View Status
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C4: Archived Cases Section (Collapsed Accordion) */}
            {archivedCases.length > 0 && (
              <div className="mb-8">
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-700">
                    Archived Cases ({archivedCases.length})
                  </span>
                  <span className={`transform transition-transform ${showArchived ? "rotate-180" : ""}`}>
                    {Icons.chevronDown}
                  </span>
                </button>

                {showArchived && (
                  <div className="mt-4 space-y-4">
                    {archivedCases.map((c) => {
                      const statusInfo = getRosterStatusLabel(c.status);
                      const displayName = c.patient_name || c.requestor_name || "Patient";
                      const claimTypeLabel = getRosterClaimType(c.claim_type);
                      const updatedDate = new Date(c.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <div
                          key={c.case_id}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-75"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                                {displayName}
                              </h3>

                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                                {claimTypeLabel && (
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                    {claimTypeLabel}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-500">
                                Closed: {updatedDate}
                              </p>
                            </div>

                            <button
                              onClick={() => selectCase(c.case_id)}
                              className="flex-shrink-0 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* No results message */}
            {activeCases.length === 0 && archivedCases.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-500">No cases match "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-[#1a5f7a] hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Toast notification */}
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}

        {/* Resubmit Modal */}
        <ResubmitModal
          isOpen={showResubmitModal}
          onClose={() => {
            setShowResubmitModal(false);
            setResubmitCaseId(null);
            setResubmitError(null);
          }}
          onConfirm={handleResubmit}
          isSubmitting={isResubmitting}
          error={resubmitError}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteCaseId(null);
            setDeleteCasePatient(null);
          }}
          onConfirm={handleDeleteCase}
          isDeleting={isDeleting}
          patientName={deleteCasePatient}
        />
      </>
    );
  }

  if (!caseStatus) return null;

  // Upload gate
  if (needsUpload) {
    return (
      <>
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-xl mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Medical Records</h1>
            <p className="text-gray-600 mb-8">To begin your free review, please upload your medical records and relevant documents.</p>
            <a href="/c/upload" className="inline-flex items-center gap-2 bg-[#2c8a6e] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1e6b55] transition-colors">
              Upload Medical Records
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </main>
      </>
    );
  }

  // Card gate
  if (needsCard) {
    return (
      <>
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-xl mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authorize Your Card</h1>
            <p className="text-gray-600 mb-2">Your records are uploaded. Authorize your card to complete submission.</p>
            <p className="text-gray-500 mb-8 text-sm">You will not be charged unless your case qualifies.</p>
            <a href="/c/card" className="inline-flex items-center gap-2 bg-[#1a5f7a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#134a5f] transition-colors">
              Authorize Card
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </main>
      </>
    );
  }

  const statusConfig = getStatusConfig(caseStatus.status);
  const serviceType = getServiceTypeLabel(caseStatus.claim_type ?? null);
  // C-4: Only include determination in stage calculation when visible
  const currentStage = getStageFromStatus(caseStatus.status, caseStatus.determination_visible ? caseStatus.determination : null);
  const nextStep = getNextStepContent();
  const showResubmitBtn = canResubmit(caseStatus);

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Back to all cases */}
          {cases.length > 1 && (
            <div className="mb-4">
              <button
                onClick={backToRoster}
                className="text-sm text-[#1a5f7a] hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all cases
              </button>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {clientName ? `Welcome back, ${clientName.split(" ")[0]}` : "Welcome back"}
            </h1>
            {(() => {
              const selectedCase = cases.find(c => c.case_id === selectedCaseId);
              const patientName = selectedCase?.patient_name || caseStatus.customer_name;
              if (patientName && patientName !== clientName) {
                return (
                  <p className="text-sm text-gray-500 mb-1">
                    Patient: <span className="font-medium text-gray-700">{patientName}</span>
                  </p>
                );
              }
              return null;
            })()}
            <p className="text-gray-600">Track your case progress and manage your documents</p>
            {(caseStatus.status === "intake_in_progress" || caseStatus.determination === "NEEDS_MORE_INFO") && (
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <a href="/c/upload?edit=1" className="text-sm text-[#1a5f7a] hover:underline">
                  &larr; Edit uploads
                </a>
                {/* C3: Resubmit button in single case view */}
                {showResubmitBtn && (
                  <button
                    onClick={() => openResubmitModal(caseStatus.case_id)}
                    className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    {Icons.refresh}
                    <span className="ml-1.5">Resubmit for Review</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Decision Pending Reveal - Countdown Banner (hidden per directive) */}
          {false && !caseStatus.determination_visible && caseStatus.decision_reveal_at && revealCountdown && (
            <div className="mb-6 rounded-xl shadow-md overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Under Review (Pending)</h2>
                    <p className="text-sm sm:text-base text-white/90">
                      Your case is being finalized. Results available in:
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-2xl font-mono font-bold text-white">
                        {String(revealCountdown.hours).padStart(2, "0")}:{String(revealCountdown.minutes).padStart(2, "0")}:{String(revealCountdown.seconds).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Qualification Banner */}
          {caseStatus.determination_visible && caseStatus.determination && (
            <div className={`mb-6 rounded-xl shadow-md overflow-hidden ${
              caseStatus.determination === "QUALIFIES"
                ? "bg-gradient-to-r from-green-600 to-emerald-600"
                : caseStatus.determination === "DOES_NOT_QUALIFY"
                ? "bg-gradient-to-r from-red-600 to-rose-600"
                : "bg-gradient-to-r from-amber-500 to-orange-500"
            }`}>
              <div className="px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex items-center gap-4">
                  {caseStatus.determination === "QUALIFIES" && (
                    <>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Your Case Qualifies!</h2>
                        <p className="text-sm sm:text-base text-white/90">
                          Your case qualifies for a {serviceType.fullName}. A physician will prepare your letter.
                        </p>
                      </div>
                    </>
                  )}
                  {caseStatus.determination === "DOES_NOT_QUALIFY" && (
                    <>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Does Not Qualify</h2>
                        <p className="text-sm sm:text-base text-white/90">
                          We cannot provide a supporting letter for your case. Your card has not been charged.
                        </p>
                      </div>
                    </>
                  )}
                  {caseStatus.determination === "NEEDS_MORE_INFO" && (
                    <>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">More Information Needed</h2>
                        <p className="text-sm sm:text-base text-white/90">
                          We need additional documentation. Please check below for details.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Status & Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Case Header Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${serviceType.color}`}>
                          {serviceType.label}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Case ID:</span>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {caseStatus.case_id.slice(0, 8)}...
                        </code>
                        <button
                          onClick={copyToClipboard}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy full case ID"
                        >
                          {Icons.copy}
                        </button>
                        {copied && <span className="text-xs text-green-600">Copied!</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Step Panel */}
                {nextStep && (
                  <div className={`p-6 border-t border-gray-100 ${
                    nextStep.type === "success" ? "bg-green-50" :
                    nextStep.type === "action" ? "bg-amber-50" :
                    nextStep.type === "neutral" ? "bg-gray-50" :
                    "bg-blue-50"
                  }`}>
                    <h3 className={`font-semibold mb-2 ${
                      nextStep.type === "success" ? "text-green-900" :
                      nextStep.type === "action" ? "text-amber-900" :
                      nextStep.type === "neutral" ? "text-gray-900" :
                      "text-blue-900"
                    }`}>
                      {nextStep.title}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      nextStep.type === "success" ? "text-green-800" :
                      nextStep.type === "action" ? "text-amber-800" :
                      nextStep.type === "neutral" ? "text-gray-600" :
                      "text-blue-800"
                    }`}>
                      {nextStep.message}
                    </p>
                    {nextStep.action && (
                      <a
                        href={nextStep.action.href}
                        target={nextStep.action.href.startsWith("http") ? "_blank" : undefined}
                        rel={nextStep.action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                          nextStep.type === "success" ? "bg-green-600 text-white hover:bg-green-700" :
                          "bg-amber-600 text-white hover:bg-amber-700"
                        }`}
                      >
                        {nextStep.action.label}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Case started</p>
                      <p className="text-xs text-gray-500">{new Date(caseStatus.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                    </div>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} uploaded</p>
                        <p className="text-xs text-gray-500">Medical records received</p>
                      </div>
                    </div>
                  )}
                  {/* C-4: Only show determination in timeline when visible */}
                  {caseStatus.determination_visible && caseStatus.determination && (
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full ${caseStatus.determination === "QUALIFIES" ? "bg-green-500" : "bg-gray-400"}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {caseStatus.determination === "QUALIFIES" ? "Case qualified" :
                           caseStatus.determination === "DOES_NOT_QUALIFY" ? "Review completed" : "Additional info needed"}
                        </p>
                        <p className="text-xs text-gray-500">Determination made</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last updated</p>
                      <p className="text-xs text-gray-500">{new Date(caseStatus.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Card */}
              {uploadedFiles.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Uploaded Documents ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.slice(0, 5).map((file, i) => (
                      <div key={file.id || i} className="flex items-center gap-3 py-2">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {file.filename?.length > 40 ? file.filename.slice(0, 37) + "..." : file.filename || `Document ${i + 1}`}
                        </span>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Uploaded</span>
                      </div>
                    ))}
                    {uploadedFiles.length > 5 && (
                      <p className="text-sm text-gray-500 pt-2">+ {uploadedFiles.length - 5} more files</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Progress & Help */}
            <div className="space-y-6">
              {/* Progress Tracker */}
              <ProgressTracker currentStage={currentStage} />

              {/* Help Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Need Help?</h3>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a5f7a] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#134a5f] transition-colors"
                >
                  {Icons.message}
                  Send a Secure Message
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  We typically respond within 1-2 business days
                </p>
              </div>

              {/* Security Footer */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-slate-400">{Icons.shield}</div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Your Privacy is Protected</p>
                    <p className="text-xs text-slate-500 mt-1">
                      All communications are encrypted. Your medical information is handled in compliance with HIPAA regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Secure Message Modal */}
      <SecureMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        caseId={caseStatus.case_id}
        token={token}
      />

      {/* Toast notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Resubmit Modal */}
      <ResubmitModal
        isOpen={showResubmitModal}
        onClose={() => {
          setShowResubmitModal(false);
          setResubmitCaseId(null);
          setResubmitError(null);
        }}
        onConfirm={handleResubmit}
        isSubmitting={isResubmitting}
        error={resubmitError}
      />
    </>
  );
}
