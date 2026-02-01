interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "accent" | "subtle" | "dark";
}

const variantClasses = {
  default: "badge",
  success: "badge-success",
  accent: "inline-block bg-[#e8f5f0] text-[#2c8a6e] text-sm font-bold px-4 py-2 rounded-full",
  subtle: "inline-block bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-1 rounded-full",
  dark: "inline-block bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full",
};

export function Badge({ children, className = "", variant = "default" }: BadgeProps) {
  return (
    <span className={`${variantClasses[variant]} ${className}`.trim()}>
      {children}
    </span>
  );
}
