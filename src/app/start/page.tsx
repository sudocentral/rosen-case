"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StartListenButton from "./StartListenButton";

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


const API_URL = "https://api.sudomanaged.com/api/rosen/public/start";

// Service type definitions
type ServiceType = "va" | "ssdi" | "insurance" | "malpractice" | "second-opinion" | "general";

const getServiceConfig = (service: ServiceType) => {
  const isVA = service === "va";
  // C-1: Use "Medical Opinion" instead of "IMO" for non-VA until claim_type is determined
  return {
    isVA,
    documentName: isVA ? "Physician-Authored Medical Opinion" : "Medical Opinion",
    documentNameShort: isVA ? "Physician-Authored Medical Opinion" : "Medical Opinion",
    step4Label: isVA ? "If Qualified → Charge + Release Physician-Authored Medical Opinion" : "If Qualified → Charge + Release Medical Opinion",
    qualificationNote: isVA
      ? "For VA cases, qualification requires sufficient medical evidence and a supportable service-connection rationale."
      : "For non-VA cases, qualification requires sufficient medical evidence to support a Medical Opinion for your purpose.",
  };
};

// Inner component that uses useSearchParams
function StartPageContent() {
  const searchParams = useSearchParams();
  const serviceParam = (searchParams.get("service") || "") as ServiceType;
  // Pre-select only if URL has a specific (non-general) service
  const [selectedService, setSelectedService] = useState<ServiceType | "">(
    serviceParam && serviceParam !== "general" ? serviceParam : ""
  );
  const config = getServiceConfig(selectedService || "general");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const TOS_VERSION = "2026-01-16";

  // Format phone as (XXX) XXX-XXXX while typing
  function formatPhoneInput(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  // Strip to raw digits for API submission
  function phoneDigits(formatted: string): string {
    return formatted.replace(/\D/g, "");
  }

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          phone: phoneDigits(phone) || undefined,
          name: name.trim() || undefined,
          source: "case_marketing",
          service: selectedService,
          tos_accepted: true,
          tos_version: TOS_VERSION,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      if (selectedService) {
        localStorage.setItem("rosen_selected_service", selectedService);
      }
      setIsSubmitted(true);
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          phone: phoneDigits(phone) || undefined,
          name: name.trim() || undefined,
          source: "case_marketing",
          service: selectedService,
          resend: true,
          tos_accepted: true,
          tos_version: TOS_VERSION,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not resend. Please try again.");
      }

      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation view after successful submission
  if (isSubmitted) {
    return (
      <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50">
        <section className="section-padding">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Success icon */}
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              We sent a secure link to:
            </p>
            <p className="text-xl font-semibold text-[#1a5f7a] mb-8">
              {email}
            </p>
            <p className="text-gray-600 mb-8">
              Click the link in your email to continue your {config.documentName} request. The link is valid for 7 days.
            </p>

            {/* Resend section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-gray-600 mb-4">
                Didn&apos;t receive the email? Check your spam folder or resend.
              </p>
              {error && (
                <p className="text-red-600 text-sm mb-4">{error}</p>
              )}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || isSubmitting}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  resendCooldown > 0 || isSubmitting
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#1a5f7a] text-white hover:bg-[#134a5f]"
                }`}
              >
                {isSubmitting
                  ? "Sending..."
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Link"}
              </button>
            </div>

            {/* Support contact */}
            <div className="text-gray-500 text-sm">
              <p>Need help? Contact us at</p>
              <a
                href="/contact"
                className="text-[#1a5f7a] hover:underline"
              >
                contact us
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
    );
  }

  // Form view
  return (
    <>
    <MinimalHeader />
    <main className="bg-gray-50">
      {/* Hero with Form */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No Payment Required to Start
            </div>
            <div className="flex justify-center mb-4">
              <StartListenButton />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Start Your {config.documentName} Request
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Enter your information and we&apos;ll send you a secure link to begin your intake form.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Case Type field */}
                <div>
                  <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-2">
                    Case Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="caseType"
                    required
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="" disabled>Select Case Type</option>
                    <option value="va">VA Disability</option>
                    <option value="ssdi">SSDI</option>
                    <option value="insurance">Insurance Denial</option>
                    <option value="malpractice">Medical Malpractice</option>
                    <option value="second-opinion">Second Opinion</option>
                  </select>
                </div>

                {/* Phone field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Terms of Service checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="tos"
                    checked={tosAccepted}
                    onChange={(e) => setTosAccepted(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-[#1a5f7a] focus:ring-[#1a5f7a] cursor-pointer"
                  />
                  <label htmlFor="tos" className="text-sm text-gray-700 cursor-pointer">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="text-[#1a5f7a] underline hover:text-[#134a5f]">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" className="text-[#1a5f7a] underline hover:text-[#134a5f]">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !email || !tosAccepted || !selectedService}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                    isSubmitting || !email
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#1a5f7a] to-[#134a5f] text-white hover:shadow-xl hover:shadow-[#1a5f7a]/25"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Start Your Free Review
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Truth statement - card collection notice */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-xs text-center">
                  We collect a card at upload, but you are charged only if your case qualifies for a written medical opinion.
                </p>
              </div>

              <p className="text-gray-500 text-xs text-center mt-4">
                We&apos;ll email you a secure link to complete your intake form. Your information is protected and never shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Happens Next</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#1a5f7a] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Check Email</h3>
              <p className="text-gray-600 text-sm">Click your secure link to continue</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#1a5f7a] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Intake</h3>
              <p className="text-gray-600 text-sm">Upload records and add card on file</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#1a5f7a] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Record Review</h3>
              <p className="text-gray-600 text-sm">Physician-Led Review</p>
            </div>
            {/* Step 4 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">If Qualified</h3>
              <p className="text-gray-600 text-sm">Charge + Release {config.documentNameShort}</p>
            </div>
          </div>

          {/* Service-specific qualification note */}
          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-center text-sm text-gray-500 italic">
              {config.qualificationNote}
            </p>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-14 h-14 bg-[#1a5f7a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1a5f7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your information is encrypted and protected</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-[#1a5f7a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1a5f7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Upfront Payment</h3>
              <p className="text-gray-600 text-sm">Pay only if you qualify</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-[#1a5f7a]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1a5f7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Licensed Physicians</h3>
              <p className="text-gray-600 text-sm">Licensed physicians review every case</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </>
  );
}

// Loading fallback
function StartPageLoading() {
  return (
    <>
    <MinimalHeader />
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </main>
  </>
  );
}

// Main page component with Suspense boundary
export default function StartPage() {
  return (
      <Suspense fallback={<StartPageLoading />}>
        <StartPageContent />
      </Suspense>
  );
}
