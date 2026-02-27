"use client";

import { PageListenButton } from "@/ui/ListenButton";

const homeScript = `
Welcome to Rosen Experts. I'm here to tell you about who we are and how we can help.

We provide physician-authored medical opinions for veterans, disability applicants, and anyone facing a medical-legal challenge. Whether it's a VA physician-authored medical opinion, SSDI documentation, an insurance denial appeal, or a second opinion, our licensed physicians review your records and provide the evidence you need.

What makes us different? We start with a free medical records review. You submit your documentation, our physician-led team analyzes it, and you get a same-day determination about whether your case qualifies. No upfront payment. No commitment. Just the truth about where you stand.

If your case qualifies, a licensed physician authors your medical opinion letter, structured to meet the standards of VA raters, SSA examiners, judges, and insurance reviewers. If it doesn't qualify, you owe nothing.

We've reviewed over 2,500 cases. Our physicians are MDs and DOs with relevant specialty expertise. Standard delivery is up to seven business days, with expedited options available.

You've been through enough. Let us help you get the answers you deserve.
`.trim();

export default function HomeListenButton() {
  return (
    <PageListenButton
      pageText={homeScript}
      className="mb-4"
    />
  );
}
