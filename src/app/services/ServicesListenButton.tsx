"use client";

import { PageListenButton } from "@/ui/ListenButton";

const servicesScript = `
We provide physician-authored medical opinions for a variety of case types. Every service begins with a free medical records review.

For veterans, we offer VA disability and nexus letters. These medical nexus letters establish the connection between your current condition and military service. We also provide Disability Benefits Questionnaires.

For Social Security disability, we provide SSDI claims support. Our physicians document how your condition meets the SSA's definition of disability and limits your ability to work.

If your insurance claim was denied, we can help with insurance denial appeals. An independent medical opinion from a licensed physician can provide the evidence needed for reconsideration or litigation.

For potential medical malpractice cases, our physicians evaluate whether the standard of care was breached and document their findings for legal use.

We also provide second medical opinions for patients seeking confirmation or an alternative perspective on their diagnosis or treatment plan.

What sets us apart? Every opinion is authored by a licensed physician with relevant expertise. Our documentation is structured to meet court and agency requirements. And you always start with a free review so you know if your case qualifies before paying anything.

Not sure which service you need? Start with our free review and we'll guide you.
`.trim();

export default function ServicesListenButton() {
  return (
    <PageListenButton
      pageText={servicesScript}
      className="mb-4"
    />
  );
}
