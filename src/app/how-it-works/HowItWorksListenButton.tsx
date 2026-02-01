"use client";

import { PageListenButton } from "@/ui/ListenButton";

const howItWorksScript = `
Let me walk you through exactly how our process works.

Step one: You submit your medical records through our secure portal. This takes about five to ten minutes. Upload service records, treatment notes, diagnostic imaging, prior decisions, or any documentation that supports your case. Everything is encrypted and HIPAA compliant.

Step two: Our team conducts a free expert review. Your documentation goes through comprehensive analysis with physician oversight. We identify relevant conditions, evaluate the strength of your evidence, and determine whether a supporting opinion is appropriate. This step costs you nothing.

Step three: You receive your determination. This is the key step. You get a clear answer: does your case qualify for a supporting medical opinion? Most determinations arrive the same day, often within hours. If yes, your card is charged and a physician begins authoring your letter. If no, we explain why and suggest what might strengthen your case in the future. Either way, there's no pressure.

Step four: If you qualified, a licensed physician reviews your complete file and authors a comprehensive medical opinion letter tailored to your case. Standard delivery is up to seven business days. Expedited delivery of 48 to 72 hours is available for four hundred dollars. Payment is only collected after you qualify, with no hidden fees.

Ready to get started? Submit your records for a free review.
`.trim();

export default function HowItWorksListenButton() {
  return (
    <PageListenButton
      pageText={howItWorksScript}
      className="mb-4"
    />
  );
}
