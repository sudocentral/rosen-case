"use client";

/**
 * Secure Invite Upload Page
 *
 * This page handles invite links (generated via POST /client/cases/:caseId/invite-link).
 * URL format: /c/invite?token=xxx
 *
 * Flow:
 * 1. Read token from query parameter
 * 2. Validate the invite token via API
 * 3. Display patient name and secure upload messaging
 * 4. Route directly to upload page for that case
 *
 * Important: This does NOT drop users into /c/status - it's upload-only flow.
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const API_URL = "https://api.sudomanaged.com/api/rosen/public/client";

interface InviteData {
  case_id: string;
  patient_name: string | null;
  client_email: string;
  expires_at: string;
}

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

function InviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);

  useEffect(() => {
    if (!inviteToken) {
      setError("Invalid invite link. Please request a new one.");
      setLoading(false);
      return;
    }

    validateInvite(inviteToken);
  }, [inviteToken]);

  const validateInvite = async (token: string) => {
    try {
      // Validate the invite token with the API
      const res = await fetch(`${API_URL}/invite/${token}/validate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.status === 404 || res.status === 410) {
        setError("This invite link has expired or is no longer valid. Please request a new one.");
        setLoading(false);
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid invite link");
      }

      setInviteData(data.data);
      setLoading(false);
    } catch (err) {
      console.error("Invite validation error:", err);
      setError("We couldn't validate your invite link. Please request a new one.");
      setLoading(false);
    }
  };

  const handleContinueToUpload = () => {
    if (!inviteData || !inviteToken) return;

    // Store the case context for the upload page
    localStorage.setItem("rosen_invite_token", inviteToken);
    localStorage.setItem("rosen_invite_case_id", inviteData.case_id);

    // Navigate to upload page with invite context
    router.push(`/c/upload?invite=${inviteToken}`);
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validating your secure link...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link Not Valid</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/welcome"
            className="inline-block bg-[#1a5f7a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#134a5f] transition-colors"
          >
            Request New Access Link
          </a>
        </div>
      </main>
    );
  }

  // Success state - show invite details and continue button
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#1a5f7a] to-[#2c8a6e] px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Secure Upload Link</h1>
          <p className="text-white/90">You've been invited to upload documents</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Patient info card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a5f7a]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1a5f7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Uploading for</p>
                <p className="font-semibold text-gray-900">
                  {inviteData?.patient_name || "Patient"}
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              What to upload
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Medical records and treatment notes
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lab results and imaging reports
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Prior decisions or denial letters (if applicable)
              </li>
            </ul>
          </div>

          {/* Security notice */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">Your privacy is protected</p>
                <p className="text-xs text-blue-700 mt-1">
                  All uploads are encrypted and handled in compliance with HIPAA. This link expires in 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinueToUpload}
            className="w-full flex items-center justify-center gap-2 bg-[#2c8a6e] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#247a5f] transition-colors"
          >
            Continue to Upload
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function InvitePage() {
  return (
    <>
      <MinimalHeader />
      <Suspense fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      }>
        <InviteContent />
      </Suspense>
    </>
  );
}
