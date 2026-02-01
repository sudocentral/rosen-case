import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import PricingListenButton from "./PricingListenButton";

export const metadata: Metadata = {
  title: "Pricing | Free Medical Review + Physician Opinion Letters | Rosen Experts",
  description: "Free medical records review. Physician opinion letters starting at $1,000. Pay only if qualified. No hidden fees.",
};

const START_URL = "/start/";

export default function PricingPage() {
  const services = [
    { name: "VA Nexus Letter", price: "$1,000", notes: "Covers qualifying conditions from your records. DBQs available as add-on." },
    { name: "SSDI Medical Opinion", price: "$1,000", notes: "Includes functional capacity documentation." },
    { name: "Insurance Denial Opinion", price: "$1,000", notes: "Tailored to denial reason and policy type." },
    { name: "Medical Malpractice Review", price: "$1,000", notes: "Standard of care and causation analysis." },
    { name: "Second Medical Opinion", price: "$1,000", notes: "Diagnosis and treatment plan review." },
    { name: "Expert Medical Record Review", price: "Custom", notes: "Contact us for volume or complex case pricing." },
  ];

  const included = [
    "Complete medical records review",
    "Physician analysis and opinion drafting",
    "Medical-legal formatting appropriate to your case type",
    "Physician credentials and signature",
    "Secure digital delivery",
    "Client portal access for status tracking and downloads",
  ];

  const notCharged = [
    "Initial review and determination",
    "Revisions for factual corrections",
    "Digital delivery",
  ];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Free Review First. Pay Only If You Qualify.
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-6">
                Every case starts with a free medical records review. If your case qualifies, you'll know the exact cost before making any payment.
              </p>
              <PricingListenButton />
            </div>
          </div>
        </section>

        {/* How Pricing Works */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                Two Steps. Complete Transparency.
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Step 1 - Free */}
                <div className="card border-2 border-[#2c8a6e]">
                  <div className="text-center mb-6">
                    <span className="inline-block bg-[#e8f5f0] text-[#2c8a6e] text-sm font-semibold px-4 py-1 rounded-full mb-4">STEP 1</span>
                    <p className="price-free">$0</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2">Free Medical Records Review</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Expert review of your submitted medical records
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Physician-led comprehensive review
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Same-day determination of whether your case qualifies
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Clear explanation of what type of opinion applies
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">
                      Card verified with $1 authorization (automatically falls off). You're only charged if qualified.
                    </p>
                  </div>
                </div>

                {/* Step 2 - Letter */}
                <div className="card">
                  <div className="text-center mb-6">
                    <span className="inline-block bg-gray-100 text-gray-600 text-sm font-semibold px-4 py-1 rounded-full mb-4">STEP 2 (IF QUALIFIED)</span>
                    <p className="text-sm text-gray-500 mb-1">Starting at</p>
                    <p className="price-value">$1,000</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2">Physician Opinion Letter</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Comprehensive review by a licensed physician
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Detailed medical opinion letter tailored to your case type
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Proper medical-legal language for courts, agencies, and insurers
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Physician credentials and signature
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Secure digital delivery
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">
                      Standard: up to 7 business days. Expedited: 48-72 hours for $400.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing by Service */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What to Expect by Case Type</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Service</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Starting Price</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-900 font-medium">{service.name}</td>
                        <td className="py-4 px-4 text-[#1a5f7a] font-semibold">{service.price}</td>
                        <td className="py-4 px-4 text-gray-600 text-sm">{service.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500 mt-6 text-center">
                We evaluate your submitted records and cover qualifying conditions within the scope of the engagement. The price quoted after your free review is the price you pay.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">No Hidden Fees</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Included in Your Price</h3>
                  <ul className="space-y-2">
                    {included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                        <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Not Charged Separately</h3>
                  <ul className="space-y-2">
                    {notCharged.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                        <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Options */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Flexible Payment</h2>

              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Accepted Methods</h3>
                <p className="text-gray-600 mb-6">All major credit cards (Visa, MasterCard, American Express, Discover) and debit cards.</p>

                <h3 className="font-semibold text-gray-900 mb-4">Financing Available</h3>
                <p className="text-gray-600">Payment plans may be available through our checkout process. Options displayed during payment if eligible.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Questions</h2>

              <div className="space-y-6">
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">When do I pay?</h3>
                  <p className="text-gray-600">Only after your free review is complete and you qualify. No payment is collected upfront. We do verify your card with a temporary $1 authorization that automatically falls off.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">What if I submit records but my case doesn't qualify?</h3>
                  <p className="text-gray-600">You pay nothing. The free review is truly free. There is no charge if your case doesn't qualify for a physician opinion.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Does the letter cover multiple conditions?</h3>
                  <p className="text-gray-600">Yes. We evaluate your submitted records and cover all qualifying conditions within the scope of the engagement. The price quoted after your free review is all-inclusive.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Are there any hidden fees?</h3>
                  <p className="text-gray-600">No. The price quoted after your free review is the price you pay. Delivery, standard revisions, and portal access are included.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">How quickly will I receive my letter?</h3>
                  <p className="text-gray-600">Standard delivery is up to 7 business days after payment. Expedited delivery (48-72 hours) is available for $400.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Do you offer discounts for veterans?</h3>
                  <p className="text-gray-600">Our pricing is designed to be accessible. Contact us if you have financial hardship concerns and we'll do what we can to help.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Free Review First */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">You Deserve Answers Before Commitment</h2>
              <p className="text-lg text-gray-600 mb-8">
                Many services charge for consultations or require payment before you know if they can help. We believe that's backwards.
              </p>
              <div className="card text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Our free review ensures:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">You understand your situation before spending anything</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">We only take cases where our physicians can provide genuine value</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Your decision is informed, not pressured</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start with Your Free Review
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your medical records today. You'll receive a same-day determination at no cost. If your case qualifies, you'll know the exact price before payment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={START_URL} className="btn-white text-lg">
                Start Free Medical Records Review
              </Link>
              <Link href="/contact/" className="btn-outline-white text-lg">
                Questions? Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
