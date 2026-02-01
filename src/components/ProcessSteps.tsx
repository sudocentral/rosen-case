interface Step {
  number: number;
  title: string;
  description: string;
  cost?: string;
  isDetermination?: boolean;
}

interface ProcessStepsProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
  variant?: "vertical" | "horizontal";
}

const defaultSteps: Step[] = [
  {
    number: 1,
    title: "Upload Your Records",
    description: "Submit your medical records through our secure portal. Takes about 5-10 minutes.",
    cost: "Free",
  },
  {
    number: 2,
    title: "Receive Your Determination",
    description: "Our team reviews your documentation and determines whether your case qualifies for a physician opinion letter. Most determinations delivered same day.",
    cost: "Free",
    isDetermination: true,
  },
  {
    number: 3,
    title: "Qualification and Payment",
    description: "If your case qualifies, payment is charged automatically and physician review begins.",
    cost: "Pricing provided",
  },
  {
    number: 4,
    title: "Receive Your Letter",
    description: "A licensed physician reviews your complete file and authors your opinion letter. Delivered via secure portal within 48-72 hours.",
  },
];

export default function ProcessSteps({
  title = "How It Works",
  subtitle,
  steps = defaultSteps,
  variant = "vertical",
}: ProcessStepsProps) {
  if (variant === "horizontal") {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          {title && (
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
            </div>
          )}
          
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.number}
                className={step.isDetermination ? "card-determination" : "card"}
              >
                {step.isDetermination && (
                  <span className="determination-badge">KEY MOMENT</span>
                )}
                <div className={step.isDetermination ? "step-number-accent mb-4" : "step-number mb-4"}>
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                {step.cost && (
                  <p className="text-sm font-medium text-[#2c8a6e]">Cost: {step.cost}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Vertical variant (default)
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        {title && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}
        
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className={step.isDetermination ? "step-number-accent flex-shrink-0" : "step-number flex-shrink-0"}>
                {step.number}
              </div>
              <div className={step.isDetermination ? "card-determination flex-1" : "card flex-1"}>
                {step.isDetermination && (
                  <span className="determination-badge">KEY MOMENT</span>
                )}
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {step.cost && (
                  <p className="text-sm font-medium text-[#2c8a6e] mt-2">Cost: {step.cost}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
