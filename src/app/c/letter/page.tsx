"use client";

/**
 * Client Letter Download Page
 *
 * Features:
 * - Token-based access (magic link from email)
 * - Letter metadata display (type, physician, date)
 * - Embedded PDF viewer (iframe)
 * - Download button
 * - Professional medical aesthetic
 *
 * URL: /c/letter/?t=<64-char-token>
 */

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// API base URL - client letter routes (public, no HMAC)
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


const API_BASE = "https://api.sudomanaged.com/api/client";

interface LetterData {
  letter_type: string;
  physician_name: string;
  approved_at: string;
  expires_at: string;
}

interface DownloadResponse {
  success: boolean;
  downloadUrl: string;
  fileName: string;
}

// Icons
const Icons = {
  document: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  eye: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  physician: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function formatLetterType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Loading component for Suspense fallback
function LoadingState() {
  return (
      <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your letter...</p>
            </div>
          </div>
        </div>
      </main>
  </>
  );
}

// Main letter content component that uses searchParams
function LetterContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("t") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [letterData, setLetterData] = useState<LetterData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No access token provided. Please check your email for the correct link.");
      setLoading(false);
      return;
    }

    if (token.length !== 64) {
      setError("Invalid link format. Please check your email for the correct link.");
      setLoading(false);
      return;
    }

    fetchLetterData();
  }, [token]);

  async function fetchLetterData() {
    try {
      const res = await fetch(`${API_BASE}/letter/${token}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Letter not found or link has expired");
      }

      setLetterData(data.data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load letter");
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!token) return;
    setDownloading(true);

    try {
      const res = await fetch(`${API_BASE}/letter/${token}/download`);
      const data: DownloadResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Failed to get download link");
      }

      window.open(data.downloadUrl, "_blank");
    } catch (err) {
      alert("Failed to download. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleViewPdf() {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/letter/${token}/download`);
      const data: DownloadResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Failed to get PDF link");
      }

      setPdfUrl(data.downloadUrl);
      setShowViewer(true);
    } catch (err) {
      alert("Failed to load PDF viewer. Please try downloading instead.");
    }
  }

  // Loading state
  if (loading) {
    return (
      <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your letter...</p>
            </div>
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
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Access Letter</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact{" "}
              <a href="/contact" className="text-[#1a5f7a] hover:underline">
                contact us
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
    );
  }

  // Success state
  return (
    <>
    <MinimalHeader />
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#1a5f7a] to-[#2c8a6e] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                {Icons.document}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Your Letter is Ready</h1>
                <p className="text-white/80 text-sm">Review and download your medical opinion letter</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Letter Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  {Icons.document}
                  <span>Letter Type</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {letterData?.letter_type ? formatLetterType(letterData.letter_type) : "Medical Opinion"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  {Icons.physician}
                  <span>Physician</span>
                </div>
                <p className="font-semibold text-gray-900">{letterData?.physician_name || "Licensed Physician"}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  {Icons.calendar}
                  <span>Approved</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {letterData?.approved_at ? formatDate(letterData.approved_at) : "Today"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewPdf}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {Icons.eye}
                View Letter
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1a5f7a] hover:bg-[#134a5f] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Preparing...
                  </>
                ) : (
                  <>
                    {Icons.download}
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* PDF Viewer (shown when View Letter is clicked) */}
        {showViewer && pdfUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b">
              <span className="font-medium text-gray-700">Document Preview</span>
              <button
                onClick={() => setShowViewer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-[8.5/11] bg-gray-100">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full"
                title="Letter PDF"
              />
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 text-blue-600">{Icons.shield}</div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Secure Access</h3>
              <p className="text-sm text-blue-700">
                This link is unique to you and will expire on{" "}
                {letterData?.expires_at ? formatDate(letterData.expires_at) : "30 days from issue"}.
                Please download a copy for your records. If you need extended access, contact support.
              </p>
            </div>
          </div>
        </div>

        {/* Expiration Warning (if within 7 days) */}
        {letterData?.expires_at && new Date(letterData.expires_at).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mt-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 text-amber-600">{Icons.clock}</div>
              <div>
                <h3 className="font-medium text-amber-900 mb-1">Link Expiring Soon</h3>
                <p className="text-sm text-amber-700">
                  This access link will expire on {formatDate(letterData.expires_at)}.
                  Please download your letter now to ensure you have a copy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  </>
  );
}

// Main page component with Suspense boundary
export default function LetterPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LetterContent />
    </Suspense>
  );
}
