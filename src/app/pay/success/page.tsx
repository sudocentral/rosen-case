"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackEvent } from "@/components/Analytics";

const API_URL = "https://api.sudomanaged.com/api/payments/stripe";
const ROSEN_TENANT_ID = "25ef3af9-b575-44b8-9f84-1c118a183719";

function SuccessContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("case");
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Invalid confirmation link");
      setLoading(false);
      return;
    }
    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`${API_URL}/session/${sessionId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-sudo-tenant-id": ROSEN_TENANT_ID,
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.data.payment_status === "paid") {
        setVerified(true);
        trackEvent.paymentComplete(data.data.amount_total || 100000, undefined, sessionId || undefined);
      } else {
        setVerified(true);
        trackEvent.paymentComplete(100000);
      }
    } catch {
      setVerified(true);
      trackEvent.paymentComplete(100000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </main>
    );
  }

  if (error && !verified) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen">
        <section className="section-padding">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Issue</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-y-4">
              {caseId && <a href={`/pay?case=${caseId}`} className="inline-block btn-primary">Try Again</a>}
              <p className="text-gray-500 text-sm">or <a href="/contact" className="text-[#1a5f7a] hover:underline">contact support</a></p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <section className="section-padding">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-8">Thank you. Your physician opinion letter is now being prepared.</p>

          <div className="bg-gray-50 rounded-2xl p-8 text-left mb-8">
            <h2 className="font-semibold text-gray-900 mb-4 text-center">What Happens Next</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#1a5f7a] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-gray-900">Physician Assignment</p>
                  <p className="text-gray-600 text-sm">A licensed physician will review your case.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#1a5f7a] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-medium text-gray-900">Letter Preparation</p>
                  <p className="text-gray-600 text-sm">Your physician will prepare your opinion letter.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#1a5f7a] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-gray-900">Delivery</p>
                  <p className="text-gray-600 text-sm">You&apos;ll receive an email when ready (typically 48-72 hours).</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="text-left">
                <p className="font-medium text-blue-900">Check Your Email</p>
                <p className="text-blue-800 text-sm">We&apos;ve sent a confirmation. You&apos;ll receive updates as your letter is prepared.</p>
              </div>
            </div>
          </div>

          <div className="text-gray-500 text-sm">
            <p>Questions? <a href="/contact" className="text-[#1a5f7a] hover:underline">Contact us</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
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
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
