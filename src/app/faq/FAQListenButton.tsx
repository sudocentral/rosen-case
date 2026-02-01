"use client";

import { PageListenButton } from "@/ui/ListenButton";

const faqScript = `
Here are answers to the most common questions about our services.

Is the review really free? Yes. We review your medical records at no cost. You only pay if you qualify and a physician authors a letter for your case.

How does the card authorization work? We verify your card with a temporary one dollar authorization to prevent abuse. This automatically falls off within a few days. You're never charged unless your case qualifies and you choose to proceed.

How long does the determination take? Most determinations arrive the same day, often within hours. Complex cases may take up to one business day.

Who reviews my records? Your documentation goes through comprehensive analysis by our medical team, with final review and determination by a licensed physician.

What if I don't qualify? If your case doesn't qualify, you owe nothing. We'll explain why and, where possible, suggest what might strengthen your case in the future.

How much does a physician opinion letter cost? Pricing starts at one thousand dollars. Standard delivery is up to seven business days. Expedited delivery of 48 to 72 hours is available for four hundred dollars.

Is my information secure? All uploads are encrypted and handled in compliance with HIPAA regulations.

Can I get a refund? We do not offer refunds once work has begun, but we include revisions for factual corrections at no additional charge.

Have more questions? Visit the contact page or browse all FAQ topics on this page.
`.trim();

export default function FAQListenButton() {
  return (
    <PageListenButton
      pageText={faqScript}
      className="mb-4"
    />
  );
}
