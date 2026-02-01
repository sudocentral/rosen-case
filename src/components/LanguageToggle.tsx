"use client";

import { useLanguage } from "@/i18n/LanguageContext";

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => setLocale("en")}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          locale === "en"
            ? "bg-[#1a5f7a] text-white"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => setLocale("es")}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          locale === "es"
            ? "bg-[#1a5f7a] text-white"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
        aria-label="Cambiar a Espanol"
        aria-pressed={locale === "es"}
      >
        ES
      </button>
    </div>
  );
}
