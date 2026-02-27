"use client";

import { PageListenButton } from "@/ui/ListenButton";

const startScript = `
Welcome. You're about to start your free medical records review.

Here's how it works. You'll securely upload your medical records through our encrypted portal. This usually takes five to ten minutes. Once submitted, our physician-led team reviews your documentation and provides a quick determination about whether your case qualifies for a supporting medical opinion.

If your case qualifies, a licensed physician will author your medical opinion letter. If it does not qualify, you owe nothing, and we'll clearly explain why.

All information submitted through this portal is encrypted and handled securely in full compliance with the Health Insurance Portability and Accountability Act.

If you're a Veterans Service Officer or a law firm submitting records for clients, you can use your own email address. When more than one case is submitted under the same email, the system automatically switches to multi-patient mode, making it easy to manage multiple clients from one dashboard.

Take your time completing the form. The more complete your submission, the more accurate our determination will be.

When you're ready, complete the form and submit your records to begin your free review.
`.trim();

export default function StartListenButton() {
  return (
    <PageListenButton
      pageText={startScript}
      className=""
    />
  );
}
