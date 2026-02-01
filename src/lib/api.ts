/**
 * API Client with Telemetry
 * Wraps fetch with correlation ID and page path headers
 * Reports errors for 401/403 and 5xx responses
 */

import { getTelemetryHeaders, reportApiError, getCorrelationId, getPagePath } from './telemetry';

// Default API base URL
const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.sudomanaged.com/api/rosen';

export interface ApiOptions extends Omit<RequestInit, 'body'> {
  /** Base URL override (default: NEXT_PUBLIC_API_URL) */
  baseUrl?: string;
  /** Request body (will be JSON.stringify'd if object) */
  body?: unknown;
  /** Skip telemetry headers (for external APIs) */
  skipTelemetry?: boolean;
  /** Don't report errors to telemetry */
  skipErrorReport?: boolean;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}

/**
 * Extract path from URL for telemetry
 */
function extractPath(url: string): string {
  try {
    const parsed = new URL(url, 'https://api.sudomanaged.com');
    return parsed.pathname;
  } catch {
    return url;
  }
}

/**
 * Make an API request with telemetry
 */
export async function api<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    baseUrl = DEFAULT_API_BASE,
    body,
    skipTelemetry = false,
    skipErrorReport = false,
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  // Build URL
  const isFullUrl = endpoint.startsWith('http');
  const url = isFullUrl
    ? endpoint
    : baseUrl + (endpoint.startsWith('/') ? '' : '/') + endpoint;

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  // Add telemetry headers unless explicitly skipped
  if (!skipTelemetry) {
    Object.assign(headers, getTelemetryHeaders());
  }

  // Build request body
  const requestBody = body !== undefined
    ? (typeof body === 'string' ? body : JSON.stringify(body))
    : undefined;

  const method = fetchOptions.method || 'GET';

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      method,
      headers,
      body: requestBody,
    });

    let data: T | null = null;
    let errorMessage: string | undefined;

    // Try to parse response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const json = await response.json();
        if (response.ok) {
          data = json as T;
        } else {
          errorMessage = json.error || json.message || 'HTTP ' + response.status;
        }
      } catch {
        errorMessage = 'Failed to parse JSON response';
      }
    } else if (!response.ok) {
      errorMessage = 'HTTP ' + response.status;
    }

    // Report errors for 401/403 and 5xx
    if (!skipErrorReport && (response.status === 401 || response.status === 403 || response.status >= 500)) {
      reportApiError(method, extractPath(url), response.status, errorMessage);
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: errorMessage,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Network error';

    // Report network errors as 0 status
    if (!skipErrorReport) {
      reportApiError(method, extractPath(url), 0, errorMessage);
    }

    return {
      ok: false,
      status: 0,
      data: null,
      error: errorMessage,
    };
  }
}

/**
 * Convenience methods
 */
export function apiGet<T>(endpoint: string, options?: ApiOptions) {
  return api<T>(endpoint, { ...options, method: 'GET' });
}

export function apiPost<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
  return api<T>(endpoint, { ...options, method: 'POST', body });
}

export function apiPut<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
  return api<T>(endpoint, { ...options, method: 'PUT', body });
}

export function apiPatch<T>(endpoint: string, body?: unknown, options?: ApiOptions) {
  return api<T>(endpoint, { ...options, method: 'PATCH', body });
}

export function apiDelete<T>(endpoint: string, options?: ApiOptions) {
  return api<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Legacy fetch wrapper - adds telemetry to existing fetch calls
 * Use this for gradual migration of existing code
 */
export async function fetchWithTelemetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const telemetryHeaders = getTelemetryHeaders();
  const headers = new Headers(options.headers);

  // Add telemetry headers
  headers.set('x-correlation-id', telemetryHeaders['x-correlation-id']);
  headers.set('x-page-path', telemetryHeaders['x-page-path']);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Report errors
  const method = options.method || 'GET';
  if (response.status === 401 || response.status === 403 || response.status >= 500) {
    reportApiError(method, extractPath(url), response.status);
  }

  return response;
}

/**
 * Export telemetry utilities for custom use
 */
export { getCorrelationId, getPagePath, getTelemetryHeaders } from './telemetry';
