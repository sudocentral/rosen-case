"use client";

import { PageListenButton } from "@/ui/ListenButton";

const startScript = `
Welcome. You're about to start your free medical records review.

Here's what happens. You'll upload your medical records through our secure portal. This takes about five to ten minutes. Our physician-led team will review your documentation and provide a same-day determination about whether your case qualifies for a supporting medical opinion.

If you qualify, a licensed physician authors your medical opinion letter. If you don't qualify, you owe nothing and we'll explain why.

The form on this page asks for your contact information, details about your case, and your medical records upload. All information is encrypted and handled in compliance with HIPAA.

Take your time filling out the form. The more complete your submission, the more accurate our determination.

Ready to find out if your case qualifies? Complete the form and submit your records.
`.trim();

export default function StartListenButton() {
  return (
    <PageListenButton
      pageText={startScript}
      className=""
    />
  );
}
