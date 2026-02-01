"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LanguageToggle from "./LanguageToggle";

const START_URL = "/start?service=general";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/how-it-works/", label: "How It Works" },
    { href: "/services/", label: "Services" },
    { href: "/pricing/", label: "Pricing" },
    { href: "/samples/", label: "Samples" },
    { href: "/faq/", label: "FAQ" },
    { href: "/contact/", label: "Contact" },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      role="banner"
    >
      <nav 
        className="container mx-auto"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center"
            aria-label="Rosen Experts - Home"
          >
            <Image
              src="/brand/logo.png"
              alt="Rosen Experts"
              width={200}
              height={40}
              priority
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8" role="navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-[#1a5f7a] font-medium transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button and Language Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageToggle />
            <Link
              href={START_URL}
              className="btn-primary"
            >
              Start Free Review
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 text-gray-600 min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="lg:hidden py-4 border-t border-gray-100"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-gray-600 hover:text-[#1a5f7a] hover:bg-gray-50 rounded-lg font-medium min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 pt-4 flex items-center justify-between gap-4">
                <LanguageToggle />
                <Link
                  href={START_URL}
                  className="btn-primary flex-1 justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Free Review
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
