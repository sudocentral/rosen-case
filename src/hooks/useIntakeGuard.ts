"use client";

/**
 * useIntakeGuard Hook
 *
 * Canonical intake step guard for magic link navigation.
 * On mount, checks the backend for the correct next step and redirects if needed.
 *
 * Usage:
 *   const { isLoading, isRedirecting } = useIntakeGuard();
 *   if (isLoading || isRedirecting) return <LoadingSpinner />;
 */

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_URL = "https://api.sudomanaged.com/api/rosen/public/client";

interface IntakeProgress {
  current_step: string;
  completed_steps: string[];
  next_step: string;
  reason: string;
}

interface UseIntakeGuardResult {
  isLoading: boolean;
  isRedirecting: boolean;
  progress: IntakeProgress | null;
  error: string | null;
}

export function useIntakeGuard(): UseIntakeGuardResult {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [progress, setProgress] = useState<IntakeProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkStep() {
      // Get token from localStorage or URL
      let token = localStorage.getItem("rosen_client_token");

      // Check URL for token (magic link)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        token = urlToken;
        localStorage.setItem("rosen_client_token", urlToken);
      }

      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/next-step`, {
          headers: {
            "x-intake-token": token,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.code === "TOKEN_EXPIRED") {
            setError("Your link has expired. Please request a new one.");
          } else {
            setError(data.error || "Failed to verify session");
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success && data.data) {
          const { next_step, progress: progressData } = data.data;
          setProgress(progressData);

          // Check if we need to redirect
          // Normalize paths for comparison
          const currentPath = pathname?.replace(/\/$/, "") || "";
          const expectedPath = next_step?.replace(/\/$/, "") || "";

          console.log(`[useIntakeGuard] current=${currentPath} expected=${expectedPath}`);

          if (currentPath !== expectedPath) {
            console.log(`[useIntakeGuard] Redirecting from ${currentPath} to ${expectedPath}`);
            setIsRedirecting(true);

            // Preserve any URL parameters except token
            const params = new URLSearchParams(window.location.search);
            params.delete("token"); // Don't pass token in redirect
            const queryString = params.toString();
            const redirectUrl = queryString ? `${expectedPath}?${queryString}` : expectedPath;

            router.replace(redirectUrl);
            return;
          }
        }
      } catch (err) {
        console.error("[useIntakeGuard] Error:", err);
        setError("Unable to verify your session. Please try again.");
      }

      setIsLoading(false);
    }

    checkStep();
  }, [pathname, router]);

  return { isLoading, isRedirecting, progress, error };
}

export default useIntakeGuard;
