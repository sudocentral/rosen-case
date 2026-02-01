"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackEvent } from "@/components/Analytics";

const API_URL = "https://api.sudomanaged.com/api/payments/stripe";
const ROSEN_TENANT_ID = "25ef3af9-b575-44b8-9f84-1c118a183719";

interface EligibilityData {
  caseId: string;
  eligible: boolean;
  reason: string | null;
  effectiveDecision: string | null;
  invoiceAmountCents: number;
  invoiceStatus: string | null;
  caseStatus: string;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("case");
  const cancelled = searchParams.get("cancelled");

  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!caseId) {
      setError("Invalid payment link. Please use the link from your email.");
      setLoading(false);
      return;
    }
    checkEligibility();
  }, [caseId]);

  const checkEligibility = async () => {
    try {
      const response = await fetch(`${API_URL}/case/${caseId}/eligibility`, {
        headers: {
          "Content-Type": "application/json",
          "x-sudo-tenant-id": ROSEN_TENANT_ID,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not verify payment eligibility");
      }

      setEligibility(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!eligibility?.eligible || !caseId) return;

    setIsRedirecting(true);
    setError(null);

    trackEvent.paymentInitiate(eligibility.invoiceAmountCents);

    try {
      const response = await fetch(`${API_URL}/case/${caseId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sudo-tenant-id": ROSEN_TENANT_ID,
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/pay/success?case=${caseId}&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pay?case=${caseId}&cancelled=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not create checkout session");
      }

      window.location.href = data.data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setIsRedirecting(false);
    }
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment link...</p>
        </div>
      </main>
    );
  }

  if (error && !eligibility) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Payment</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <a href="/contact" className="inline-block btn-primary">Contact Support</a>
          </div>
        </section>
      </main>
    );
  }

  if (eligibility && !eligibility.eligible) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Not Available</h1>
            <p className="text-gray-600 mb-4">{eligibility.reason || "This case is not eligible for payment at this time."}</p>
            {eligibility.invoiceStatus === "paid" && (
              <p className="text-emerald-600 font-medium mb-8">Your payment has already been received. Thank you!</p>
            )}
            <a href="/contact" className="inline-block btn-secondary">Questions? Contact Us</a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {cancelled && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">Payment was cancelled. You can try again when you are ready.</p>
            </div>
          )}

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your Case Qualifies
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Your Payment</h1>
            <p className="text-lg text-gray-600">Your physician opinion letter is ready to be prepared.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-8 text-center border-b border-gray-100">
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">Total Due</p>
              <p className="text-5xl font-bold text-gray-900">{formatAmount(eligibility?.invoiceAmountCents || 100000)}</p>
            </div>

            <div className="p-8">
              <h2 className="font-semibold text-gray-900 mb-4">What&apos;s Included</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Licensed physician opinion letter</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Proper medical-legal language</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Physician credentials and signature</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Secure digital delivery within 48-72 hours</span>
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
              <button
                onClick={handlePayment}
                disabled={isRedirecting}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                  isRedirecting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#1a5f7a] to-[#134a5f] text-white hover:shadow-xl hover:shadow-[#1a5f7a]/25"
                }`}
                aria-busy={isRedirecting}
              >
                {isRedirecting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Redirecting to Secure Checkout...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Complete Secure Payment
                  </>
                )}
              </button>
              <p className="text-gray-500 text-xs text-center mt-4">
                Secure payment powered by Stripe. Your information is encrypted.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-xs text-gray-500">256-bit SSL</p>
            </div>
            <div>
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-xs text-gray-500">Stripe Secured</p>
            </div>
            <div>
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-500">Financing Available</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Questions? <a href="/contact" className="text-[#1a5f7a] hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="pt-20 lg:pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      }>
        <PaymentContent />
      </Suspense>
      <Footer />
    </>
  );
}
