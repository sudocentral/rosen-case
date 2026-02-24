"use client";

/**
 * Client Intake Layout
 *
 * Wraps all /c/* pages with:
 * 1. Canonical intake step validation (redirects to required_step)
 * 2. Patient name banner (C1 requirement)
 * 3. Step locking based on backend response (C2 requirement)
 * 4. Resume behavior - always fetch state, never trust local (C3 requirement)
 * 5. Empty files check - force to upload if no files (C4 requirement)
 * 6. Backwards navigation allowed to completed steps
 */

import { useEffect, useState, ReactNode, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_URL = "https://api.sudomanaged.com/api/rosen/public/client";

// Pages that should NOT use the intake guard (post-intake pages)
// These pages have their own auth/navigation logic
const EXEMPT_PAGES = [
  "/c/portal",
  "/c/letter",
  "/c/verify",
  "/c/payment",
  "/c/payment/success",
  "/c/determination",
  "/c/delivery",
  "/c/status",
  "/c/new-patient",
];

// Step order for determining backwards navigation
const STEP_ORDER = ["/c/upload", "/c/statement", "/c/verification", "/c/card"];

// Intake context for sharing state across pages
interface IntakeContextType {
  patientName: string | null;
  setPatientName: (name: string | null) => void;
  caseId: string | null;
  currentStep: string | null;
  isLoading: boolean;
  fileCount: number;
}

const IntakeContext = createContext<IntakeContextType>({
  patientName: null,
  setPatientName: () => {},
  caseId: null,
  currentStep: null,
  isLoading: true,
  fileCount: 0,
});

export function useIntakeContext() {
  return useContext(IntakeContext);
}

interface IntakeLayoutProps {
  children: ReactNode;
}

export default function IntakeLayout({ children }: IntakeLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [guardError, setGuardError] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    // Skip guard for exempt pages
    const currentPath = pathname?.replace(/\/$/, "") || "";
    if (EXEMPT_PAGES.some(p => currentPath.startsWith(p))) {
      setIsChecking(false);
      return;
    }

    async function checkIntakeStep() {
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);

      // Get token from URL first (magic link), then localStorage
      // C3: Always fetch state on magic link load
      let token = urlParams.get("token");
      if (token) {
        // Magic link - store token and always fetch fresh state
        localStorage.setItem("rosen_client_token", token);
      } else {
        token = localStorage.getItem("rosen_client_token");
      }

      if (!token) {
        // No token - redirect to /welcome
        router.replace("/welcome");
        return;
      }

      try {
        // Fetch next-step, status, and files in parallel
        const [stepResponse, statusResponse, filesResponse] = await Promise.all([
          fetch(`${API_URL}/next-step`, {
            headers: { "x-intake-token": token },
          }),
          fetch(`${API_URL}/status`, {
            headers: { "x-intake-token": token },
          }),
          fetch(`${API_URL}/files`, {
            headers: { "x-intake-token": token },
          }),
        ]);

        // Handle next-step response
        if (!stepResponse.ok) {
          const data = await stepResponse.json();
          if (data.code === "TOKEN_EXPIRED") {
            setGuardError("Your link has expired. Please request a new one.");
            return;
          }
          setIsChecking(false);
          return;
        }

        const stepData = await stepResponse.json();

        // Handle status response - get patient name (C1)
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          if (statusData.success && statusData.data) {
            setPatientName(statusData.data.patient_name || null);
            setCustomerName(statusData.data.customer_name || null);
            setCaseId(statusData.data.case_id || null);
          }
        }

        // Handle files response - check for empty files (C4)
        let uploadedFileCount = 0;
        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          if (filesData.success && filesData.data) {
            const files = filesData.data.files || [];
            uploadedFileCount = files.filter((f: { status: string }) =>
              f.status === "uploaded" || f.status === "pending"
            ).length;
            setFileCount(uploadedFileCount);
          }
        }

        if (stepData.success && stepData.data) {
          const { next_step } = stepData.data;
          // Handle /c/card -> /c/verification rename
          const expectedPath = (next_step === "/c/card" ? "/c/verification" : next_step)?.replace(/\/$/, "") || "";
          setCurrentStep(expectedPath);

          console.log(`[IntakeLayout] current=${currentPath} expected=${expectedPath} files=${uploadedFileCount}`);

          // C4: Force to upload if no files and not already on upload page
          if (uploadedFileCount === 0 && currentPath !== "/c/upload") {
            console.log("[IntakeLayout] No files - forcing to /c/upload");
            router.replace("/c/upload");
            return;
          }

          // Skip redirect if edit=1 AND we're on upload or statement page
          if (urlParams.get("edit") === "1" && currentPath === "/c/upload") {
            console.log("[IntakeLayout] edit=1 detected on upload, allowing");
            setIsChecking(false);
            return;
          }

          if (urlParams.get("edit") === "1" && currentPath === "/c/statement") {
            console.log("[IntakeLayout] edit=1 detected on statement, allowing");
            setIsChecking(false);
            return;
          }

          // Determine step indices for navigation check
          const currentStepIndex = STEP_ORDER.findIndex(s => currentPath === s || currentPath === s.replace("/c/card", "/c/verification"));
          const expectedStepIndex = STEP_ORDER.findIndex(s => expectedPath === s || expectedPath === s.replace("/c/card", "/c/verification"));

          // Allow backwards navigation (current step index < expected step index)
          // Block forward navigation (current step index > expected step index)
          if (currentStepIndex >= 0 && expectedStepIndex >= 0) {
            if (currentStepIndex <= expectedStepIndex) {
              // User is on current or previous step - allow
              console.log("[IntakeLayout] Allowing backwards/current navigation");
              setIsChecking(false);
              return;
            }
          }

          // C2 & C3: Redirect to required step if trying to skip forward
          if (currentPath !== expectedPath) {
            console.log(`[IntakeLayout] Redirecting from ${currentPath} to ${expectedPath}`);
            router.replace(expectedPath);
            return;
          }
        }
      } catch (err) {
        console.error("[IntakeLayout] Error checking step:", err);
      }

      setIsChecking(false);
    }

    checkIntakeStep();
  }, [pathname, router]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a5f7a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if token expired
  if (guardError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Link Expired</h2>
          <p className="text-gray-600 mb-6">{guardError}</p>
          <a
            href="/welcome"
            className="inline-block bg-[#1a5f7a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#164d63] transition-colors"
          >
            Request New Access Link
          </a>
        </div>
      </div>
    );
  }

  // Check if current path is exempt (don't show banner on post-intake pages)
  const currentPath = pathname?.replace(/\/$/, "") || "";
  const isExemptPage = EXEMPT_PAGES.some(p => currentPath.startsWith(p));

  return (
    <IntakeContext.Provider value={{ patientName, setPatientName, caseId, currentStep, isLoading: isChecking, fileCount }}>
      {/* C1: Patient Name Banner - show on all intake pages */}
      {!isExemptPage && (
        <div className="bg-[#1a5f7a] text-white py-2 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">
              Patient: {patientName || customerName || "(not set)"}
            </span>
          </div>
        </div>
      )}
      {children}
    </IntakeContext.Provider>
  );
}
