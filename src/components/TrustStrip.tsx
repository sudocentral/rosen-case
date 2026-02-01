import Link from "next/link";

interface TrustItem {
  icon: React.ReactNode;
  text: string;
}

interface TrustStripProps {
  variant?: "light" | "dark" | "transparent";
  items?: TrustItem[];
  showCTA?: boolean;
}

const defaultItems: TrustItem[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    text: "Licensed Physicians (MD and DO)",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
    text: "Same-Day Determinations",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
    text: "$0 To Start",
  },
];

export default function TrustStrip({ variant = "light", items = defaultItems, showCTA = false }: TrustStripProps) {
  const bgClasses = {
    light: "bg-gray-50 border-y border-gray-100",
    dark: "bg-gray-900 text-white",
    transparent: "bg-transparent",
  };

  const textClasses = {
    light: "text-gray-700",
    dark: "text-gray-200",
    transparent: "text-white/90",
  };

  const iconClasses = {
    light: "text-[#2c8a6e]",
    dark: "text-[#4ade80]",
    transparent: "text-[#4ade80]",
  };

  return (
    <div className={`py-4 ${bgClasses[variant]}`}>
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
          {items.map((item, index) => (
            <div key={index} className={`flex items-center gap-2 ${textClasses[variant]}`}>
              <span className={iconClasses[variant]}>{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
          {showCTA && (
            <Link
              href="/start?service=general"
              className="ml-4 text-sm font-semibold text-[#1a5f7a] hover:text-[#134a5f] underline underline-offset-2"
            >
              Start Free Review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
