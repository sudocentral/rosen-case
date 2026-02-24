"use client";

/**
 * Card Authorization Page - F6-B
 * Collects card via Stripe SetupIntent for auto-charge on qualification.
 * User is NOT charged at this step.
 *
 * Draft Caching (P0 UX Safety):
 * - Clears intake draft from localStorage on successful submission
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import IntakeStepper from "@/components/IntakeStepper";

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


const API_URL = "https://api.sudomanaged.com/api/rosen/public/client";
const STATUS_API = "https://api.sudomanaged.com/api/rosen/public/client/status";
const ROSEN_TENANT_ID = "25ef3af9-b575-44b8-9f84-1c118a183719";

// Draft cache helper - clear on successful submission
function clearIntakeDraft(token: string): void {
  try {
    const key = `intakeDraft:${token}`;
    localStorage.removeItem(key);
  } catch {
    // Ignore localStorage errors
  }
}

// Stripe promise cache - loaded dynamically with key from API
let stripePromiseCache: Promise<any> | null = null;
function getStripePromise(publishableKey: string) {
  if (!stripePromiseCache) {
    stripePromiseCache = loadStripe(publishableKey);
  }
  return stripePromiseCache;
}

interface SetupFormProps {
  clientSecret: string;
  caseId: string;
  onSuccess: () => void;
  dbqCount: number;
  physicianStatementRequested: boolean;
  expeditedDelivery: "STANDARD_7_DAYS" | "EXPEDITED_72_HOURS";
}

function SetupForm({ clientSecret, caseId, onSuccess, dbqCount, physicianStatementRequested, expeditedDelivery }: SetupFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !agreed) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (submitError) {
        setError(submitError.message || "Card verification failed");
        setIsProcessing(false);
        return;
      }

      if (setupIntent && setupIntent.status === "succeeded") {
        // Store payment method on case
        const token = localStorage.getItem("rosen_client_token");
        const response = await fetch(`${API_URL}/confirm-setup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-intake-token": token || "",
          },
          body: JSON.stringify({
            setupIntentId: setupIntent.id,
            paymentMethodId: setupIntent.payment_method,
            dbq_count: dbqCount,
            physician_statement_requested: physicianStatementRequested,
            expedited_delivery: expeditedDelivery,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to save payment method");
        }

        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Disclosure checkbox */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#1a5f7a] focus:ring-[#1a5f7a]"
        />
        <span className="text-sm text-gray-700">
          I agree to the{" "}
          <a href="/terms" className="text-[#1a5f7a] underline" target="_blank">
            Terms of Service
          </a>{" "}
          and understand that a temporary $1.00 hold will be placed on my card and released automatically. I will only be charged if my case qualifies for a physician-authored letter.
        </span>
      </label>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !agreed}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
          isProcessing || !agreed
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-[#1a5f7a] to-[#134a5f] text-white hover:shadow-xl hover:shadow-[#1a5f7a]/25"
        }`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Verifying...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Submit for Free Review
          </>
        )}
      </button>
    </form>
  );
}

export default function CardAuthorizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [hasFiles, setHasFiles] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [dbqCount, setDbqCount] = useState(0);
  const [showDbqInfo, setShowDbqInfo] = useState(false);
  const [physicianStatementRequested, setPhysicianStatementRequested] = useState(false);
  const [expeditedDelivery, setExpeditedDelivery] = useState<"STANDARD_7_DAYS" | "EXPEDITED_72_HOURS">("STANDARD_7_DAYS");

  useEffect(() => {
    // Check if card was just submitted (survives page reload / layout redirect)
    const submittedAt = localStorage.getItem("rosen_card_submitted");
    if (submittedAt) {
      const elapsed = Date.now() - parseInt(submittedAt, 10);
      if (elapsed < 30000) {
        // Still within the dwell window — show success screen
        setSuccess(true);
        setLoading(false);
        const remaining = Math.max(2000, 10000 - elapsed);
        setTimeout(() => {
          localStorage.removeItem("rosen_card_submitted");
          router.push("/c/status");
        }, remaining);
        return;
      }
      // Stale flag, clean up
      localStorage.removeItem("rosen_card_submitted");
    }

    const token = localStorage.getItem("rosen_client_token");
    const storedCaseId = localStorage.getItem("rosen_case_id");

    if (!token) {
      router.push("/start");
      return;
    }

    checkStatusAndSetup(token, storedCaseId);
  }, [router]);

  const checkStatusAndSetup = async (token: string, storedCaseId: string | null) => {
    try {
      // Check case status first
      const statusRes = await fetch(STATUS_API, {
        headers: { "x-intake-token": token },
      });

      if (statusRes.status === 401) {
        localStorage.removeItem("rosen_client_token");
        localStorage.removeItem("rosen_case_id");
        router.push("/start");
        return;
      }

      const statusData = await statusRes.json();
      if (!statusRes.ok || !statusData.success) {
        throw new Error(statusData.error || "Could not load case");
      }

      const caseData = statusData.data;
      setCaseId(caseData.case_id);
      // Use claim_type from API; if AUTO or missing, fall back to localStorage selection
      let resolvedType = caseData.claim_type || caseData.service_type || null;
      if (!resolvedType || resolvedType === "AUTO") {
        const stored = typeof window !== "undefined" ? localStorage.getItem("rosen_selected_service") : null;
        if (stored) resolvedType = stored;
      }
      setServiceType(resolvedType);

      // Check if files uploaded
      const filesRes = await fetch("https://api.sudomanaged.com/api/rosen/public/client/files", {
        headers: { "x-intake-token": token },
      });
      const filesData = await filesRes.json();
      // Count files that are uploaded OR pending (pending means S3 upload succeeded but confirm didn't run)
      const uploadedCount = filesData.success
        ? (filesData.data.files || []).filter((f: any) => f.status === "uploaded" || f.status === "pending").length
        : 0;

      if (uploadedCount === 0) {
        // Redirect to upload first
        window.location.href = "/c/upload";
        return;
      }

      setHasFiles(true);

      // Create SetupIntent via public endpoint (uses intake-token, no HMAC)
      const setupRes = await fetch(`${API_URL}/setup-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token,
        },
        body: JSON.stringify({}),
      });

      const setupData = await setupRes.json();
      if (!setupRes.ok || !setupData.success) {
        throw new Error(setupData.error || "Could not initialize card form");
      }

      setClientSecret(setupData.data.clientSecret);
      setPublishableKey(setupData.data.publishableKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = useCallback(() => {
    // Persist submission flag so success screen survives page reloads
    localStorage.setItem("rosen_card_submitted", Date.now().toString());
    setSuccess(true);
    setLoading(false);

    // Clear intake draft from localStorage - intake is complete
    const token = localStorage.getItem("rosen_client_token");
    if (token) {
      clearIntakeDraft(token);
    }

    // Sherlock already triggered at statement submission (silent, in background)
    // Just redirect to status after showing success message
    setTimeout(() => {
      localStorage.removeItem("rosen_card_submitted");
      router.push("/c/status");
    }, 10000);
  }, [router]);

  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (success) {
    const storedService = typeof window !== "undefined" ? localStorage.getItem("rosen_selected_service") : null;
    const isVA = (!!serviceType && serviceType.toLowerCase().startsWith("va")) || (!!storedService && storedService.toLowerCase().startsWith("va"));
    return (
      <>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-lg px-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Records Submitted</h1>
            <p className="text-gray-700 mb-4">
              Your card has been verified and your records are now in our review queue. The $1.00 hold will be released automatically.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next</h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">1.</span>
                  <span>We review your records. Most cases do not qualify.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">2.</span>
                  <span>
                    {isVA
                      ? "If your case qualifies, we charge $1,000 and a physician begins your Nexus Letter."
                      : "If your case qualifies, we charge $1,000 and a physician begins your Independent Medical Opinion."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">3.</span>
                  <span>If your case does not qualify, you are not charged.</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">Redirecting to your case status...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <main className="min-h-screen bg-gray-50">
          <section className="section-padding">
            <div className="max-w-2xl mx-auto px-4 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load</h1>
              <p className="text-gray-600 mb-8">{error}</p>
              <a href="/c/upload" className="inline-block bg-[#1a5f7a] text-white px-6 py-3 rounded-lg">
                Back to Upload
              </a>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <section className="section-padding">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <IntakeStepper currentStep="verification" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free Review
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Complete Your Free Records Review
              </h1>
              <p className="text-gray-600">
                We review your records at no cost. A temporary $1.00 hold verifies your card and is released automatically. Most cases do not qualify. You are only charged if yours does.
              </p>
            </div>

            {/* Info card */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">How it works</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>A $1.00 hold confirms your card is valid. It is released automatically.</li>
                    <li>We review your records for free. Most cases do not qualify.</li>
                    <li>If your case qualifies, we charge $1,000 and a physician begins your letter.</li>
                    <li>If your case does not qualify, you pay nothing.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Why we verify */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <p className="text-amber-800 text-sm">
                <strong>Why the $1.00 hold?</strong> The free review requires physician time. The hold helps us prioritize serious inquiries and is released automatically. You are never charged unless your case qualifies.
              </p>
            </div>

            {/* DBQ Add-On — VA only */}
            {(
              (!!serviceType && serviceType.toLowerCase().startsWith("va")) ||
              (typeof window !== "undefined" && (localStorage.getItem("rosen_selected_service") || "").toLowerCase().startsWith("va"))
            ) && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Optional: Disability Benefits Questionnaires (DBQs)</h3>
                <div className="text-sm text-gray-600 space-y-3 mb-4">
                  <p>
                    A Disability Benefits Questionnaire (DBQ) is a VA-recognized medical form used to document the diagnosis, severity, symptoms, and functional impact of a specific medical condition for disability compensation purposes.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>DBQs are completed per condition being evaluated.</li>
                    <li>If you are claiming multiple conditions, more than one DBQ may be appropriate.</li>
                  </ul>
                  <p className="font-semibold text-gray-900">$199 per DBQ</p>
                  <p className="text-xs text-gray-500">You will not be charged unless you medically qualify.</p>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <label className="text-sm font-medium text-gray-700">Number of DBQs:</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDbqCount(Math.max(0, dbqCount - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      disabled={dbqCount === 0}
                    >&minus;</button>
                    <span className="w-10 text-center font-semibold text-lg">{dbqCount}</span>
                    <button
                      type="button"
                      onClick={() => setDbqCount(dbqCount + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >+</button>
                  </div>
                  {dbqCount > 0 && (
                    <span className="text-sm text-gray-500">= ${dbqCount * 199}.00</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowDbqInfo(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-[#1a5f7a] hover:text-[#134a5f] font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  What is a DBQ?
                </button>
              </div>
            )}

            {/* Expedited Delivery Option */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Expedited Delivery (Optional)</h3>
              <p className="text-sm text-gray-600 mb-4">
                Eligible clients can receive their IMO Report as fast as 72 hours from receipt of their relevant medical records. If, due to the lack of medical evidence we are unable to provide the report, we will not charge you the expedited service fee.
              </p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="expedited_delivery"
                    value="STANDARD_7_DAYS"
                    checked={expeditedDelivery === "STANDARD_7_DAYS"}
                    onChange={() => setExpeditedDelivery("STANDARD_7_DAYS")}
                    className="w-4 h-4 text-[#1a5f7a] focus:ring-[#1a5f7a]"
                  />
                  <span className="text-sm font-medium text-gray-900">7 Days — Included</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="expedited_delivery"
                    value="EXPEDITED_72_HOURS"
                    checked={expeditedDelivery === "EXPEDITED_72_HOURS"}
                    onChange={() => setExpeditedDelivery("EXPEDITED_72_HOURS")}
                    className="w-4 h-4 text-[#1a5f7a] focus:ring-[#1a5f7a]"
                  />
                  <span className="text-sm font-medium text-gray-900">72 Hours — $400</span>
                </label>
              </div>
            </div>

            {clientSecret && caseId && publishableKey ? (
              <Elements
                stripe={getStripePromise(publishableKey)}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#1a5f7a",
                      borderRadius: "8px",
                    },
                  },
                }}
              >
                <SetupForm
                  clientSecret={clientSecret}
                  caseId={caseId}
                  onSuccess={handleSuccess}
                  dbqCount={dbqCount}
                  physicianStatementRequested={physicianStatementRequested}
                  expeditedDelivery={expeditedDelivery}
                />
              </Elements>
            ) : (
              <div className="bg-gray-100 rounded-xl p-6 text-center">
                <p className="text-gray-600">Loading card form...</p>
              </div>
            )}

            {/* DBQ Info Modal */}
      {showDbqInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDbqInfo(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">What Is a Disability Benefits Questionnaire (DBQ)?</h2>
              <button onClick={() => setShowDbqInfo(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-700 space-y-4">
              <p>
                A Disability Benefits Questionnaire (DBQ) is a standardized medical form used by the U.S. Department of Veterans Affairs to evaluate the severity and functional impact of a specific medical condition.
              </p>
              <div>
                <p className="font-semibold text-gray-900 mb-2">A DBQ helps document:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your formal diagnosis</li>
                  <li>Your current symptoms</li>
                  <li>Objective medical findings</li>
                  <li>Functional limitations</li>
                  <li>Criteria that directly relate to VA rating percentages</li>
                </ul>
              </div>
              <p className="text-gray-600 italic">
                A DBQ supports how your condition is rated. It does not establish service connection by itself.
              </p>

              <hr className="border-gray-200" />

              <div>
                <h3 className="font-bold text-gray-900 mb-2">How Many DBQs Do I Need?</h3>
                <p className="mb-2">DBQs are completed per medical condition being evaluated.</p>
                <p className="font-semibold text-gray-900 mb-1">You may need more than one DBQ if:</p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  <li>You are claiming multiple unrelated conditions (Example: PTSD, migraines, and a back condition)</li>
                  <li>You are claiming conditions affecting different body systems (Mental health, orthopedic, respiratory, neurological, etc.)</li>
                  <li>You are filing for increases on multiple service-connected conditions</li>
                </ul>
                <p className="font-semibold text-gray-900 mb-1">You usually do not need multiple DBQs if:</p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  <li>Multiple symptoms fall under one condition (Example: anxiety and depression are documented under one Mental Health DBQ)</li>
                  <li>You are only evaluating one condition</li>
                </ul>
                <p className="text-gray-600 italic">
                  If you are unsure how many DBQs are appropriate, our physician-led review will determine the correct number based on your medical documentation and claim strategy.
                </p>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h3 className="font-bold text-gray-900 mb-2">DBQ vs. Nexus Opinion</h3>
                <ul className="space-y-2">
                  <li><span className="font-semibold">A DBQ</span> documents severity for rating purposes.</li>
                  <li><span className="font-semibold">A Nexus Opinion</span> establishes service connection between your condition and military service.</li>
                </ul>
                <p className="mt-2">Some cases benefit from one. Some benefit from both.</p>
                <p className="font-semibold text-gray-900 mt-1">We determine this during your medical review.</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowDbqInfo(false)}
                className="w-full px-4 py-2.5 bg-[#1a5f7a] text-white rounded-lg font-medium hover:bg-[#134a5f] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs">Stripe Secured</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
