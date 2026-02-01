import Link from "next/link";

interface HeroProps {
  preheadline?: string;
  headline: string;
  subheadline?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  badge?: string;
  breadcrumbs?: { label: string; href: string }[];
  variant?: "elevated" | "standard" | "minimal";
}

export default function Hero({
  preheadline,
  headline,
  subheadline,
  primaryButtonText = "Start Free Medical Records Review",
  primaryButtonHref = "/start?service=general",
  secondaryButtonText,
  secondaryButtonHref,
  badge,
  breadcrumbs,
  variant = "standard",
}: HeroProps) {
  const sectionClasses = {
    elevated: "gradient-hero-elevated pt-32 pb-16 lg:pt-40 lg:pb-20",
    standard: "gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20",
    minimal: "bg-gray-50 pt-32 pb-12 lg:pt-40 lg:pb-16",
  };

  const textColorClasses = {
    elevated: "text-white",
    standard: "text-white",
    minimal: "text-gray-900",
  };

  const subTextColorClasses = {
    elevated: "text-white/80",
    standard: "text-white/80",
    minimal: "text-gray-600",
  };

  const breadcrumbColorClasses = {
    elevated: "text-white/60",
    standard: "text-white/60",
    minimal: "text-gray-500",
  };

  return (
    <section className={sectionClasses[variant]}>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className={"flex items-center gap-2 text-sm " + breadcrumbColorClasses[variant]}>
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true">/</span>}
                    {index === breadcrumbs.length - 1 ? (
                      <span className={variant === "minimal" ? "text-gray-900" : "text-white"}>{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:opacity-80">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {preheadline && (
            <p className={"text-lg mb-4 " + subTextColorClasses[variant]}>
              {preheadline}
            </p>
          )}

          <h1 className={"text-4xl md:text-5xl font-bold leading-tight mb-6 " + textColorClasses[variant]}>
            {headline}
          </h1>

          {subheadline && (
            <p className={"text-xl mb-8 leading-relaxed " + subTextColorClasses[variant]}>
              {subheadline}
            </p>
          )}

          {badge && (
            <div className="badge badge-success mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{badge}</span>
            </div>
          )}

          {(primaryButtonText || secondaryButtonText) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryButtonText && (
                <Link
                  href={primaryButtonHref}
                  className={variant === "minimal" ? "btn-primary text-lg" : "btn-white text-lg"}
                >
                  {primaryButtonText}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              {secondaryButtonText && secondaryButtonHref && (
                <Link
                  href={secondaryButtonHref}
                  className={variant === "minimal" ? "btn-outline text-lg" : "btn-outline-white text-lg"}
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
