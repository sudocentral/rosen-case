import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Medical Opinion Letters | Nexus, SSDI, Insurance | Rosen Experts",
  description: "Learn what a strong physician opinion letter includes for VA nexus, SSDI claims, insurance denials, and more. See the quality and detail before you start your free review.",
};

const START_URL = "/start/";

export default function SamplesPage() {
  const sampleTypes = [
    {
      title: "Physician-Authored Medical Opinion",
      whatItIs: "A medical physician-authored medical opinion establishing service connection between a veteran's current condition and their military service.",
      keyElements: [
        'Uses "at least as likely as not" language the VA recognizes',
        "References specific service treatment records and documented events",
        "Provides detailed medical rationale explaining the connection",
        "Includes physician credentials and specialty qualifications",
      ],
      excerpt: '"Based on review of the veteran\'s service treatment records documenting [condition] during active duty, and the current medical evidence showing ongoing [symptoms], it is my medical opinion that it is at least as likely as not (50% or greater probability) that the veteran\'s current [condition] is etiologically related to their military service..."',
    },
    {
      title: "SSDI Medical Opinion",
      whatItIs: "A medical opinion letter supporting a Social Security Disability Insurance application, documenting functional limitations.",
      keyElements: [
        "Detailed functional capacity assessment (sitting, standing, lifting)",
        "Explanation of how condition limits ability to perform work",
        "Duration of impairment statement meeting SSA requirements",
        "Alignment with SSA evaluation criteria and regulations",
      ],
      excerpt: '"The claimant\'s [condition] results in significant functional limitations including the inability to stand or walk for more than [duration] without rest, lifting restrictions of no more than [weight], and difficulty maintaining concentration for extended periods. These limitations have persisted for twelve months or more and are expected to continue..."',
    },
    {
      title: "Insurance Denial Appeal",
      whatItIs: "An independent medical opinion addressing an insurance claim denial, documenting why the treatment was medically necessary.",
      keyElements: [
        "Direct response to the insurer's stated denial reasons",
        "Citation of relevant medical guidelines and standards of care",
        "Clear explanation of medical necessity",
        "Professional formatting suitable for formal appeal process",
      ],
      excerpt: '"The insurer\'s denial states that [treatment] was not medically necessary. This opinion is not supported by the clinical evidence. According to [guideline], patients with [condition] who present with [symptoms] meet established criteria for [treatment]. The denial fails to consider..."',
    },
    {
      title: "Medical Malpractice Opinion",
      whatItIs: "A physician opinion evaluating whether the standard of care was breached and whether that breach caused harm.",
      keyElements: [
        "Standard of care analysis based on medical literature",
        "Detailed causation assessment linking breach to harm",
        "Supporting rationale with peer-reviewed citations",
        "Structured format appropriate for legal proceedings",
      ],
      excerpt: '"The applicable standard of care for a patient presenting with [symptoms] requires [action]. Review of the medical records indicates that [provider] failed to [action], which constitutes a breach of the standard of care. This breach directly resulted in [outcome] because..."',
    },
  ];

  const letterComponents = [
    { title: "Clear Medical Rationale", desc: "Not just a conclusion—a detailed explanation of the medical reasoning" },
    { title: "Specific Evidence Citations", desc: "Direct references to your actual medical records and documentation" },
    { title: "Proper Terminology", desc: "Language that courts, agencies, and insurers recognize and require" },
    { title: "Physician Credentials", desc: "Full documentation of the authoring physician's qualifications" },
    { title: "Professional Formatting", desc: "Structured specifically for the intended use (VA, SSA, insurance, legal)" },
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
                What a Strong Medical Opinion Includes
              </h1>
              <p className="text-xl text-white/80 mb-6 leading-relaxed">
                Every letter we provide is authored by a licensed physician and tailored to your specific case. Below you'll find examples of what our letters include and why they're effective.
              </p>
              <div className="badge text-white/90">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Example excerpts only—we do not post actual client letters</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Don't Post Full Letters */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="card bg-gray-50 border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Why We Don't Publish Full Sample Letters
                </h2>
                <p className="text-gray-600 mb-4">
                  We take fraud prevention seriously. Publishing complete letters would allow bad actors to copy our physicians' work or submit fraudulent claims using our format as a template.
                </p>
                <p className="text-gray-600">
                  Instead, we provide illustrative excerpts showing the structure, language, and detail you can expect. Your letter will be entirely customized to your case—no two letters are identical.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes a Strong Letter */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                Components of an Effective Opinion Letter
              </h2>
              <p className="text-lg text-gray-600 mb-8 text-center">
                A strong physician opinion letter is more than a signature on a template. Our letters include:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {letterComponents.map((item, index) => (
                  <div key={index} className="card">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sample Types with Excerpts */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Example Excerpts by Letter Type
              </h2>

              <div className="space-y-8">
                {sampleTypes.map((sample, index) => (
                  <div key={index} className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{sample.title}</h3>

                    <div className="mb-4">
                      <p className="text-gray-600">{sample.whatItIs}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">Key Elements</h4>
                      <ul className="space-y-2">
                        {sample.keyElements.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                            <svg className="w-4 h-4 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#1a5f7a]">
                      <h4 className="font-semibold text-gray-700 text-sm mb-2">Example Excerpt</h4>
                      <p className="text-gray-600 text-sm italic leading-relaxed">
                        {sample.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quality Assurance */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Every Letter Meets Our Standards
              </h2>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Before any letter is delivered, it undergoes our quality review process:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-[#2c8a6e] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Accuracy Check</h3>
                    <p className="text-gray-600 text-sm">Verification of all facts against submitted records</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-[#2c8a6e] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Completeness Review</h3>
                    <p className="text-gray-600 text-sm">Ensuring all relevant evidence is addressed</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-[#2c8a6e] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Language Review</h3>
                    <p className="text-gray-600 text-sm">Confirmation of proper medical-legal terminology</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-[#2c8a6e] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Credential Verification</h3>
                    <p className="text-gray-600 text-sm">Physician credentials match specialty and jurisdiction</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-600 mt-8">
                We stand behind the quality of every letter we deliver.
              </p>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Will my letter look exactly like these excerpts?</h3>
                  <p className="text-gray-600">Your letter will follow similar structure and quality standards but will be entirely customized to your case. No two letters are identical.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Can I request a specific format?</h3>
                  <p className="text-gray-600">Our letters are formatted for their intended use (VA submission, SSA filing, insurance appeal, legal proceeding). If you have specific requirements, let us know during the review process.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Are these templates?</h3>
                  <p className="text-gray-600">No. While our letters follow professional structures, every letter is individually authored by a physician based on your unique medical records and situation.</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Who writes these letters?</h3>
                  <p className="text-gray-600">Every letter is written by a licensed physician (MD or DO). The authoring physician's credentials are included with your letter.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your medical records today for a free review. If your case qualifies, you'll receive a letter of the same quality and professionalism shown in these examples.
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
