"use client";

import { PageListenButton } from "@/ui/ListenButton";

const ssdiScript = `
Applying for Social Security Disability? The SSA requires medical evidence proving you cannot work due to your condition. That's where we can help.

The Social Security Administration denies many claims not because applicants aren't disabled, but because their medical records don't clearly document how their condition limits their ability to work. A physician opinion letter can bridge that gap.

Our physicians review your medical records and document your diagnosis, how your condition affects your functional capacity, why you cannot perform your past work, why you cannot adjust to other work, and the expected duration of your impairment.

This is structured to align with the SSA's Residual Functional Capacity evaluation criteria, addressing exactly what the examiner needs to see.

Here's the process. Submit your medical records and any denial letters through our secure portal. We review them at no cost. Most determinations arrive the same day.

If you qualify, a licensed physician authors a detailed letter tailored to SSA requirements. Standard delivery takes up to seven business days. Expedited delivery is 48 to 72 hours for four hundred dollars.

Whether you're filing an initial application, requesting reconsideration, or appealing before an Administrative Law Judge, a strong medical opinion letter can provide the documented evidence you need.

Ready to see if your case qualifies? Start your free review today.
`.trim();

export default function SSDIListenButton() {
  return (
    <PageListenButton
      pageText={ssdiScript}
      className="mb-4"
    />
  );
}
