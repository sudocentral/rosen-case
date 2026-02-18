"use client";

import { useState } from "react";
import StartListenButton from "../start/StartListenButton";

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


const API_URL = "https://api.sudomanaged.com/api/rosen/public";

export default function LandingPage() {
  const [mode, setMode] = useState<"new" | "login">("new");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"new" | "login">("new");
  const [error, setError] = useState("");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/client/resend-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // Handle rate limiting specifically
      if (response.status === 429) {
        throw new Error("Please wait a moment and try again.");
      }

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "We couldn't find a case with that email. Please check the address and try again.");
      }
      setSuccessType("login");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send the link. Please double-check your email and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phoneDigits(phone),
          name: name.trim(),
          source: "case_landing",
        }),
      });

      // Handle rate limiting specifically
      if (response.status === 429) {
        throw new Error("Please wait a moment and try again.");
      }

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "We couldn't create your case. Please check your information and try again.");
      }
      setSuccessType("new");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send the link. Please double-check your information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to start a new case
  const handleStartNew = () => {
    setSuccess(false);
    setMode("new");
    setEmail("");
    setPhone("");
    setName("");
    setError("");
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-2">We sent a secure link to:</p>
          <p className="font-semibold text-[#1a5f7a] mb-6">{email}</p>
          <p className="text-gray-500 text-sm mb-6">Click the link to access your case. Check spam if you don't see it.</p>
          
          {/* Show "start new case" option when coming from login flow */}
          {successType === "login" && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm mb-3">Don't have a case yet?</p>
              <button
                onClick={handleStartNew}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Start a New Case
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Login mode - just email
  if (mode === "login") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img src="/brand/logo.png?v=2" alt="Rosen Experts" className="h-12 mx-auto" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Your Case</h1>
            <p className="text-gray-600 mb-6">Enter your email and we'll send you a secure link.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#1a5f7a] text-white rounded-xl font-semibold hover:bg-[#134a5f] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Access Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => setMode("new")} className="text-[#1a5f7a] hover:underline text-sm">
                ← Start a new case instead
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // New case mode (default) - form directly visible
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/brand/logo.png?v=2" alt="Rosen Experts" className="h-12 mx-auto mb-6" />
          <StartListenButton />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Start Your Free Review</h1>
          <p className="text-gray-600 mb-6 text-center">We'll email you a secure link to upload your records.</p>

          <form onSubmit={handleNewCase} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent outline-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !email || !name || !phone}
              className="w-full py-4 bg-gradient-to-r from-[#1a5f7a] to-[#134a5f] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Continue
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-4">
            Your information is secure and never shared.
          </p>

          {/* Access existing case link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-2">Already started a case?</p>
            <button onClick={() => setMode("login")} className="text-[#1a5f7a] hover:underline font-medium">
              Access your existing case →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
