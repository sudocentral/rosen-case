import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import MalpracticeListenButton from "./MalpracticeListenButton";

export const metadata: Metadata = {
  title: "Medical Malpractice Review | Free Records Assessment | Rosen Experts",
  description: "Get an independent medical malpractice review from a licensed physician. Free records assessment. Expert evaluation of standard of care and causation.",
};

const START_URL = "/start?service=malpractice";

export default function MalpracticePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <MalpracticeListenButton />
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-white/60 text-sm">
                  <li><Link href="/services/" className="hover:text-white">Services</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">Medical Malpractice Review</li>
                </ol>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Expert Medical Malpractice Record Review
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                If you believe medical negligence caused harm to you or a loved one, our licensed physicians can review the records and provide an objective assessment of whether the standard of care was breached.
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

        {/* What Is Malpractice Review */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Understanding Expert Medical Review
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A medical malpractice review is an independent evaluation of medical records by a qualified physician to determine whether:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">The healthcare provider deviated from the accepted standard of care</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">That deviation directly caused harm or injury</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">The harm resulted in compensable damages</span>
                </li>
              </ul>
              <div className="card bg-[#e8f4f8] border-[#1a5f7a]/20">
                <h3 className="font-semibold text-gray-900 mb-2">Why It Matters</h3>
                <p className="text-gray-700">
                  Before pursuing a malpractice claim, you need to know if the medical evidence supports one. Attorneys typically require an expert medical opinion before accepting a case. Our review provides that initial assessment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Evaluate */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Physicians Evaluate</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Standard of Care</h3>
                  <p className="text-gray-600 text-sm">Did the provider act as a reasonably competent physician would under similar circumstances?</p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Breach</h3>
                  <p className="text-gray-600 text-sm">Was there a departure from accepted medical practice?</p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Causation</h3>
                  <p className="text-gray-600 text-sm">Did the breach directly cause the injury or adverse outcome?</p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                  <p className="text-gray-600 text-sm">Are the medical records complete enough to support or refute a claim?</p>
                </div>
              </div>
              
              <div className="card mt-8">
                <h3 className="font-semibold text-gray-900 mb-2">Deliverable</h3>
                <p className="text-gray-600">A detailed written opinion from a licensed physician documenting their findings, suitable for use by attorneys, courts, or for personal clarity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Malpractice Review Works</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">1</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Your Records (Free)</h3>
                    <p className="text-gray-600">Upload all relevant medical records, including records from the provider in question and any subsequent treatment. Our team reviews them at no cost.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">2</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Your Determination (Same Day)</h3>
                    <p className="text-gray-600">We'll tell you whether the records suggest a potential deviation from the standard of care and whether further expert analysis is warranted.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">3</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Physician Review & Opinion (If Qualified)</h3>
                    <p className="text-gray-600">A licensed physician with relevant specialty expertise reviews your complete file and provides a written opinion.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">4</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Delivery</h3>
                    <p className="text-gray-600">Download your opinion through your client portal. Share it with an attorney or use it for your own decision-making.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Uses This */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Who Benefits from Malpractice Review</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Individuals</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Patients who experienced unexpected complications or outcomes
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Families seeking answers after a loved one's injury or death
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Anyone considering whether to pursue a malpractice claim
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Attorneys</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Plaintiff's attorneys evaluating case merit before accepting
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Defense attorneys seeking independent review
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Firms needing expert opinions for litigation support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Note */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="card bg-gray-50 border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What We Don't Do</h2>
                <p className="text-gray-600 mb-4">Rosen Experts provides medical review and opinion services. We do not:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Provide legal advice
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Represent you in legal proceedings
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Guarantee any legal outcome
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    File lawsuits on your behalf
                  </li>
                </ul>
                <p className="text-gray-600 mt-4">If your case has merit, we recommend consulting with a qualified medical malpractice attorney.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Get an Objective Medical Assessment
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your medical records today. Our team will review them at no cost and let you know whether the evidence suggests a potential deviation from the standard of care.
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
