interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "hover" | "determination" | "service" | "highlighted";
  as?: "div" | "article" | "li";
}

const variantClasses = {
  default: "card",
  hover: "card card-hover",
  determination: "card-determination",
  service: "service-card",
  highlighted: "card border-2 border-[#2c8a6e]",
};

export function Card({
  children,
  className = "",
  variant = "default",
  as: Component = "div",
}: CardProps) {
  return (
    <Component className={`${variantClasses[variant]} ${className}`.trim()}>
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`.trim()}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({ children, className = "", as: Component = "h3" }: CardTitleProps) {
  return (
    <Component className={`text-xl font-semibold text-gray-900 ${className}`.trim()}>
      {children}
    </Component>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`text-gray-600 ${className}`.trim()}>
      {children}
    </div>
  );
}
