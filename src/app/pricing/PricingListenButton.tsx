"use client";

import { PageListenButton } from "@/ui/ListenButton";

// Curated script summarizing pricing page - not reading headings verbatim
const pricingScript = `
Here's how our pricing works.

Step one is completely free. You submit your medical records, and our physician-led team reviews them at no cost. You'll receive a same-day determination telling you whether your case qualifies for a supporting opinion.

We verify your card with a temporary one dollar authorization to prevent abuse. This automatically falls off within a few days. You're never charged unless your case qualifies and you choose to proceed.

Step two is the physician opinion letter, which starts at one thousand dollars. This includes a comprehensive review by a licensed physician, a detailed opinion letter tailored to your case, proper medical-legal language, the physician's credentials and signature, and secure digital delivery.

Standard delivery takes up to seven business days. If you need it faster, expedited delivery is available for an additional four hundred dollars, with delivery in 48 to 72 hours.

We cover all qualifying conditions within the scope of your engagement. There are no hidden fees. The price quoted after your free review is the price you pay.

Financing options may be available during checkout if you're eligible.

Ready to get started? Submit your records for a free review and find out if your case qualifies.
`.trim();

export default function PricingListenButton() {
  return (
    <PageListenButton
      pageText={pricingScript}
      className="mt-2"
    />
  );
}
