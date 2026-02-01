/**
 * Client API Utilities
 *
 * Single source of truth for intake token handling.
 * All /api/rosen/public/client/* calls MUST use these utilities.
 */

const TOKEN_KEY = "rosen_client_token";

/**
 * Get the intake token from localStorage
 */
export function getIntakeToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set the intake token in localStorage
 */
export function setIntakeToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Clear the intake token from localStorage
 */
export function clearIntakeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Get headers for client API calls
 * ALWAYS includes x-intake-token if available
 */
export function getClientHeaders(options?: {
  includeContentType?: boolean;
  token?: string;
}): Record<string, string> {
  const headers: Record<string, string> = {};

  // Always add Content-Type if requested (default true for POST/PUT)
  if (options?.includeContentType !== false) {
    headers["Content-Type"] = "application/json";
  }

  // Get token - use provided token or fetch from storage
  const token = options?.token ?? getIntakeToken();

  // ALWAYS send x-intake-token if we have one
  if (token) {
    headers["x-intake-token"] = token;
  }

  return headers;
}

/**
 * Fetch wrapper for client API calls
 * Automatically adds x-intake-token header
 */
export async function clientFetch(
  url: string,
  options: RequestInit & { token?: string } = {}
): Promise<Response> {
  const { token, headers: customHeaders, ...fetchOptions } = options;

  const headers = {
    ...getClientHeaders({
      includeContentType: fetchOptions.method !== "GET",
      token
    }),
    ...(customHeaders as Record<string, string>),
  };

  return fetch(url, {
    ...fetchOptions,
    headers,
  });
}
