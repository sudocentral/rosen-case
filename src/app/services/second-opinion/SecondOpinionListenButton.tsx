"use client";

import { PageListenButton } from "@/ui/ListenButton";

const secondOpinionScript = `
Facing a serious diagnosis or an uncertain treatment plan? A second opinion is a responsible step, not a sign of distrust in your doctor.

Our licensed physicians review your medical records, including imaging, lab results, pathology reports, and physician notes, and provide an independent assessment. They evaluate whether your diagnosis is well-supported, whether the recommended treatment is appropriate, whether alternatives should be considered, and whether additional testing may be warranted.

You receive a detailed written opinion you can review with your treating physician, share with family, or keep for your own peace of mind.

Common situations where patients seek second opinions include cancer diagnoses, recommended surgery, chronic condition management, rare or complex conditions, and when different doctors have given conflicting advice.

Studies show that second opinions lead to a change in diagnosis or treatment plan in a significant percentage of cases. Even when the original recommendation is confirmed, patients report greater confidence in their care.

This is not a replacement for your treating physician and it's not emergency medical advice. It's an expert perspective to inform your decisions.

Ready to get clarity before your next step? Submit your records for a free review.
`.trim();

export default function SecondOpinionListenButton() {
  return (
    <PageListenButton
      pageText={secondOpinionScript}
      className="mb-4"
    />
  );
}
