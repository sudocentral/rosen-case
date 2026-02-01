import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import SSDIListenButton from "./SSDIListenButton";

export const metadata: Metadata = {
  title: "SSDI Medical Opinion Letters | Free Records Review | Rosen Experts",
  description: "Get a medical opinion letter for your SSDI claim from a licensed physician. Free medical records review. Documentation of functional limitations for Social Security.",
};

const START_URL = "/start?service=ssdi";

export default function SSDIPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <SSDIListenButton />
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-white/60 text-sm">
                  <li><Link href="/services/" className="hover:text-white">Services</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">SSDI Claims</li>
                </ol>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Medical Evidence for Your SSDI Claim
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                The Social Security Administration requires medical evidence proving you cannot work due to your condition. Our physicians review your records and, if appropriate, provide detailed medical opinions supporting your claim.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={START_URL} className="btn-white text-lg">
                  Start Free Medical Records Review
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/how-it-works/" className="btn-outline-white text-lg">
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What SSA Looks For */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What the SSA Looks For
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To approve your SSDI claim, the Social Security Administration must see medical evidence demonstrating:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">You have a medically determinable impairment</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Your condition prevents you from performing substantial gainful activity</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Your disability is expected to last at least 12 months or result in death</span>
                </li>
              </ul>
              <div className="card bg-[#e8f4f8] border-[#1a5f7a]/20">
                <h3 className="font-semibold text-gray-900 mb-2">The Gap</h3>
                <p className="text-gray-700">
                  Many claims are denied not because the applicant isn't disabled, but because the medical records don't clearly document how the condition limits their ability to work. A physician opinion letter can bridge that gap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                SSDI Medical Opinion Letters
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A detailed letter from a licensed physician documenting:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Your diagnosis and medical history</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">How your condition affects your functional capacity</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Why you cannot perform your past work</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Why you cannot adjust to other work</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">The expected duration of your impairment</span>
                </li>
              </ul>
              
              <h3 className="font-semibold text-gray-900 mb-3">When This Helps</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card">
                  <p className="text-gray-700 text-sm">Initial SSDI applications lacking clear physician statements</p>
                </div>
                <div className="card">
                  <p className="text-gray-700 text-sm">Reconsideration requests after initial denial</p>
                </div>
                <div className="card">
                  <p className="text-gray-700 text-sm">Appeals before an Administrative Law Judge (ALJ)</p>
                </div>
                <div className="card">
                  <p className="text-gray-700 text-sm">Cases where treating physician notes are sparse or unclear</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works for SSDI Claims</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">1</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Your Records (Free)</h3>
                    <p className="text-gray-600">Upload your medical records, treatment history, and any denial letters. Our team reviews them at no cost.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">2</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Your Determination (Same Day)</h3>
                    <p className="text-gray-600">We'll tell you whether your medical evidence supports an opinion letter and what it would address.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">3</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Physician Review & Letter (If Qualified)</h3>
                    <p className="text-gray-600">A licensed physician reviews your complete file and authors a letter tailored to SSA requirements.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">4</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Delivery</h3>
                    <p className="text-gray-600">Download your letter through your client portal. Include it with your application or appeal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your SSDI Medical Opinion Letter</h2>
              
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Contents</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Physician review of all submitted medical documentation
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Clear statement of diagnosis and prognosis
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Functional capacity assessment (sitting, standing, lifting, concentrating, etc.)
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Explanation of work limitations in SSA-relevant terms
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Duration of impairment statement
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Physician credentials and signature
                  </li>
                </ul>
                <p className="text-sm text-gray-500 border-t border-gray-200 pt-4">
                  <strong>Format:</strong> Structured to align with SSA's Residual Functional Capacity (RFC) evaluation criteria.
                </p>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Will this guarantee my SSDI claim is approved?</h3>
                  <p className="text-gray-600">No. The SSA makes all final decisions. A medical opinion letter provides additional evidence for their consideration, but does not guarantee approval.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">I already have a doctor. Why do I need another letter?</h3>
                  <p className="text-gray-600">Treating physicians often provide diagnosis and treatment notes but may not document functional limitations in the specific terms the SSA requires. Our letters are structured specifically for disability adjudication.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Can you help if I've already been denied?</h3>
                  <p className="text-gray-600">Yes. Many clients come to us during the reconsideration or appeal process. A strong medical opinion letter can be submitted as new evidence.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Do you conduct physical examinations?</h3>
                  <p className="text-gray-600">No. Our physicians provide medical opinions based on review of your existing medical records. If an examination is required, you would need to obtain that separately.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Is the free review really free?</h3>
                  <p className="text-gray-600">Yes. There is no charge for the initial review and determination. Payment is only required if you qualify with a letter.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Find Out If Your Case Qualifies
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your medical records today. Our team will review them at no cost and determine whether a physician opinion letter can support your SSDI claim.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={START_URL} className="btn-white text-lg">
                Start Free Medical Records Review
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
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
