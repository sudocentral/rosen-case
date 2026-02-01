"use client";

import { useState, useEffect, useCallback } from "react";

const ACTIVE_CASE_KEY = "caseflow_active_case_id";

export interface CaseInfo {
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

export function useActiveCase() {
  const [activeCaseId, setActiveCaseIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(ACTIVE_CASE_KEY);
      setActiveCaseIdState(stored);
      setIsLoading(false);
    }
  }, []);

  // Set active case
  const setActiveCaseId = useCallback((caseId: string | null) => {
    if (typeof window !== "undefined") {
      if (caseId) {
        localStorage.setItem(ACTIVE_CASE_KEY, caseId);
      } else {
        localStorage.removeItem(ACTIVE_CASE_KEY);
      }
      setActiveCaseIdState(caseId);
    }
  }, []);

  // Clear active case
  const clearActiveCase = useCallback(() => {
    setActiveCaseId(null);
  }, [setActiveCaseId]);

  // Get case ID from token (fallback)
  const getCaseIdFromToken = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("rosen_client_token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.cid || null;
    } catch {
      return null;
    }
  }, []);

  // Get effective case ID (localStorage > token)
  const getEffectiveCaseId = useCallback((): string | null => {
    return activeCaseId || getCaseIdFromToken();
  }, [activeCaseId, getCaseIdFromToken]);

  return {
    activeCaseId,
    setActiveCaseId,
    clearActiveCase,
    getCaseIdFromToken,
    getEffectiveCaseId,
    isLoading,
  };
}

// Utility to get active case ID outside of React components
export function getStoredActiveCaseId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CASE_KEY);
}

// Utility to set active case ID outside of React components
export function setStoredActiveCaseId(caseId: string | null): void {
  if (typeof window === "undefined") return;
  if (caseId) {
    localStorage.setItem(ACTIVE_CASE_KEY, caseId);
  } else {
    localStorage.removeItem(ACTIVE_CASE_KEY);
  }
}
