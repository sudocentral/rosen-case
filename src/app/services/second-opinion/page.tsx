import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import SecondOpinionListenButton from "./SecondOpinionListenButton";

export const metadata: Metadata = {
  title: "Second Medical Opinion | Independent Physician Review | Rosen Experts",
  description: "Get a second medical opinion from a licensed physician. Independent review of your diagnosis or treatment plan. Free medical records review.",
};

const START_URL = "/start?service=second-opinion";

export default function SecondOpinionPage() {
  const whenToSeek = [
    "You've received a serious or life-altering diagnosis",
    "Surgery or aggressive treatment has been recommended",
    "Your symptoms persist despite treatment",
    "You're unsure whether the recommended approach is right for you",
    "You want confirmation before making a major decision",
  ];

  const commonSituations = [
    { title: "Cancer Diagnosis", desc: "Confirming the type, stage, and recommended treatment approach" },
    { title: "Recommended Surgery", desc: "Verifying that surgery is necessary and appropriate" },
    { title: "Chronic Condition Management", desc: "Evaluating whether current treatment is optimal" },
    { title: "Rare or Complex Conditions", desc: "Ensuring nothing has been overlooked" },
    { title: "Conflicting Advice", desc: "When different doctors have given different recommendations" },
  ];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <SecondOpinionListenButton />
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-white/60 text-sm">
                  <li><Link href="/services/" className="hover:text-white">Services</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">Second Medical Opinions</li>
                </ol>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Get a Second Opinion from a Licensed Physician
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Facing surgery, a serious diagnosis, or an uncertain treatment plan? Our licensed physicians review your records and provide an independent assessment to help you make informed decisions.
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

        {/* When to Seek */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                When an Independent Perspective Matters
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A second opinion is not a sign of distrust in your doctor. It's a responsible step when:
              </p>
              <ul className="space-y-3 mb-8">
                {whenToSeek.map((item, index) => (
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
                  Studies show that second opinions lead to a change in diagnosis or treatment plan in a significant percentage of cases. Even when the original recommendation is confirmed, patients report greater confidence in their care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Independent Physician Review</h2>
              
              <div className="card mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">The Process</h3>
                <p className="text-gray-600 mb-4">
                  A licensed physician reviews your medical records (imaging, lab results, pathology reports, and physician notes) and provides a written assessment addressing:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Whether your diagnosis is well-supported by the evidence
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Whether the recommended treatment is appropriate
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Whether alternative approaches should be considered
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Any additional testing or evaluation that may be warranted
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-2">What You Receive</h3>
                <p className="text-gray-600">
                  A detailed written opinion you can review with your treating physician, share with family, or keep for your own peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Getting Your Second Opinion</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">1</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Your Records (Free)</h3>
                    <p className="text-gray-600">Upload your medical records, including imaging, lab results, and physician notes. Our team reviews them at no cost.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">2</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Your Determination (Same Day)</h3>
                    <p className="text-gray-600">We'll confirm whether we can provide a second opinion based on the records submitted and what additional information, if any, is needed.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">3</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Physician Review & Opinion (If Qualified)</h3>
                    <p className="text-gray-600">A licensed physician with relevant specialty expertise reviews your complete file and provides a written assessment.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="step-number flex-shrink-0">4</div>
                  <div className="card flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Delivery</h3>
                    <p className="text-gray-600">Download your opinion through your client portal. Discuss it with your treating physician or use it for your own decision-making.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Situations */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">When Patients Seek Second Opinions</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {commonSituations.map((situation, index) => (
                  <div key={index} className="card">
                    <h3 className="font-semibold text-gray-900 mb-2">{situation.title}</h3>
                    <p className="text-gray-600 text-sm">{situation.desc}</p>
                  </div>
                ))}
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
                  <h3 className="font-semibold text-gray-900 mb-2">Will my doctor be offended if I get a second opinion?</h3>
                  <p className="text-gray-600">Most physicians welcome second opinions. It demonstrates engagement in your care and can provide valuable perspective for your treatment team.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Can you treat me or prescribe medications?</h3>
                  <p className="text-gray-600">No. Our service is review and opinion only. We do not provide treatment, prescriptions, or ongoing care. Your treating physician remains responsible for your medical management.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">What specialties do you cover?</h3>
                  <p className="text-gray-600">Our network includes physicians across a wide range of specialties, including oncology, cardiology, orthopedics, neurology, and more. We match your case with a physician who has relevant expertise.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">What if the second opinion disagrees with my doctor?</h3>
                  <p className="text-gray-600">Disagreement doesn't mean one opinion is right and one is wrong. It means there may be room for discussion. We encourage you to share any second opinion with your treating physician so you can make decisions together.</p>
                </div>
                
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">Is the free review really free?</h3>
                  <p className="text-gray-600">Yes. The initial review is provided at no cost. Payment is only required if you qualify with a full written opinion.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What This Service Is */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What This Service Is and What It Is Not</h2>
                <p className="text-gray-600 mb-4">Our second opinion service provides independent medical review based on your existing records. It is:</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    An expert perspective to inform your decisions
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    A resource to discuss with your treating physician
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#2c8a6e] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    A way to gain clarity and confidence
                  </li>
                </ul>
                <p className="text-gray-600 mb-4">It is not:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    A replacement for your treating physician
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Emergency medical advice
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    A guarantee of any particular outcome
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
              Get Clarity Before Your Next Step
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your medical records today. Our team will review them at no cost and let you know if an independent physician opinion can help inform your decision.
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
