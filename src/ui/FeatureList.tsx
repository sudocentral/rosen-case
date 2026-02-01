import { Check } from "lucide-react";

interface FeatureListProps {
  features: string[];
  className?: string;
  iconColor?: string;
}

export function FeatureList({
  features,
  className = "",
  iconColor = "text-[#2c8a6e]"
}: FeatureListProps) {
  return (
    <ul className={`space-y-3 ${className}`.trim()}>
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

interface FeatureGridProps {
  features: { title: string; description: string }[];
  className?: string;
  columns?: 2 | 3;
}

export function FeatureGrid({ features, className = "", columns = 2 }: FeatureGridProps) {
  const gridCols = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-4 ${className}`.trim()}>
      {features.map((feature, index) => (
        <div key={index} className="card">
          <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
