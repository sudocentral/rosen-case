import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import VADisabilityListenButton from "./VADisabilityListenButton";

export const metadata: Metadata = {
  title: "Physician-Authored Medical Opinions | Free Medical Records Review | Rosen Experts",
  description: "Get a physician-authored medical opinion from a licensed physician for your VA disability claim. Free medical records review. Service connection documentation for veterans.",
};

const START_URL = "/start?service=va";

export default function VADisabilityPage() {
  const whenNeeded = [
    "Your service records don't clearly document an in-service injury or illness",
    "The VA's C&P examiner provided an unfavorable opinion",
    "You're filing a claim for a secondary condition",
    "You're appealing a denied claim",
    "You need to establish continuity of symptoms since service",
  ];

  const letterIncludes = [
    "Review of all submitted medical records",
    "Physician analysis of service connection likelihood",
    "Detailed rationale citing medical literature where applicable",
    'Proper medical-legal language ("at least as likely as not")',
    "Physician credentials and signature",
  ];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <VADisabilityListenButton />
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-white/60 text-sm">
                  <li><Link href="/services/" className="hover:text-white">Services</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">VA Disability & Medical Opinions</li>
                </ol>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Physician-Authored Medical Opinions for Veterans
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                A physician-authored medical opinion connects your current condition to your military service. Our licensed physicians review your records and, if appropriate, provide the documented medical opinion the VA requires.
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

        {/* What Is a Physician-Authored Medical Opinion */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Understanding the Medical Opinion
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A physician-authored medical opinion is a written medical opinion from a licensed physician stating that your current condition is "at least as likely as not" connected to your military service. This language aligns with the VA's standard of proof and can be the deciding factor in your claim.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Establishes Service Connection</h3>
                  <p className="text-gray-600 text-sm">Links your condition directly to your time in service</p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Written by a Credentialed Physician</h3>
                  <p className="text-gray-600 text-sm">Not a claims agent. A licensed medical professional.</p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Addresses VA Requirements</h3>
                  <p className="text-gray-600 text-sm">Structured for the specific criteria the VA evaluates</p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Supplements Your Records</h3>
                  <p className="text-gray-600 text-sm">Adds physician analysis to your existing medical evidence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* When Do You Need One */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Is a Physician-Authored Medical Opinion Right for Your Claim?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A physician-authored medical opinion may be necessary when:
              </p>
              <ul className="space-y-3 mb-8">
                {whenNeeded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="card bg-[#e8f5f0] border-[#2c8a6e]/20">
                <p className="text-gray-700">
                  <strong>Note:</strong> Not every claim requires a physician-authored medical opinion. Our free review will determine whether one is appropriate for your situation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Provide */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">VA Disability Services</h2>
              
              <div className="space-y-8">
                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Physician-Authored Medical Opinions</h3>
                  <p className="text-gray-600 mb-4">
                    A comprehensive medical opinion letter establishing the connection between your current condition and military service.
                  </p>
                  <h4 className="font-semibold text-gray-900 mb-2">What's Included:</h4>
                  <ul className="space-y-2 mb-4">
                    {letterIncludes.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500">
                    <strong>Delivery:</strong> Standard: up to 7 business days. Expedited (48-72 hours): $400.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Disability Benefits Questionnaires (DBQs)</h3>
                  <p className="text-gray-600 mb-4">
                    The VA's standardized medical forms used to document the severity and impact of specific conditions.
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>When You Need One:</strong> DBQs are often required for rating increases or when the VA's C&P exam was incomplete or inaccurate.
                  </p>
                  <p className="text-sm text-gray-500">
                    DBQs are available as an add-on to medical opinion orders where clinically appropriate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works for VA Claims</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">1</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Your Records (Free)</h3>
                    <p className="text-gray-600">Upload your service treatment records, VA medical records, and any prior decisions. Our team reviews them at no cost.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">2</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Your Determination</h3>
                    <p className="text-gray-600">Most determinations within hours; complex cases may take up to one business day. We'll tell you whether a physician-authored medical opinion is appropriate for your claim.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">3</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Physician Review & Letter (If Qualified)</h3>
                    <p className="text-gray-600">A licensed physician reviews your complete file and authors a detailed physician-authored medical opinion tailored to your claim. Standard: up to 7 business days. Expedited (48-72 hours): $400.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">4</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Delivery</h3>
                    <p className="text-gray-600">Download your completed letter through your secure client portal. Submit it directly to the VA with your claim.</p>
                  </div>
                </div>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Will a physician-authored medical opinion guarantee my claim is approved?</h3>
                  <p className="text-gray-600">No. The VA makes all final decisions. A physician-authored medical opinion provides independent medical evidence that the VA is required to consider, but it does not guarantee any outcome.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Do you accept cases where the C&P exam was unfavorable?</h3>
                  <p className="text-gray-600">Yes. Many clients come to us after receiving an unfavorable C&P opinion. If the medical evidence supports a different conclusion, our physician can provide an independent opinion.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Can you help with secondary conditions?</h3>
                  <p className="text-gray-600">Yes. We can provide physician-authored medical opinions establishing that a secondary condition was caused or aggravated by a service-connected primary condition.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">How is this different from the VA's C&P exam?</h3>
                  <p className="text-gray-600">C&P exams are conducted by VA contractors who may spend limited time on each case. Our physicians conduct independent reviews focused solely on documenting the medical opinion.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Is the free review really free?</h3>
                  <p className="text-gray-600">Yes. We collect your card and place a temporary $1 authorization to verify it and prevent abuse. This automatically falls off within a few days. You are never charged unless your case qualifies and you choose to proceed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Find Out If Your Claim Qualifies
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your service and medical records today. Our team will review them at no cost and let you know whether a physician-authored medical opinion is appropriate for your situation.
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
