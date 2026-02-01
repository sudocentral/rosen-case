import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import HowItWorksListenButton from "./HowItWorksListenButton";

export const metadata: Metadata = {
  title: "How It Works | Free Medical Records Review Process | Rosen Experts",
  description: "Learn how our free medical records review works. Submit your documents, receive a same-day determination, and only pay if you qualify with a physician opinion.",
};

const START_URL = "/start/";

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <HowItWorksListenButton />
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                How Your Free Medical Review Works
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                We've simplified the process so you can focus on what matters. Submit your records, get a free expert review, and receive your determination—typically within one business day.
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Four Steps. One Goal: Clarity.
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
              {/* Step 1 */}
              <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
                <div className="step-number">1</div>
                <div className="card">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Your Medical Records</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What You Do</h4>
                      <p className="text-gray-600 mb-4">
                        Upload your medical documentation through our secure portal. Service records, treatment notes, diagnostic imaging, prior decisions, or any other documentation that supports your case.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What We Need</h4>
                      <ul className="text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Relevant medical records
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Any prior claim denials (if applicable)
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Brief description of your situation
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-[#1a5f7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Time Required:</strong> 5-10 minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-[#1a5f7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>All uploads encrypted and HIPAA-compliant</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
                <div className="step-number">2</div>
                <div className="card">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Expert Review</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What Happens</h4>
                      <p className="text-gray-600">
                        Our team reviews your documentation using comprehensive analysis and physician oversight. We identify relevant conditions, evaluate the strength of your medical evidence, and determine whether a supporting opinion is appropriate.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Who Reviews</h4>
                      <ul className="text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Comprehensive document analysis
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Licensed physician final review
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#e8f5f0] rounded-lg">
                    <p className="text-[#2c8a6e] font-semibold">
                      Cost: $0. The review is free. Free review.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 - THE KEY REVELATION */}
              <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
                <div className="step-number">3</div>
                <div className="card border-2 border-[#2c8a6e]">
                  <span className="inline-block bg-[#e8f5f0] text-[#2c8a6e] text-xs font-bold px-3 py-1 rounded-full mb-4">KEY STEP: THIS IS WHERE YOU GET YOUR ANSWER</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Determination</h3>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What You Receive</h4>
                    <p className="text-gray-600 mb-4">
                      A clear answer: Does your case qualify for a supporting medical opinion?
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-[#e8f5f0] rounded-lg">
                      <h4 className="font-semibold text-[#2c8a6e] mb-2">If Yes</h4>
                      <p className="text-gray-600 text-sm">
                        Your card is charged and a physician begins authoring your medical opinion letter. Standard delivery takes up to 7 business days; expedited delivery (48-72 hours) is available for $400.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">If No</h4>
                      <p className="text-gray-600 text-sm">
                        We explain why and, where possible, suggest what additional documentation might strengthen your case in the future.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#1a5f7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong>Timing:</strong> Most determinations within hours. Complex cases may take up to one business day.</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
                <div className="step-number">4</div>
                <div className="card">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Physician-Authored Opinion (If Qualified)</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What Happens</h4>
                      <p className="text-gray-600">
                        A licensed physician in our network reviews your complete file and authors a comprehensive medical opinion letter tailored to your case type.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Delivery Options</h4>
                      <p className="text-gray-600">
                        Standard: up to 7 business days. Expedited (48-72 hours): $400. Secure digital delivery through your client portal.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Payment:</strong> Payment is collected only after you qualify. No hidden fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Start with Free Review */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                Why Start with a Free Review?
              </h2>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Many services charge for consultations or require payment before you know if your case has merit. We believe you deserve answers first.
              </p>
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Our free review ensures:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">You know where you stand before spending anything</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">We only take cases where a physician opinion can genuinely help</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">No wasted time or money on cases that aren't ready</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Questions</h2>
              
              <div className="space-y-6">
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Is the review really free?</h3>
                  <p className="text-gray-600">Yes. There is no charge for the initial medical records review and determination. You only pay if you qualify with a physician opinion letter.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">How long does the determination take?</h3>
                  <p className="text-gray-600">Most determinations are delivered the same day, often within hours. Complex cases involving extensive documentation may require up to one business day.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">What if my case doesn't qualify?</h3>
                  <p className="text-gray-600">We'll explain why and provide guidance on what, if anything, could strengthen your case in the future. There's no pressure and no charge.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Who reviews my records?</h3>
                  <p className="text-gray-600">Your documentation is analyzed using comprehensive analysis tools for thoroughness, with final review and determination made by a licensed physician.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Is my information secure?</h3>
                  <p className="text-gray-600">Absolutely. All uploads are encrypted, stored securely, and handled in compliance with HIPAA regulations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Your Answer?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your medical records today. Our team will review them at no cost and provide a clear determination, typically the same day.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={START_URL} className="btn-white text-lg">
                Start Free Medical Records Review
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/services/" className="btn-outline-white text-lg">
                View Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
