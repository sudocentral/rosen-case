"use client";

import { useState, useEffect, useCallback } from "react";

interface AccessibilitySettings {
  fontSize: "normal" | "large" | "larger";
  highContrast: boolean;
  reducedMotion: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "normal",
  highContrast: false,
  reducedMotion: false,
};

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("rosen-accessibility");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings(parsed);
      } catch {
        // Invalid JSON, use defaults
      }
    }
    
    // Check system preference for reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches && !saved) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  const applySettings = useCallback((s: AccessibilitySettings) => {
    const html = document.documentElement;
    
    // Font size
    html.classList.remove("font-large", "font-larger");
    if (s.fontSize === "large") html.classList.add("font-large");
    if (s.fontSize === "larger") html.classList.add("font-larger");
    
    // High contrast
    if (s.highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }
    
    // Reduced motion
    if (s.reducedMotion) {
      html.classList.add("reduced-motion");
    } else {
      html.classList.remove("reduced-motion");
    }
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem("rosen-accessibility", JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem("rosen-accessibility");
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 bg-[#1a5f7a] text-white p-3 rounded-full shadow-lg hover:bg-[#134a5f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a5f7a]"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-label="Accessibility Settings"
          className="fixed bottom-20 left-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-80"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Accessibility</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close accessibility panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Size
            </label>
            <div className="flex gap-2">
              {(["normal", "large", "larger"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting("fontSize", size)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    settings.fontSize === size
                      ? "bg-[#1a5f7a] text-white border-[#1a5f7a]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                  aria-pressed={settings.fontSize === size}
                >
                  {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="mb-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">High Contrast</span>
              <button
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => updateSetting("highContrast", !settings.highContrast)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.highContrast ? "bg-[#1a5f7a]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.highContrast ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Reduced Motion */}
          <div className="mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Reduce Motion</span>
              <button
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.reducedMotion ? "bg-[#1a5f7a]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.reducedMotion ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Reset */}
          <button
            onClick={resetSettings}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      )}
    </>
  );
}
