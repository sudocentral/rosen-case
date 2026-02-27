"use client";

/**
 * Payment Page - F6-B
 * Handles both normal payment collection and payment repair flows
 * when case is in collect_letter_fee status.
 * Uses inline SetupIntent card form for collect_letter_fee flow.
 */

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

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


const API_URL = "https://api.sudomanaged.com/api/payments/stripe";
const STATUS_API = "https://api.sudomanaged.com/api/rosen/public/client/status";
const CLIENT_API = "https://api.sudomanaged.com/api/rosen/public/client";
const ROSEN_TENANT_ID = "25ef3af9-b575-44b8-9f84-1c118a183719";

// Stripe promise cache
let stripePromiseCache: Promise<any> | null = null;
function getStripePromise(publishableKey: string) {
  if (!stripePromiseCache) {
    stripePromiseCache = loadStripe(publishableKey);
  }
  return stripePromiseCache;
}

// Card setup + auto-charge form for collect_letter_fee flow
interface SetupChargeFormProps {
  caseId: string;
  onSuccess: () => void;
}

function SetupChargeForm({ caseId, onSuccess }: SetupChargeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Confirm card setup with Stripe
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
        const token = localStorage.getItem("rosen_client_token");

        // Step 2: Store payment method on case
        const confirmRes = await fetch(`${CLIENT_API}/confirm-setup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-intake-token": token || "",
          },
          body: JSON.stringify({
            setupIntentId: setupIntent.id,
            paymentMethodId: setupIntent.payment_method,
          }),
        });

        const confirmData = await confirmRes.json();
        if (!confirmRes.ok || !confirmData.success) {
          throw new Error(confirmData.error || "Failed to save payment method");
        }

        // Step 3: Auto-charge the letter fee
        const chargeRes = await fetch(`${CLIENT_API}/cases/${caseId}/charge-letter-fee`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-intake-token": token || "",
          },
        });

        const chargeData = await chargeRes.json();
        if (!chargeRes.ok || !chargeData.success) {
          throw new Error(chargeData.error || "Payment failed");
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
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
          isProcessing
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
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Complete Payment
          </>
        )}
      </button>
      <p className="text-gray-500 text-xs text-center">
        Secure payment powered by Stripe. Your information is encrypted.
      </p>
    </form>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseIdFromUrl = searchParams.get("case");
  const tokenFromUrl = searchParams.get("token");
  const cancelled = searchParams.get("cancelled");

  const [loading, setLoading] = useState(true);
  const [caseId, setCaseId] = useState<string | null>(caseIdFromUrl);
  const [caseStatus, setCaseStatus] = useState<string | null>(null);
  const [invoiceAmount, setInvoiceAmount] = useState<number>(100000);
  const [error, setError] = useState<string | null>(null);
  const [autoChargeStatus, setAutoChargeStatus] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If ?token= URL param exists (from email link), use it as intake token
    const resolvedToken = tokenFromUrl || localStorage.getItem("rosen_client_token");
    if (tokenFromUrl) {
      // Persist URL token to localStorage for subsequent API calls
      localStorage.setItem("rosen_client_token", tokenFromUrl);
    }
    if (!resolvedToken && !caseIdFromUrl) {
      router.push("/start");
      return;
    }
    checkEligibility(resolvedToken, caseIdFromUrl);
  }, [router, caseIdFromUrl, tokenFromUrl]);

  const checkEligibility = async (token: string | null, urlCaseId: string | null) => {
    try {
      // If we have a token, get case info from status API
      if (token) {
        const statusRes = await fetch(STATUS_API, {
          headers: { "x-intake-token": token },
        });
        
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.success) {
            setCaseId(statusData.data.case_id);
            setCaseStatus(statusData.data.status);
            setInvoiceAmount(statusData.data.invoice_amount_cents || 100000);
            setAutoChargeStatus(statusData.data.auto_charge_status || null);

            // Only allow payment if collect_letter_fee status
            if (statusData.data.status !== "collect_letter_fee") {
              router.push("/c/status");
              return;
            }

            // Fetch SetupIntent for inline card entry
            try {
              const setupRes = await fetch(`${CLIENT_API}/setup-intent`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-intake-token": token || "",
                },
                body: JSON.stringify({}),
              });
              const setupData = await setupRes.json();
              if (setupRes.ok && setupData.success) {
                setClientSecret(setupData.data.clientSecret);
                setPublishableKey(setupData.data.publishableKey);
              } else {
                setError("Payment setup required to proceed.");
              }
            } catch {
              setError("Payment setup required to proceed.");
            }
          }
        }
      } else if (urlCaseId) {
        // Check eligibility via API
        const response = await fetch(`${API_URL}/case/${urlCaseId}/eligibility`, {
          headers: {
            "Content-Type": "application/json",
            "x-sudo-tenant-id": ROSEN_TENANT_ID,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Could not verify payment eligibility");
        }

        if (!data.data.eligible) {
          setError(data.data.reason || "Payment not available for this case.");
          setLoading(false);
          return;
        }

        setCaseStatus(data.data.caseStatus);
        setInvoiceAmount(data.data.invoiceAmountCents || 100000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChargeSuccess = useCallback(() => {
    setSuccess(true);
    setTimeout(() => router.push("/c/status"), 5000);
  }, [router]);

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (success) {
    return (
      <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Complete</h1>
          <p className="text-gray-700 mb-4">
            Your payment has been processed successfully. A licensed physician will begin preparing your letter.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your case status...</p>
        </div>
      </main>
      </>
    );
  }

  if (loading) {
    return (
      <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    </>
    );
  }

  if (error && !caseId) {
    return (
      <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50">
        <section className="section-padding">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Payment</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <a href="/c/status" className="inline-block bg-[#1a5f7a] text-white px-6 py-3 rounded-lg">
              Back to Status
            </a>
          </div>
        </section>
      </main>
    </>
    );
  }

  return (
    <>
    <MinimalHeader />
    <main className="min-h-screen bg-gray-50">
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {cancelled && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">Payment was cancelled. Please try again to begin your physician review.</p>
            </div>
          )}

          {(() => {
            const isCardFailure = autoChargeStatus?.startsWith("failed_") || autoChargeStatus === "no_payment_method";
            return (
              <div className="text-center mb-10">
                {isCardFailure ? (
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Payment Method Needs Attention
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Your Case Qualifies
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Payment to Begin Physician Review</h1>
                <p className="text-lg text-gray-600">
                  {isCardFailure
                    ? "Your case qualifies. We need a valid payment method to begin work."
                    : "Complete your one-time payment and a licensed physician will begin preparing your letter."}
                </p>
              </div>
            );
          })()}

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-8 text-center border-b border-gray-100">
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">Total Due</p>
              <p className="text-5xl font-bold text-gray-900">{formatAmount(invoiceAmount)}</p>
            </div>

            <div className="p-8">
              <h2 className="font-semibold text-gray-900 mb-4">What Happens Next</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Payment is processed securely</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">A licensed physician begins preparing your letter</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">You receive your physician-authored medical opinion within 48-72 hours</span>
                </li>
              </ul>
            </div>

            <div className="px-8 pb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Payment options:</strong> Pay with card, or use Klarna/Afterpay to split into 4 interest-free payments.
                </p>
              </div>
            </div>

            {error && (
              <div className="px-8 pb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="p-8 bg-gray-50">
              {clientSecret && publishableKey && (
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
                  <SetupChargeForm caseId={caseId!} onSuccess={handleChargeSuccess} />
                </Elements>
              )}
            </div>
          </div>

          <div className="text-center">
            <a href="/c/status" className="text-[#1a5f7a] hover:underline text-sm">
              Back to Case Status
            </a>
          </div>
        </div>
      </section>
    </main>
  </>
  );
}

export default function PaymentRepairPage() {
  return (
      <Suspense fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      }>
        <PaymentContent />
      </Suspense>
  );
}
