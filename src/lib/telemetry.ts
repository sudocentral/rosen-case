/**
 * Frontend Telemetry Module
 * Provides correlation IDs, page tagging, and error reporting
 *
 * C-1: Correlation + page tagging
 * C-2: Client error reporter
 */

// Correlation ID - generated once per page session
let correlationId: string | null = null;

/**
 * Generate a unique correlation ID (UUID v4 format)
 */
function generateCorrelationId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or create correlation ID for current page session
 */
export function getCorrelationId(): string {
  if (!correlationId) {
    correlationId = generateCorrelationId();
  }
  return correlationId;
}

/**
 * Reset correlation ID (call on page navigation in SPA)
 */
export function resetCorrelationId(): void {
  correlationId = generateCorrelationId();
}

/**
 * Get current page path (pathname only, no query string)
 * Returns 'SYSTEM' for non-user contexts (SSR, cron, background jobs)
 */
export function getPagePath(): string {
  if (typeof window !== 'undefined' && window.location?.pathname) {
    return window.location.pathname;
  }
  return 'SYSTEM'; // Non-browser context (SSR, cron, background jobs)
}

/**
 * Get telemetry headers for API requests
 */
export function getTelemetryHeaders(): Record<string, string> {
  return {
    'x-correlation-id': getCorrelationId(),
    'x-page-path': getPagePath(),
  };
}

// Telemetry endpoint
const TELEMETRY_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/telemetry/client-error`
  : 'https://api.sudomanaged.com/api/rosen/telemetry/client-error';

type ErrorEvent = 'api_error' | 'js_error' | 'unhandled_rejection';

interface TelemetryPayload {
  cid: string;
  page_path: string;
  event: ErrorEvent;
  route?: string;
  status?: number;
  message?: string;
  stack?: string;
  timestamp: string;
  user_agent?: string;
}

/**
 * Report an error to telemetry endpoint
 */
export async function reportError(
  event: ErrorEvent,
  details: {
    route?: string;
    status?: number;
    message?: string;
    stack?: string;
  }
): Promise<void> {
  const payload: TelemetryPayload = {
    cid: getCorrelationId(),
    page_path: getPagePath(),
    event,
    timestamp: new Date().toISOString(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    ...details,
  };

  try {
    // Use sendBeacon if available (survives page unload)
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(TELEMETRY_URL, JSON.stringify(payload));
    } else {
      // Fallback to fetch with keepalive
      await fetch(TELEMETRY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch (e) {
    // Silently fail - don't cause more errors from error reporting
    console.error('[telemetry] Failed to report error:', e);
  }
}

/**
 * Report API error (401/403 or >=500)
 */
export function reportApiError(
  method: string,
  path: string,
  status: number,
  message?: string
): void {
  if (status === 401 || status === 403 || status >= 500) {
    reportError('api_error', {
      route: `${method} ${path}`,
      status,
      message,
    });
  }
}

/**
 * Initialize global error handlers
 * Call this once in your app's root layout or _app
 */
export function initErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  // Handle uncaught JavaScript errors
  window.onerror = (message, source, lineno, colno, error) => {
    reportError('js_error', {
      message: String(message),
      stack: error?.stack || `${source}:${lineno}:${colno}`,
    });
    return false; // Don't prevent default handling
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    reportError('unhandled_rejection', {
      message: reason?.message || String(reason),
      stack: reason?.stack,
    });
  });
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  // Defer initialization to avoid blocking
  setTimeout(initErrorHandlers, 0);
}

// ============================================================
// C-4: UI Assertion Framework
// ============================================================

// Assertion endpoint
const ASSERTION_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/telemetry/client-assertion-failed`
  : 'https://api.sudomanaged.com/api/rosen/telemetry/client-assertion-failed';

/**
 * Context codes for assertion failures
 * Use these to categorize what type of UI element is missing
 */
export type AssertionContextCode =
  | 'MISSING_BUTTON'
  | 'MISSING_PANEL'
  | 'MISSING_CARD'
  | 'MISSING_FORM'
  | 'MISSING_DATA'
  | 'EMPTY_DATA'
  | 'WRONG_STATE'
  | 'LOAD_FAILED';

interface AssertionPayload {
  cid: string;
  page_path: string;
  assertion_id: string;
  context_code?: AssertionContextCode;
  timestamp: string;
}

// Track which assertions have already failed this session (prevent spam)
const failedAssertions = new Set<string>();

/**
 * Assert that a UI element or condition is visible/present
 *
 * Call this AFTER data has loaded and session is ready.
 * If ok === false, reports to telemetry and triggers email alert.
 *
 * @param page_path - Page where assertion runs (defaults to current path)
 * @param assertion_id - Unique identifier like "OPS_CASE_OVERRIDE_BUTTON_PRESENT"
 * @param ok - Whether the assertion passed (true = visible, false = missing)
 * @param context_code - Optional context about what's missing
 *
 * @example
 * // After case data loads, check if override buttons are present
 * assertVisible({
 *   assertion_id: 'OPS_CASE_OVERRIDE_BUTTON_PRESENT',
 *   ok: showQAActions && caseData?.status === 'qa_review',
 *   context_code: 'MISSING_BUTTON'
 * });
 */
export function assertVisible({
  page_path,
  assertion_id,
  ok,
  context_code,
}: {
  page_path?: string;
  assertion_id: string;
  ok: boolean;
  context_code?: AssertionContextCode;
}): void {
  // If assertion passes, nothing to do
  if (ok) return;

  // If running on server, skip
  if (typeof window === 'undefined') return;

  const pagePath = page_path || getPagePath();
  const assertionKey = `${pagePath}:${assertion_id}`;

  // Don't spam - only report once per session per assertion
  if (failedAssertions.has(assertionKey)) return;
  failedAssertions.add(assertionKey);

  const payload: AssertionPayload = {
    cid: getCorrelationId(),
    page_path: pagePath,
    assertion_id,
    context_code,
    timestamp: new Date().toISOString(),
  };

  console.warn(`[assertion] FAILED: ${assertion_id} on ${pagePath}`, context_code || '');

  // Report asynchronously
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(ASSERTION_URL, JSON.stringify(payload));
    } else {
      fetch(ASSERTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silently fail
  }
}

/**
 * Reset failed assertions (call on page navigation)
 */
export function resetAssertions(): void {
  failedAssertions.clear();
}

/**
 * Run multiple assertions at once
 *
 * @example
 * runAssertions([
 *   { assertion_id: 'OPS_CASE_OVERRIDE_BUTTON_PRESENT', ok: showOverride, context_code: 'MISSING_BUTTON' },
 *   { assertion_id: 'OPS_CASE_DECISION_CARD_PRESENT', ok: !!caseData?.ai_decision, context_code: 'MISSING_CARD' },
 * ]);
 */
export function runAssertions(
  assertions: Array<{
    assertion_id: string;
    ok: boolean;
    context_code?: AssertionContextCode;
  }>
): void {
  const pagePath = getPagePath();
  for (const assertion of assertions) {
    assertVisible({
      page_path: pagePath,
      ...assertion,
    });
  }
}
