import Link from "next/link";

interface FinalCTAProps {
  headline?: string;
  subheadline?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  variant?: "gradient" | "solid" | "light";
}

export default function FinalCTA({
  headline = "Find Out If Your Case Qualifies",
  subheadline = "Submit your medical records today. Our team will review them at no cost and let you know whether a physician opinion letter is appropriate for your situation.",
  primaryButtonText = "Start Free Medical Records Review",
  primaryButtonHref = "/start?service=general",
  secondaryButtonText = "Questions? Contact Us",
  secondaryButtonHref = "/contact/",
  variant = "gradient",
}: FinalCTAProps) {
  const sectionClasses = {
    gradient: "gradient-hero",
    solid: "bg-[#1a5f7a]",
    light: "bg-gray-50",
  };

  const textClasses = {
    gradient: "text-white",
    solid: "text-white",
    light: "text-gray-900",
  };

  const subTextClasses = {
    gradient: "text-white/80",
    solid: "text-white/80",
    light: "text-gray-600",
  };

  const primaryBtnClasses = {
    gradient: "btn-white",
    solid: "btn-white",
    light: "btn-primary",
  };

  const secondaryBtnClasses = {
    gradient: "btn-outline-white",
    solid: "btn-outline-white",
    light: "btn-outline",
  };

  return (
    <section className={`${sectionClasses[variant]} section-padding`}>
      <div className="container mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-bold ${textClasses[variant]} mb-6`}>
          {headline}
        </h2>
        <p className={`text-xl ${subTextClasses[variant]} mb-8 max-w-2xl mx-auto`}>
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={primaryButtonHref} className={`${primaryBtnClasses[variant]} text-lg`}>
            {primaryButtonText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          {secondaryButtonText && (
            <Link href={secondaryButtonHref} className={`${secondaryBtnClasses[variant]} text-lg`}>
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
