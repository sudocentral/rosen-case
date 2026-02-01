"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Analytics Component - Phase D
 *
 * Loads GA4, Meta Pixel, and Reddit Pixel asynchronously.
 * - All scripts load with strategy="afterInteractive" (non-blocking)
 * - Respects consent defaults
 * - Tracks page views and custom events
 *
 * Events tracked:
 * - free_review_start: User starts free review
 * - qualification_result: AI/QA qualification decision
 * - payment_initiate: User clicks pay button
 * - payment_complete: Payment successful
 */

// Analytics IDs - replace with actual values
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-XXXXXXXXXX";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "XXXXXXXXXX";
const REDDIT_PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID || "t2_xxxxxx";

// Declare global types for analytics
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
    rdt: (...args: unknown[]) => void;
  }
}

// Custom event tracking functions
export const trackEvent = {
  /**
   * Track free review start
   */
  freeReviewStart: (source?: string) => {
    if (typeof window === "undefined") return;

    // GA4
    window.gtag?.("event", "free_review_start", {
      event_category: "conversion",
      event_label: source || "unknown",
    });

    // Meta Pixel
    window.fbq?.("track", "Lead", {
      content_name: "Free Medical Records Review",
      content_category: "free_review",
    });

    // Reddit
    window.rdt?.("track", "Lead");
  },

  /**
   * Track qualification result
   */
  qualificationResult: (decision: string, caseType?: string) => {
    if (typeof window === "undefined") return;

    // GA4
    window.gtag?.("event", "qualification_result", {
      event_category: "funnel",
      event_label: decision,
      case_type: caseType,
    });

    // Meta Pixel - only track qualified as potential conversion
    if (decision === "QUALIFIES") {
      window.fbq?.("track", "CompleteRegistration", {
        content_name: "Case Qualified",
        status: true,
      });
    }

    // Reddit
    window.rdt?.("track", "Custom", { customEventName: "Qualification" });
  },

  /**
   * Track payment initiation
   */
  paymentInitiate: (amountCents: number, caseType?: string) => {
    if (typeof window === "undefined") return;

    const amountDollars = amountCents / 100;

    // GA4
    window.gtag?.("event", "begin_checkout", {
      currency: "USD",
      value: amountDollars,
      items: [
        {
          item_name: "Physician Opinion Letter",
          item_category: caseType || "letter",
          price: amountDollars,
          quantity: 1,
        },
      ],
    });

    // Meta Pixel
    window.fbq?.("track", "InitiateCheckout", {
      currency: "USD",
      value: amountDollars,
      content_type: "product",
      content_ids: [caseType || "letter"],
    });

    // Reddit
    window.rdt?.("track", "AddToCart", {
      currency: "USD",
      value: amountDollars,
    });
  },

  /**
   * Track payment completion
   */
  paymentComplete: (amountCents: number, caseType?: string, transactionId?: string) => {
    if (typeof window === "undefined") return;

    const amountDollars = amountCents / 100;

    // GA4
    window.gtag?.("event", "purchase", {
      transaction_id: transactionId,
      currency: "USD",
      value: amountDollars,
      items: [
        {
          item_name: "Physician Opinion Letter",
          item_category: caseType || "letter",
          price: amountDollars,
          quantity: 1,
        },
      ],
    });

    // Meta Pixel
    window.fbq?.("track", "Purchase", {
      currency: "USD",
      value: amountDollars,
      content_type: "product",
      content_ids: [caseType || "letter"],
    });

    // Reddit
    window.rdt?.("track", "Purchase", {
      currency: "USD",
      value: amountDollars,
      transactionId,
    });
  },

  /**
   * Track page view (called automatically by component)
   */
  pageView: (url: string) => {
    if (typeof window === "undefined") return;

    // GA4 - handled automatically by gtag config
    window.gtag?.("config", GA4_MEASUREMENT_ID, {
      page_path: url,
    });

    // Meta Pixel
    window.fbq?.("track", "PageView");

    // Reddit
    window.rdt?.("track", "PageVisit");
  },
};

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route change
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackEvent.pageView(url);
  }, [pathname, searchParams]);

  // Don't render scripts if IDs not configured
  const hasGA4 = GA4_MEASUREMENT_ID && !GA4_MEASUREMENT_ID.includes("XXXX");
  const hasMeta = META_PIXEL_ID && !META_PIXEL_ID.includes("XXXX");
  const hasReddit = REDDIT_PIXEL_ID && !REDDIT_PIXEL_ID.includes("xxxx");

  return (
    <>
      {/* Google Analytics 4 */}
      {hasGA4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {hasMeta && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Reddit Pixel */}
      {hasReddit && (
        <Script id="reddit-pixel" strategy="afterInteractive">
          {`
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?
            p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};
            p.callQueue=[];var t=d.createElement("script");t.src=
            "https://www.redditstatic.com/ads/pixel.js";t.async=!0;
            var s=d.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(t,s)}}(window,document);
            rdt('init', '${REDDIT_PIXEL_ID}');
            rdt('track', 'PageVisit');
          `}
        </Script>
      )}

      {/* Noscript fallbacks for pixels */}
      {hasMeta && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}
