"use client";

/**
 * CaseSwitcher Component
 * 
 * Header dropdown for switching between cases.
 * Can work standalone (fetches own data) or accept cases as props.
 */

import { useEffect, useState, useRef } from "react";

const API_URL = "https://api.sudomanaged.com/api/rosen/public/client/cases";

interface CaseInfo {
  case_id: string;
  patient_name: string | null;
  requestor_name: string | null;
  status: string;
  ai_decision: string | null;
  claim_type?: string | null;
}

interface CaseSwitcherProps {
  // Optional: pass cases directly to avoid refetching
  cases?: CaseInfo[];
  currentCaseId?: string;
  currentPatientName?: string;
  onCaseChange?: (caseId: string) => void;
}

function getStatusDot(status: string): string {
  if (["delivered", "final_pdf_ready", "letter_ready"].includes(status)) return "bg-green-500";
  if (["collect_letter_fee", "paid_letter_fee"].includes(status)) return "bg-orange-500";
  if (["intake_in_progress", "ai_review", "qa_review"].includes(status)) return "bg-yellow-500";
  return "bg-blue-500";
}

export default function CaseSwitcher({ 
  cases: propCases,
  currentCaseId: propCaseId,
  currentPatientName,
  onCaseChange 
}: CaseSwitcherProps) {
  const [cases, setCases] = useState<CaseInfo[]>(propCases || []);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(propCaseId || null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(!propCases);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // If cases are passed as props, use them directly
  useEffect(() => {
    if (propCases) {
      setCases(propCases);
      setLoading(false);
    }
  }, [propCases]);

  useEffect(() => {
    if (propCaseId) {
      setActiveCaseId(propCaseId);
    }
  }, [propCaseId]);

  // Fetch cases only if not provided as props
  useEffect(() => {
    if (propCases) return;

    async function loadCases() {
      const token = localStorage.getItem("rosen_client_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          headers: { "x-intake-token": token }
        });

        if (response.ok) {
          const data = await response.json();
          // Fixed: API returns data.data.cases not data.cases
          if (data.success && data.data?.cases) {
            setCases(data.data.cases);
            
            // Get or set active case
            let activeId: string | null = localStorage.getItem("caseflow_active_case_id");
            if (!activeId && data.data.cases.length > 0) {
              activeId = data.data.cases[0].case_id;
              localStorage.setItem("caseflow_active_case_id", activeId!);
            }
            setActiveCaseId(activeId);
          }
        }
      } catch (err) {
        console.error("Failed to load cases for switcher:", err);
      }
      setLoading(false);
    }

    loadCases();
  }, [propCases]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchCase(caseId: string) {
    localStorage.setItem("caseflow_active_case_id", caseId);
    setActiveCaseId(caseId);
    setIsOpen(false);
    if (onCaseChange) {
      onCaseChange(caseId);
    } else {
      // Reload the page to refresh with new case context
      window.location.reload();
    }
  }

  // Only show if there are multiple cases
  if (loading || cases.length <= 1) {
    return null;
  }

  const activeCase = cases.find(c => c.case_id === activeCaseId);
  const otherCases = cases.filter(c => c.case_id !== activeCaseId);
  const displayName = currentPatientName || activeCase?.patient_name || activeCase?.requestor_name || "Select Case";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
      >
        <span className={"w-2 h-2 rounded-full " + (activeCase ? getStatusDot(activeCase.status) : "bg-gray-400")}></span>
        <span className="font-medium text-gray-700 max-w-[150px] truncate">{displayName}</span>
        <svg
          className={"w-4 h-4 text-gray-500 transition-transform " + (isOpen ? "rotate-180" : "")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 font-medium uppercase">Switch Case</p>
          </div>
          
          {otherCases.map((c) => (
            <button
              key={c.case_id}
              onClick={() => switchCase(c.case_id)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <span className={"w-2 h-2 rounded-full " + getStatusDot(c.status)}></span>
              <span className="text-sm text-gray-700 truncate">
                {c.patient_name || c.requestor_name || "Unknown"}
              </span>
            </button>
          ))}

          <div className="border-t border-gray-100 mt-1 pt-1">
            <a
              href="/c/status"
              className="block px-3 py-2 text-sm text-[#1a5f7a] hover:bg-gray-50"
            >
              View All Cases
            </a>
            <a
              href="/start"
              className="block px-3 py-2 text-sm text-[#1a5f7a] hover:bg-gray-50"
            >
              + Start New Case
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
