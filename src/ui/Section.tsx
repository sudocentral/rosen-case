interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gray" | "hero" | "hero-elevated" | "soft";
  id?: string;
}

const variantClasses = {
  default: "section-padding bg-white",
  gray: "section-padding bg-gray-50",
  hero: "gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20",
  "hero-elevated": "gradient-hero-elevated pt-32 pb-24 lg:pt-40 lg:pb-32",
  soft: "section-padding gradient-soft",
};

export function Section({
  children,
  className = "",
  variant = "default",
  id,
}: SectionProps) {
  return (
    <section id={id} className={`${variantClasses[variant]} ${className}`.trim()}>
      {children}
    </section>
  );
}
