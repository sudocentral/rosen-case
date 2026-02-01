import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  priceNote?: string;
  description?: string;
  features: string[];
  isHighlighted?: boolean;
  badge?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function PricingCard({
  title,
  price,
  priceNote,
  description,
  features,
  isHighlighted = false,
  badge,
  footer,
  className = "",
}: PricingCardProps) {
  const cardClass = isHighlighted
    ? "card border-2 border-[#2c8a6e]"
    : "card";

  const priceClass = isHighlighted ? "price-free" : "price-value";

  return (
    <div className={`${cardClass} ${className}`.trim()}>
      <div className="text-center mb-6">
        {badge && (
          <span className={`inline-block ${isHighlighted ? "bg-[#e8f5f0] text-[#2c8a6e]" : "bg-gray-100 text-gray-600"} text-sm font-semibold px-4 py-1 rounded-full mb-4`}>
            {badge}
          </span>
        )}
        {priceNote && (
          <p className="text-sm text-gray-500 mb-1">{priceNote}</p>
        )}
        <p className={priceClass}>{price}</p>
        <h3 className="text-xl font-semibold text-gray-900 mt-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        )}
      </div>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-600">
            <Check className={`w-5 h-5 ${isHighlighted ? "text-[#2c8a6e]" : "text-[#1a5f7a]"} mt-0.5 flex-shrink-0`} />
            {feature}
          </li>
        ))}
      </ul>

      {footer && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}
