"use client";

import { PageListenButton } from "@/ui/ListenButton";

const vaDisabilityScript = `
If you're a veteran seeking service connection for a disability, a nexus letter may be what you need.

A nexus letter is a medical opinion from a licensed physician stating that your current condition is connected to your military service. The key phrase is "at least as likely as not," which aligns with the VA's standard of proof.

You might need a nexus letter if your service records don't clearly document an in-service event, if the VA examiner gave an unfavorable opinion, if you're claiming a secondary condition, or if you're appealing a denied claim.

Here's how it works with us. First, you submit your service treatment records and VA medical records through our secure portal. Our team reviews them at no cost. Most determinations arrive the same day, often within hours.

If you qualify, a licensed physician reviews your complete file and authors a detailed nexus letter. Standard delivery takes up to seven business days. Expedited delivery of 48 to 72 hours is available for four hundred dollars.

We also offer Disability Benefits Questionnaires as an add-on when clinically appropriate.

The free review is truly free. We verify your card with a one dollar authorization that falls off automatically. You're only charged if your case qualifies and you choose to proceed.

Ready to find out if your claim qualifies? Start your free review.
`.trim();

export default function VADisabilityListenButton() {
  return (
    <PageListenButton
      pageText={vaDisabilityScript}
      className="mb-4"
    />
  );
}
