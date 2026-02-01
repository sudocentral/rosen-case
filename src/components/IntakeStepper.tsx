"use client";

/**
 * Shared Intake Stepper Component
 * - Shows progress through intake steps
 * - Completed steps are clickable (backwards navigation)
 * - Current and future steps are not clickable
 */

import { useRouter } from "next/navigation";

interface IntakeStepperProps {
  currentStep: "upload" | "statement" | "verification" | "review";
}

const STEPS = [
  { id: "upload", path: "/c/upload", label: "Records", number: 1 },
  { id: "statement", path: "/c/statement", label: "Your Story", number: 2 },
  { id: "verification", path: "/c/verification", label: "Verification", number: 3 },
  { id: "review", path: null, label: "Review", number: 4 },
];

export default function IntakeStepper({ currentStep }: IntakeStepperProps) {
  const router = useRouter();

  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  const handleStepClick = (step: typeof STEPS[0], index: number) => {
    // Only allow clicking completed steps (before current)
    if (index < currentIndex && step.path) {
      router.push(step.path);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isClickable = isCompleted && step.path;

        return (
          <div key={step.id} className="flex items-center">
            {/* Connector line (before step, except first) */}
            {index > 0 && (
              <div
                className={`w-6 sm:w-8 h-0.5 mr-2 ${
                  isCompleted || isCurrent ? "bg-emerald-500" : "bg-gray-300"
                }`}
              />
            )}

            {/* Step circle and label */}
            <button
              onClick={() => handleStepClick(step, index)}
              disabled={!isClickable}
              className={`flex items-center gap-2 ${
                isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
              }`}
              title={isClickable ? `Go back to ${step.label}` : undefined}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-[#1a5f7a] text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isCompleted
                    ? `text-emerald-600 ${isClickable ? "underline" : ""}`
                    : isCurrent
                    ? "text-[#1a5f7a]"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
