import { AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";

type CalloutVariant = "info" | "success" | "warning" | "note";

interface CalloutProps {
  children: React.ReactNode;
  variant?: CalloutVariant;
  title?: string;
  className?: string;
}

const variantConfig = {
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: Info,
    iconColor: "text-blue-500",
    titleColor: "text-blue-800",
  },
  success: {
    bg: "bg-[#e8f5f0] border-[#2c8a6e]/20",
    icon: CheckCircle,
    iconColor: "text-[#2c8a6e]",
    titleColor: "text-[#1e6b55]",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    titleColor: "text-amber-800",
  },
  note: {
    bg: "bg-gray-50 border-gray-200",
    icon: AlertCircle,
    iconColor: "text-gray-500",
    titleColor: "text-gray-800",
  },
};

export function Callout({ children, variant = "info", title, className = "" }: CalloutProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border rounded-lg p-4 ${className}`.trim()}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          {title && (
            <h4 className={`font-semibold ${config.titleColor} mb-1`}>{title}</h4>
          )}
          <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
