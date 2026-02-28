"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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


const VALIDATE_URL = "https://api.sudomanaged.com/api/rosen/public/magic/validate";
const FILES_URL = "https://api.sudomanaged.com/api/rosen/public/client/files";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error" | "expired">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectTarget, setRedirectTarget] = useState("/c/status");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided.");
      return;
    }

    validateToken(token);
  }, [token]);

  const validateToken = async (tokenValue: string) => {
    try {
      const response = await fetch(VALIDATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenValue }),
      });

      const data = await response.json();

      if (data.valid) {
        // Store token for Client Center access
        if (typeof window !== "undefined") {
          localStorage.setItem("rosen_client_token", tokenValue);
          localStorage.setItem("rosen_case_id", data.case_id);
        }

        // Use backend required_step to determine where user should go
        // Backend is source of truth (intake-state.js computes this)
        let destination = "/c/status";
        if (data.required_step === "files") {
          destination = "/c/upload";
        } else if (data.required_step === "dob_description") {
          destination = "/c/statement";
        }

        setRedirectTarget(destination);
        setStatus("success");

        // Redirect after brief delay
        setTimeout(() => {
          router.push(destination);
        }, 1500);
      } else {
        if (data.reason === "expired") {
          setStatus("expired");
          setErrorMessage("This link has expired. Please request a new one.");
        } else {
          setStatus("error");
          setErrorMessage("Invalid or expired link. Please request a new one.");
        }
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Could not verify your link. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {status === "verifying" && (
        <>
          <div className="w-16 h-16 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Link</h1>
          <p className="text-gray-600">Please wait while we verify your secure access...</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Verified!</h1>
          <p className="text-gray-600">
            {redirectTarget === "/c/upload"
              ? "Redirecting you to upload your medical records..."
              : redirectTarget === "/c/statement"
              ? "Redirecting you to continue your intake..."
              : "Redirecting you to your case status..."}
          </p>
        </>
      )}

      {status === "expired" && (
        <>
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Link Expired</h1>
          <p className="text-gray-600 mb-8">{errorMessage}</p>
          <a href="/welcome" className="inline-block bg-[#1a5f7a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#134a5f] transition-colors min-h-[48px]">
            Request New Link
          </a>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h1>
          <p className="text-gray-600 mb-8">{errorMessage}</p>
          <a href="/welcome" className="inline-block bg-[#1a5f7a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#134a5f] transition-colors min-h-[48px]">
            Start Over
          </a>
        </>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-16 h-16 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
    </div>
  );
}

export default function VerifyPage() {
  return (
      <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Suspense fallback={<LoadingFallback />}>
          <VerifyContent />
        </Suspense>
      </main>
  </>
  );
}
