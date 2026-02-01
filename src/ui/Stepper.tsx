import { CheckCircle } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  badge?: string;
  isHighlighted?: boolean;
  isFree?: boolean;
}

interface StepperProps {
  steps: Step[];
  className?: string;
  variant?: "vertical" | "horizontal";
}

export function Stepper({ steps, className = "", variant = "vertical" }: StepperProps) {
  if (variant === "horizontal") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${steps.length} gap-6 ${className}`.trim()}>
        {steps.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`.trim()}>
      {steps.map((step) => (
        <div key={step.number} className="flex gap-4 items-start">
          <StepNumber number={step.number} isHighlighted={step.isHighlighted} />
          <div className={`card flex-1 ${step.isHighlighted ? "border-2 border-[#2c8a6e]" : ""}`}>
            {step.badge && (
              <span className="inline-block bg-[#e8f5f0] text-[#2c8a6e] text-xs font-bold px-3 py-1 rounded-full mb-3">
                {step.badge}
              </span>
            )}
            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
            {step.isFree && (
              <p className="text-xs text-[#2c8a6e] font-medium mt-3">FREE</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepCard({ step }: { step: Step }) {
  const cardClass = step.isHighlighted
    ? "card-determination text-center"
    : "card card-hover text-center";

  return (
    <div className={cardClass}>
      {step.badge && (
        <span className={`inline-block ${step.isHighlighted ? "determination-badge" : "bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full"} mb-4`}>
          {step.badge}
        </span>
      )}
      <StepNumber
        number={step.number}
        isHighlighted={step.isHighlighted}
        className="mx-auto mb-4"
      />
      <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${step.isHighlighted ? "font-bold" : ""}`}>
        {step.title}
      </h3>
      <p className={`${step.isHighlighted ? "text-gray-700 font-medium" : "text-gray-600"} text-sm leading-relaxed`}>
        {step.description}
      </p>
      {step.isFree && (
        <p className={`text-xs ${step.isHighlighted ? "text-[#2c8a6e] font-bold" : "text-gray-400 font-medium"} mt-4`}>
          {step.isHighlighted ? "FREE - SAME DAY" : "FREE"}
        </p>
      )}
    </div>
  );
}

interface StepNumberProps {
  number: number;
  isHighlighted?: boolean;
  className?: string;
}

export function StepNumber({ number, isHighlighted = false, className = "" }: StepNumberProps) {
  const classes = isHighlighted
    ? "step-number-accent"
    : "step-number";

  return (
    <div className={`${classes} ${className}`.trim()}>
      {number}
    </div>
  );
}

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  details?: React.ReactNode;
  badge?: string;
  isHighlighted?: boolean;
}

export function ProcessStep({ number, title, description, details, badge, isHighlighted }: ProcessStepProps) {
  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
      <StepNumber number={number} isHighlighted={isHighlighted} />
      <div className={`card ${isHighlighted ? "border-2 border-[#2c8a6e]" : ""}`}>
        {badge && (
          <span className="inline-block bg-[#e8f5f0] text-[#2c8a6e] text-xs font-bold px-3 py-1 rounded-full mb-4">
            {badge}
          </span>
        )}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {details}
      </div>
    </div>
  );
}
