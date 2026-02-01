"use client";

/**
 * Add New Patient Page
 * For existing clients to add a new patient/case without going through welcome flow.
 *
 * HARD GUARD (2026-01-19):
 * This page is ONLY accessible when:
 * - case_count == 0 (new user with no cases), OR
 * - User explicitly clicked "Add New Patient" (intent flag set)
 *
 * If case_count >= 1 AND no intent flag → redirect to /c/status
 *
 * Flow:
 * 1. Verify token (redirect to /welcome if invalid)
 * 2. Check case_count + intent flag (redirect to /c/status if blocked)
 * 3. Collect patient name and DOB
 * 4. Create new case via API (POST /client/new-case)
 * 5. Clear intent flag and redirect to /c/upload
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewPatientPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Track if user has existing cases (for escape hatch visibility)
  const [hasExistingCases, setHasExistingCases] = useState(false);

  // Parse MM/DD/YYYY format only, returns { date: Date, iso: string } or null
  const parseDateInput = (input: string): { date: Date; iso: string } | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Only accept MM/DD/YYYY format
    const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;

    const [, month, day, year] = match;
    const iso = `${year}-${month}-${day}`;
    const date = new Date(iso + "T00:00:00");
    if (!isNaN(date.getTime())) {
      return { date, iso };
    }
    return null;
  };

  // Auto-format date input with slashes (MM/DD/YYYY)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Strip non-digits
    const digits = input.replace(/\D/g, "");

    // Build formatted string with auto-slashes
    let formatted = "";
    for (let i = 0; i < digits.length && i < 8; i++) {
      if (i === 2 || i === 4) {
        formatted += "/";
      }
      formatted += digits[i];
    }

    setDateOfBirth(formatted);
  };

  useEffect(() => {
    // Get token from localStorage
    const storedToken = typeof window !== "undefined"
      ? localStorage.getItem("rosen_client_token")
      : null;

    if (!storedToken) {
      router.push("/welcome");
      return;
    }

    // Validate token by checking cases endpoint
    validateToken(storedToken);
  }, [router]);

  const validateToken = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/cases`, {
        headers: { "x-intake-token": authToken },
      });

      if (res.status === 401) {
        localStorage.removeItem("rosen_client_token");
        localStorage.removeItem("rosen_case_id");
        router.push("/welcome");
        return;
      }

      // If API fails (non-401), allow user to stay on page
      // Don't redirect - show error instead
      if (!res.ok) {
        console.error("[new-patient] Cases API failed with status:", res.status);
        setError("Unable to verify your account. Please try again or contact support.");
        setToken(authToken); // Allow form anyway
        setIsValidating(false);
        return;
      }

      const data = await res.json();

      // If API returns success=false, allow user to stay
      if (!data.success) {
        console.error("[new-patient] Cases API returned success=false:", data.error);
        setError("Unable to verify your account. Please try again or contact support.");
        setToken(authToken);
        setIsValidating(false);
        return;
      }

      const casesList = data.data?.cases || [];
      setHasExistingCases(casesList.length > 0);

      // =========================================================
      // HARD GUARD: Check case_count + intent flag
      // =========================================================
      // Check if user has intent flag (clicked "Add New Patient")
      const hasIntentFlag = typeof window !== "undefined"
        ? sessionStorage.getItem("add_patient_intent") === "true"
        : false;

      // If user has existing cases AND no intent flag, redirect to /c/status
      if (casesList.length >= 1 && !hasIntentFlag) {
        console.log("[new-patient] GUARD: case_count >= 1, no intent flag → redirecting to /c/status");
        router.replace("/c/status");
        return;
      }

      // Clear intent flag immediately (one-time use)
      if (hasIntentFlag) {
        sessionStorage.removeItem("add_patient_intent");
        console.log("[new-patient] Intent flag consumed and cleared");
      }

      setToken(authToken);
    } catch (err) {
      console.error("[new-patient] Token validation failed:", err);
      // On network error, don't redirect - show error and allow form
      setError("Unable to connect. Please check your internet and try again.");
      const storedToken = localStorage.getItem("rosen_client_token");
      if (storedToken) {
        setToken(storedToken);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const validateForm = (): string | null => {
    if (!patientName.trim()) {
      return "Please enter the patient's full name.";
    }

    if (patientName.trim().length < 2) {
      return "Please enter a valid name.";
    }

    // DOB validation (if provided)
    if (dateOfBirth) {
      const parsed = parseDateInput(dateOfBirth);
      if (!parsed) {
        return "Please enter a valid date of birth (MM/DD/YYYY).";
      }

      const today = new Date();
      const age = today.getFullYear() - parsed.date.getFullYear();

      if (age < 18) {
        return "Patient must be at least 18 years old.";
      }

      if (age > 120) {
        return "Please enter a valid date of birth.";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/new-case`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token!,
        },
        body: JSON.stringify({
          patient_name: patientName.trim(),
          date_of_birth: dateOfBirth ? parseDateInput(dateOfBirth)?.iso : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create case. Please try again.");
      }

      // Store new case ID and token, then redirect to upload
      if (data.data?.case_id) {
        localStorage.setItem("rosen_case_id", data.data.case_id);
        localStorage.setItem("caseflow_active_case_id", data.data.case_id);
      }
      if (data.data?.token) {
        localStorage.setItem("rosen_client_token", data.data.token);
      }

      router.push("/c/upload");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while validating token
  if (isValidating) {
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

  return (
    <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto px-4 py-12">
          {/* Back link - goes to /c/status to return to case list */}
          {hasExistingCases && (
            <div className="mb-6">
              <button
                onClick={() => router.push("/c/status")}
                className="text-sm text-[#1a5f7a] hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Return to Cases
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#2c8a6e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2c8a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Patient</h1>
              <p className="text-gray-600">
                Start a new case for another patient
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Name */}
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent text-lg"
                  required
                  autoFocus
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter the name as it appears on medical records
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="text"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={handleDateChange}
                  maxLength={10}
                  placeholder="MM/DD/YYYY"
                  className="w-full sm:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent text-lg"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Required for medical record matching and age verification
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !patientName.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#2c8a6e] text-white rounded-lg font-semibold hover:bg-[#247a5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Case...
                  </>
                ) : (
                  <>
                    Continue to Upload Records
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              You will not be charged unless the case qualifies.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
