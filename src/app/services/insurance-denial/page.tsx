import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import InsuranceDenialListenButton from "./InsuranceDenialListenButton";

export const metadata: Metadata = {
  title: "Insurance Denial Appeals | Independent Medical Opinions | Rosen Experts",
  description: "Challenge your insurance denial with an independent medical opinion from a licensed physician. Free records review. Health, disability, life, and LTC denials.",
};

const START_URL = "/start?service=insurance";

export default function InsuranceDenialPage() {
  const denialReasons = [
    '"Not medically necessary"',
    '"Pre-existing condition"',
    '"Insufficient documentation"',
    '"Treatment not covered under policy terms"',
    '"Disability does not meet policy definition"',
  ];

  const coverageTypes = [
    { title: "Health Insurance Denials", items: ["Denied procedures or treatments", "Prior authorization rejections", "Claim downgrades (e.g., inpatient to outpatient)", '"Experimental" treatment denials'] },
    { title: "Disability Insurance Denials", items: ["Short-term disability claim rejections", "Long-term disability terminations", '"Own occupation" vs. "any occupation" disputes', "Claims your condition doesn't prevent work"] },
    { title: "Life Insurance Denials", items: ["Contestability period disputes", "Cause of death questions", "Pre-existing condition exclusions", "Material misrepresentation allegations"] },
    { title: "Long-Term Care Insurance Denials", items: ["Denied claims for nursing home or home care", 'Disputes over "benefit triggers"', "Cognitive impairment documentation issues"] },
  ];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <InsuranceDenialListenButton />
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-white/60 text-sm">
                  <li><Link href="/services/" className="hover:text-white">Services</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">Insurance Denial Appeals</li>
                </ol>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Your Insurance Claim Was Denied. Now What?
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                When a claim is denied, an independent physician opinion may document relevant medical findings from the records. Our licensed physicians review the available medical information and provide a written medical opinion based on that evidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={START_URL} className="btn-white text-lg">
                  Start Free Medical Records Review
                </Link>
                <Link href="/how-it-works/" className="btn-outline-white text-lg">
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding Denials */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Claims Get Denied and How Independent Medical Evidence Is Reviewed
              </h2>

              <h3 className="font-semibold text-gray-900 mb-4">Common Denial Reasons</h3>
              <ul className="space-y-2 mb-8">
                {denialReasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {reason}
                  </li>
                ))}
              </ul>

              <div className="card bg-[#e8f4f8] border-[#1a5f7a]/20">
                <h3 className="font-semibold text-gray-900 mb-2">The Reality</h3>
                <p className="text-gray-700">
                  Insurance companies employ their own medical reviewers to evaluate claims. These reviewers may not have access to your complete medical history and often apply narrow interpretations. An independent physician opinion provides additional medical perspective.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Denials */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">We Help with Multiple Coverage Types</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {coverageTypes.map((type, index) => (
                  <div key={index} className="card">
                    <h3 className="font-semibold text-gray-900 mb-4">{type.title}</h3>
                    <ul className="space-y-2">
                      {type.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                          <svg className="w-4 h-4 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What We Provide */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Our Physicians Provide</h2>

              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">The Opinion Letter</h3>
                <p className="text-gray-600 mb-4">A detailed medical opinion from a licensed physician documenting:</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Your diagnosis and medical history
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Why the treatment or claim is medically necessary
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    How your condition meets policy definitions
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Where the insurer's medical review was incorrect or incomplete
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Supporting medical literature where applicable
                  </li>
                </ul>
                <p className="text-sm text-gray-500 border-t border-gray-200 pt-4">
                  <strong>Purpose:</strong> To provide independent medical evidence that directly addresses the insurer's stated reasons for denial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Get Started</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">1</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Your Records (Free)</h3>
                    <p className="text-gray-600">Upload your medical records and the denial letter. Our team reviews them at no cost.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">2</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Your Determination (Same Day)</h3>
                    <p className="text-gray-600">We'll tell you whether an independent medical opinion can address the insurer's denial reasons.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">3</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Physician Review & Opinion (If Qualified)</h3>
                    <p className="text-gray-600">A licensed physician reviews your complete file and authors a letter tailored to your appeal.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">4</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Delivery</h3>
                    <p className="text-gray-600">Download your opinion through your client portal. Submit it with your formal appeal.</p>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Will an independent opinion guarantee my appeal is approved?</h3>
                  <p className="text-gray-600">No. The insurer makes the final decision. However, independent medical opinions document a physician's medical assessment for consideration alongside other evidence.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Can I use this opinion if I need to sue my insurer?</h3>
                  <p className="text-gray-600">Yes. Our opinions are written to be suitable for litigation if your appeal is unsuccessful and you choose to pursue legal action.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Does it matter what type of doctor reviews my case?</h3>
                  <p className="text-gray-600">We match your case with a physician who has relevant specialty expertise. A cardiologist reviews heart-related denials; an orthopedist reviews musculoskeletal claims, etc.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">My policy says I need to use their doctors. Can I still get an independent opinion?</h3>
                  <p className="text-gray-600">Yes. While your policy may require you to submit to their examinations, it does not prevent you from obtaining independent opinions to support your appeal.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Is the free review really free?</h3>
                  <p className="text-gray-600">Yes. The initial review and determination are provided at no cost. Payment is only required if you qualify with a written opinion.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Understanding Your Options After a Claim Denial
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your denial letter and medical records today. Our team will review them at no cost and determine whether an independent physician opinion can support your appeal.
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
