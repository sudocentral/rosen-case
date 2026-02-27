import Link from "next/link";
import Image from "next/image";

const START_URL = "/start?service=general";
const PORTAL_URL = "/c/status";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="container mx-auto px-6 pt-14 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/brand/logo.png"
                alt="Rosen Experts"
                width={180}
                height={36}
                
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Licensed physicians providing expert medical opinions for VA disability, SSDI, insurance appeals, and more. Free medical records review available.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/services/va-disability/" className="hover:text-white transition-colors">VA Disability & Medical Opinions</Link></li>
              <li><Link href="/services/ssdi/" className="hover:text-white transition-colors">SSDI Claims</Link></li>
              <li><Link href="/services/insurance-denial/" className="hover:text-white transition-colors">Insurance Denials</Link></li>
              <li><Link href="/services/medical-malpractice/" className="hover:text-white transition-colors">Medical Malpractice</Link></li>
              <li><Link href="/services/second-opinion/" className="hover:text-white transition-colors">Second Opinions</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/how-it-works/" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing/" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/samples/" className="hover:text-white transition-colors">Sample Letters</Link></li>
              <li><Link href="/faq/" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact/" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href={PORTAL_URL} className="hover:text-white transition-colors">Client Portal</a></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-white font-semibold mb-4">Ready to Get Started?</h4>
            <p className="text-gray-400 text-sm mb-4">
              Submit your medical records for a free review. Same-day determination, no obligation.
            </p>
            <Link
              href={START_URL}
              className="inline-flex items-center gap-2 bg-[#1a5f7a] hover:bg-[#134a5f] text-white px-5 py-3 rounded-lg font-medium transition-colors min-h-[48px]"
            >
              Start Free Review
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Rosen Experts. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy/" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms/" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          
          {/* Legal Disclaimer */}
          <p className="text-gray-600 text-xs mt-6 max-w-4xl">
            Rosen Experts provides medical review and opinion services only. We do not provide legal advice or medical treatment. Outcomes depend on many factors and are not guaranteed. All decisions regarding VA claims, SSDI applications, insurance appeals, and legal matters are made by the respective agencies, insurers, or courts.
          </p>
        </div>
      </div>
    </footer>
  );
}
