"use client";

/**
 * Client Portal Header
 * Shows logo + CaseSwitcher dropdown for multi-case users
 */

import { useEffect, useState } from "react";
import CaseSwitcher from "./CaseSwitcher";

const CASES_API_URL = "https://api.sudomanaged.com/api/rosen/public/client/cases";

interface CaseInfo {
  case_id: string;
  patient_name: string;
  requestor_name: string;
  status: string;
  ai_decision: string | null;
  claim_type: string | null;
  patient_name_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

interface ClientPortalHeaderProps {
  currentCaseId?: string;
  patientName?: string;
  showSwitcher?: boolean;
}

export default function ClientPortalHeader({ 
  currentCaseId, 
  patientName,
  showSwitcher = true 
}: ClientPortalHeaderProps) {
  const [cases, setCases] = useState<CaseInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!showSwitcher) {
      setLoading(false);
      return;
    }

    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("rosen_client_token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(CASES_API_URL, {
          headers: { "x-intake-token": token },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.cases) {
            setCases(data.data.cases);
          }
        }
      } catch (err) {
        console.error("Failed to fetch cases for header:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [showSwitcher]);

  const hasMultipleCases = cases.length > 1;

  // Center logo when no switcher is shown
  const showRightContent = showSwitcher && !loading && hasMultipleCases;

  return (
    <header className="bg-white border-b border-gray-100">
      <div className={`max-w-4xl mx-auto px-4 py-4 flex items-center ${showRightContent ? "justify-between" : "justify-center"}`}>
        <a href="https://rosenexperts.com" className="flex items-center">
          <img
            src="/brand/logo.png"
            alt="Rosen Experts"
            className="h-10 w-auto"
          />
        </a>

        {/* Case Switcher - only show for multi-case users */}
        {showRightContent && (
          <CaseSwitcher
            cases={cases}
            currentCaseId={currentCaseId || ""}
            currentPatientName={patientName || ""}
          />
        )}
      </div>
    </header>
  );
}
