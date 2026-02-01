"use client";

import { PageListenButton } from "@/ui/ListenButton";

const malpracticeScript = `
If you believe medical negligence caused harm to you or a loved one, our licensed physicians can review the records and provide an objective assessment.

A medical malpractice review evaluates whether the healthcare provider deviated from the accepted standard of care, whether that deviation directly caused harm, and whether the medical records support these conclusions.

Before pursuing a malpractice claim, you need to know if the evidence supports one. Attorneys typically require an expert medical opinion before accepting a case. Our review provides that initial assessment.

Here's how it works. Submit your medical records, including records from the provider in question and any subsequent treatment. Our team reviews them at no cost. Most determinations arrive the same day.

If the evidence suggests a potential deviation from the standard of care, a licensed physician with relevant specialty expertise reviews your complete file and provides a detailed written opinion. This opinion documents standard of care, breach, and causation, suitable for use by attorneys or for your own clarity.

Important note: we provide medical review and opinion services. We do not provide legal advice, represent you in proceedings, or guarantee any legal outcome. If your case has merit, we recommend consulting with a qualified medical malpractice attorney.

Ready for an objective assessment? Start your free review.
`.trim();

export default function MalpracticeListenButton() {
  return (
    <PageListenButton
      pageText={malpracticeScript}
      className="mb-4"
    />
  );
}
