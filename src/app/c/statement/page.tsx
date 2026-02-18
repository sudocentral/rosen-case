"use client";

/**
 * Client Statement Page
 * Collects Client Statement (their story)
 * Statement is sent to GPT 5.2 for processing
 *
 * DOB is collected on /c/new-patient page now, not here.
 * We still fetch existing DOB from API to preserve it on submission.
 *
 * Draft Caching (P0 UX Safety):
 * - Saves statement to localStorage on every change
 * - Restores instantly on page load (before API responds)
 * - Shows "Restored your saved draft" notification if restored
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";
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

// Draft cache helpers - now only tracks statement (DOB collected elsewhere)
interface DraftData {
  dob: string;       // Keep for backwards compat with existing drafts
  statement: string;
  updatedAt: number;
}

function getDraftKey(token: string): string {
  return `intakeDraft:${token}`;
}

function loadDraft(token: string): DraftData | null {
  try {
    const key = getDraftKey(token);
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const data = JSON.parse(stored) as DraftData;
    // Validate structure
    if (typeof data.statement === "string") {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function saveDraft(token: string, statement: string): void {
  try {
    const key = getDraftKey(token);
    const data: DraftData = {
      dob: "",  // No longer tracked here
      statement,
      updatedAt: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore localStorage errors (quota exceeded, etc.)
  }
}

/**
 * Normalize DOB from various formats to YYYY-MM-DD for API submission
 * API returns ISO timestamp like "1985-06-15T04:00:00.000Z"
 * API expects "1985-06-15"
 */
function normalizeDob(value: string | null | undefined): string {
  if (!value) return "";
  // If it's already YYYY-MM-DD format (10 chars, no T), return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  // If it's an ISO timestamp, extract the date portion
  if (value.includes("T")) {
    return value.split("T")[0];
  }
  // Try to parse and format
  try {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      // Use UTC to avoid timezone issues
      return date.toISOString().split("T")[0];
    }
  } catch {
    // Fall through
  }
  return value;
}

export default function StatementPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [existingDob, setExistingDob] = useState("");  // Fetched from API, not shown to user
  const [statement, setStatement] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [draftRestored, setDraftRestored] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  const MIN_STATEMENT_LENGTH = 100;
  const MAX_STATEMENT_LENGTH = 10000;

  // Save draft whenever statement changes
  const updateDraft = useCallback((newStatement: string) => {
    if (token) {
      saveDraft(token, newStatement);
    }
  }, [token]);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("rosen_client_token") : null;
    if (!storedToken) {
      router.push("/welcome");
      return;
    }
    setToken(storedToken);

    // STEP 1: Instantly restore statement from localStorage (before API)
    const draft = loadDraft(storedToken);
    let restoredFromDraft = false;
    let localStatement = "";

    if (draft && draft.statement) {
      localStatement = draft.statement;
      setStatement(localStatement);
      setCharCount(localStatement.length);
      restoredFromDraft = true;
    }

    // STEP 2: Fetch from API (source of truth) and merge
    async function fetchApiData() {
      try {
        const response = await fetch(`${API_URL}/status`, {
          headers: { "x-intake-token": storedToken! },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Fetch existing DOB to preserve it on submission
            const apiDob = normalizeDob(data.data.date_of_birth);
            if (apiDob) {
              setExistingDob(apiDob);
            }

            const apiStatement = data.data.client_statement || "";

            // Track what we actually update for localStorage sync
            let finalStatement = localStatement;

            // API is source of truth - but only overwrite if API has data
            if (apiStatement) {
              setStatement(apiStatement);
              setCharCount(apiStatement.length);
              finalStatement = apiStatement;
            }

            // If API had statement data, update localStorage to match
            if (apiStatement) {
              saveDraft(storedToken!, finalStatement);
              // Don't show "restored" if API had the data
              restoredFromDraft = false;
            }
          }
        }
      } catch {
        // API failed - keep localStorage values
      } finally {
        setIsLoadingApi(false);
        // Only show "restored" notification if we restored from localStorage
        // and API didn't have the data
        if (restoredFromDraft) {
          setDraftRestored(true);
          // Auto-hide after 5 seconds
          setTimeout(() => setDraftRestored(false), 5000);
        }
      }
    }

    fetchApiData();
  }, [router]);

  const isEditMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("edit") === "1";

  const handleStatementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_STATEMENT_LENGTH) {
      setStatement(value);
      setCharCount(value.length);
      updateDraft(value);
    }
  };

  const validateForm = (): string | null => {
    if (!statement.trim()) {
      return "Please provide your statement describing your condition.";
    }

    if (statement.trim().length < MIN_STATEMENT_LENGTH) {
      return `Your statement should be at least ${MIN_STATEMENT_LENGTH} characters. Please provide more detail about your condition and how it affects you.`;
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
      const response = await fetch(`${API_URL}/statement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token!,
        },
        body: JSON.stringify({
          // DOB is now fetched from case record on backend
          client_statement: statement.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save your statement");
      }

      // Update localStorage to match what was saved
      if (token) {
        saveDraft(token, statement.trim());
      }

      // Trigger Sherlock processing in background (fire-and-forget, silent)
      // This ensures records are processed even if user abandons at card step
      fetch(`${API_URL}/upload/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token!,
        },
      }).catch(() => {
        // Silent fail - don't block user flow
      });

      // Continue to card authorization (or back to status in edit mode)
      window.location.href = isEditMode ? "/c/status" : "/c/verification";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
      <MinimalHeader />
      <main className="min-h-screen bg-gray-50">
        <section className="section-padding">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <IntakeStepper currentStep="statement" />

            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tell Us Your Story</h1>
              <p className="text-gray-600">
                Help our medical team understand your situation by describing your condition in your own words.
              </p>
            </div>

            {/* Draft restored notification */}
            {draftRestored && (
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium">Restored your saved draft</p>
                    <p className="text-blue-700 text-sm">Your previous work has been restored. Continue where you left off.</p>
                  </div>
                  <button
                    onClick={() => setDraftRestored(false)}
                    className="ml-auto text-blue-400 hover:text-blue-600"
                    aria-label="Dismiss"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6">
                <Alert type="error" title="Error">{error}</Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Client Statement */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <label htmlFor="statement" className="block text-lg font-semibold text-gray-900 mb-2">
                  Your Statement
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  In your own words, describe your medical condition, how it affects your daily life,
                  and any connection to your service (if applicable). Be as detailed as possible.
                </p>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">Tips for a Strong Statement:</h4>
                  <ul className="text-sm text-blue-800 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Describe when your symptoms started and what caused them</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Explain how your condition limits your daily activities or work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Mention any treatments you&apos;ve tried and their effectiveness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>For VA claims: describe the in-service event or exposure that caused your condition</span>
                    </li>
                  </ul>
                </div>

                <textarea
                  id="statement"
                  value={statement}
                  onChange={handleStatementChange}
                  rows={10}
                  placeholder="Example: I served in the Army from 2005-2009 and was deployed to Iraq twice. During my second deployment, I was involved in multiple IED explosions. Since then, I have experienced constant ringing in my ears (tinnitus) and difficulty hearing conversations, especially in noisy environments. I also have frequent headaches and difficulty sleeping due to the ringing. This has affected my ability to work in customer service jobs and has strained my relationships..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent resize-none"
                  required
                />

                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${charCount < MIN_STATEMENT_LENGTH ? "text-amber-600" : "text-gray-500"}`}>
                    {charCount < MIN_STATEMENT_LENGTH
                      ? `Minimum ${MIN_STATEMENT_LENGTH} characters (${MIN_STATEMENT_LENGTH - charCount} more needed)`
                      : `${charCount.toLocaleString()} characters`
                    }
                  </span>
                  <span className="text-sm text-gray-400">
                    Max {MAX_STATEMENT_LENGTH.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Privacy notice */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Your privacy is protected.</strong> Your statement will only be used by our medical team
                      to evaluate your case and prepare your letter. We never share your personal information with third parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1a5f7a] text-white rounded-lg font-semibold hover:bg-[#134a5f] transition-colors min-h-[56px] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    {isEditMode ? "Save Updated Story" : "Continue to Verification"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm">
                You will not be charged unless your case qualifies.
              </p>
            </form>
          </div>
        </section>
      </main>
  </>
  );
}
