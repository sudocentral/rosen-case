"use client";

/**
 * Client Portal Hub - /c/portal
 * 
 * Central hub for clients after card verification.
 * Shows: status timeline, received docs, missing items, payment status, letter download.
 * 
 * Directive 15 Part A
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientPortalHeader from "@/components/ClientPortalHeader";


const API_URL = "https://api.sudomanaged.com/api/rosen/public/client/status";
const FILES_URL = "https://api.sudomanaged.com/api/rosen/public/client/files";
const MESSAGE_URL = "https://api.sudomanaged.com/api/rosen/public/client/message";

interface CaseStatus {
  case_id: string;
  status: string;
  status_label: string;
  customer_name: string | null;
  customer_email: string;
  determination: "QUALIFIES" | "DOES_NOT_QUALIFY" | "NEEDS_MORE_INFO" | null;
  determination_visible: boolean;
  invoice_amount_cents: number | null;
  letter_ready: boolean;
  letter_url: string | null;
  needs_more_info_message: string | null;
  created_at: string;
  updated_at: string;
  stripe_payment_method_id?: string | null;
  auto_charge_status?: string | null;
  claim_type?: string | null;
  has_statement?: boolean;
  has_dob?: boolean;
}

interface UploadedFile {
  id: string;
  filename: string;
  status: string;
  created_at: string;
}

// Timeline stages for portal
const TIMELINE_STAGES = [
  { key: "submitted", label: "Intake Submitted", desc: "Your records and statement have been received" },
  { key: "processing", label: "Processing", desc: "Our team is reviewing your medical records" },
  { key: "decision", label: "Qualification Decision", desc: "Determination made on your case" },
  { key: "assigned", label: "Physician Assigned", desc: "A licensed physician is preparing your letter" },
  { key: "drafting", label: "Letter Drafting", desc: "Your letter is being written" },
  { key: "delivered", label: "Letter Delivered", desc: "Your letter is ready for download" },
];

function getStageIndex(status: string, determination: string | null): number {
  if (["delivered", "letter_ready", "final_pdf_ready"].includes(status)) return 5;
  if (status === "physician_review" || status === "paid_letter_fee") return 4;
  if (status === "assigned" || status === "collect_letter_fee") return 3;
  if (determination) return 2;
  if (["ai_review", "qa_review", "intake_submitted", "records_submitted"].includes(status)) return 1;
  return 0;
}

function getServiceLabel(claimType: string | null): { label: string; fullName: string; color: string } {
  if (!claimType) {
    return { label: "Medical Review", fullName: "Medical Records Review", color: "bg-gray-100 text-gray-800" };
  }
  const type = claimType.toUpperCase();
  if (type === "VA" || type === "VA-DISABILITY") {
    return { label: "VA Nexus Letter", fullName: "VA Nexus Letter", color: "bg-blue-100 text-blue-800" };
  }
  if (type === "MED_MAL" || type === "MEDICAL_MALPRACTICE") {
    return { label: "Medical Malpractice", fullName: "Medical Malpractice Opinion", color: "bg-red-100 text-red-800" };
  }
  if (type === "SSDI") {
    return { label: "SSDI", fullName: "SSDI Medical Opinion", color: "bg-purple-100 text-purple-800" };
  }
  if (type === "INSURANCE" || type === "INSURANCE_DENIAL") {
    return { label: "Insurance Appeal", fullName: "Insurance Denial Appeal", color: "bg-orange-100 text-orange-800" };
  }
  // C-1: Unknown claim_type should show Pending, not IMO
  return { label: "Pending", fullName: "Pending Letter Type Determination", color: "bg-gray-100 text-gray-800" };
}

// Icons
const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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
            <CloseIcon />
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
                  <MessageIcon />
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

export default function PortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [caseStatus, setCaseStatus] = useState<CaseStatus | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [token, setToken] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    // Check for token in URL first (magic link from email)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        localStorage.setItem("rosen_client_token", urlToken);
        setToken(urlToken);
        fetchData(urlToken);
        return;
      }
    }

    // Fall back to stored token
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("rosen_client_token") : null;
    if (!storedToken) {
      router.push("/start");
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  }, [router]);

  const fetchData = async (authToken: string) => {
    try {
      const [statusRes, filesRes] = await Promise.all([
        fetch(API_URL, { headers: { "x-intake-token": authToken } }),
        fetch(FILES_URL, { headers: { "x-intake-token": authToken } }),
      ]);

      if (statusRes.status === 401) {
        localStorage.removeItem("rosen_client_token");
        localStorage.removeItem("rosen_case_id");
        router.push("/start");
        return;
      }

      const statusData = await statusRes.json();
      const filesData = await filesRes.json();

      if (!statusRes.ok || !statusData.success) {
        throw new Error(statusData.error || "Could not load your case.");
      }

      setCaseStatus(statusData.data);
      setUploadedFiles(filesData.success ? (filesData.data.files || []).filter((f: any) => f.status === "uploaded") : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your case.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <ClientPortalHeader showSwitcher={false} />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your portal...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !caseStatus) {
    return (
      <>
        <ClientPortalHeader showSwitcher={false} />
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-xl mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertIcon />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load</h1>
            <p className="text-gray-600 mb-8">{error || "Could not load your case."}</p>
            <a href="/start" className="btn-primary">Start New Request</a>
          </div>
        </main>
      </>
    );
  }

  const stageIndex = getStageIndex(caseStatus.status, caseStatus.determination_visible ? caseStatus.determination : null);
  const serviceInfo = getServiceLabel(caseStatus.claim_type ?? null);
  const hasPaymentMethod = !!caseStatus.stripe_payment_method_id;
  const isApproved = caseStatus.determination_visible && caseStatus.determination === "QUALIFIES";
  const isDeclined = caseStatus.determination_visible && caseStatus.determination === "DOES_NOT_QUALIFY";
  const needsMoreInfo = caseStatus.determination === "NEEDS_MORE_INFO";
  const letterReady = caseStatus.letter_ready && caseStatus.letter_url;
  const paymentStatus = caseStatus.auto_charge_status;

  return (
    <>
      <ClientPortalHeader
        currentCaseId={caseStatus.case_id}
        patientName={caseStatus.customer_name || undefined}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {caseStatus.customer_name ? `Welcome, ${caseStatus.customer_name.split(" ")[0]}` : "Your Case Portal"}
            </h1>
            <p className="text-gray-600">Track your case and access your documents</p>
            <div className="flex items-center gap-3 mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${serviceInfo.color}`}>
                {serviceInfo.label}
              </span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Timeline & Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Banner */}
              {isApproved && !letterReady && (
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckIcon />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Your Case Qualifies!</h2>
                      <p className="text-white/90">
                        {paymentStatus === "succeeded" 
                          ? "Payment received. A physician is preparing your letter."
                          : "Your card will be charged and a physician will begin drafting your letter."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isDeclined && (
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertIcon />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Review Complete</h2>
                      <p className="text-white/90">We were unable to provide a supporting letter. Your card was not charged.</p>
                    </div>
                  </div>
                </div>
              )}

              {letterReady && (
                <div className="bg-gradient-to-r from-[#1a5f7a] to-[#134a5f] rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <DocumentIcon />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Your Letter is Ready!</h2>
                        <p className="text-white/90">Download your {serviceInfo.fullName}</p>
                      </div>
                    </div>
                    <a
                      href={caseStatus.letter_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white text-[#1a5f7a] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      <DownloadIcon />
                      Download
                    </a>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Case Timeline</h3>
                <div className="space-y-4">
                  {TIMELINE_STAGES.map((stage, index) => {
                    const isComplete = index < stageIndex;
                    const isCurrent = index === stageIndex;
                    const isPending = index > stageIndex;

                    return (
                      <div key={stage.key} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isComplete ? "bg-green-500 text-white" :
                          isCurrent ? "bg-[#1a5f7a] text-white" :
                          "bg-gray-200 text-gray-400"
                        }`}>
                          {isComplete ? <CheckIcon /> : <span className="text-sm font-medium">{index + 1}</span>}
                        </div>
                        <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                          <p className={`font-medium ${isComplete || isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                            {stage.label}
                          </p>
                          <p className={`text-sm ${isComplete || isCurrent ? "text-gray-600" : "text-gray-400"}`}>
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - What We Have / Need */}
            <div className="space-y-6">
              {/* What We Have Received */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">What We Have Received</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${uploadedFiles.length > 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {uploadedFiles.length > 0 ? <CheckIcon /> : <ClockIcon />}
                    </div>
                    <span className="text-sm text-gray-700">
                      Medical Records ({uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""})
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${caseStatus.has_statement !== false ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {caseStatus.has_statement !== false ? <CheckIcon /> : <ClockIcon />}
                    </div>
                    <span className="text-sm text-gray-700">Personal Statement</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasPaymentMethod ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {hasPaymentMethod ? <CheckIcon /> : <ClockIcon />}
                    </div>
                    <span className="text-sm text-gray-700">Card Verified</span>
                  </li>
                </ul>
              </div>

              {/* What We Still Need */}
              {needsMoreInfo && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">Action Required</h3>
                  <p className="text-sm text-amber-700 mb-4">
                    {caseStatus.needs_more_info_message || "We need additional documentation to complete your review."}
                  </p>
                  <a href="/c/upload" className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700">
                    Upload Documents
                  </a>
                </div>
              )}

              {/* Payment Status */}
              {isApproved && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Payment Status</h3>
                  {paymentStatus === "succeeded" ? (
                    <div className="flex items-center gap-3 text-green-700">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckIcon />
                      </div>
                      <span className="font-medium">Payment Complete</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">Your card will be charged upon approval.</p>
                      <p className="text-xs text-gray-500">Card verified. No charge unless approved.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Help Section */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Need Help?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Questions about your case? Send us a secure message.
                </p>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="inline-flex items-center gap-2 text-[#1a5f7a] font-medium text-sm hover:underline"
                >
                  <MessageIcon />
                  Send a Secure Message
                </button>
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
    </>
  );
}
