"use client";

import { PageListenButton } from "@/ui/ListenButton";

const insuranceDenialScript = `
Your insurance claim was denied. What now?

Insurance companies employ their own medical reviewers to evaluate claims. These reviewers may not have access to your complete medical history and often apply narrow interpretations. An independent physician opinion provides additional medical perspective for your appeal.

We help with health insurance denials, disability insurance denials, life insurance denials, and long-term care insurance denials. Common denial reasons include claims that treatment isn't medically necessary, pre-existing condition exclusions, insufficient documentation, or that your condition doesn't meet policy definitions.

Here's what we provide. A licensed physician reviews your medical records and the denial letter. They author a detailed opinion documenting your diagnosis, why the treatment or claim is medically necessary, how your condition meets policy definitions, and where the insurer's review was incorrect or incomplete.

The letter is structured to directly address the insurer's stated reasons for denial and is suitable for formal appeals or litigation if needed.

Submit your denial letter and medical records through our secure portal. We review them at no cost. Most determinations arrive the same day. If you qualify, the physician-authored opinion is delivered within seven business days, or 48 to 72 hours with expedited service for four hundred dollars.

Ready to explore your options? Start your free review.
`.trim();

export default function InsuranceDenialListenButton() {
  return (
    <PageListenButton
      pageText={insuranceDenialScript}
      className="mb-4"
    />
  );
}
