import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeListenButton from "./HomeListenButton";

const START_URL = "/start?service=general";

export default function HomePage() {
  const services = [
    { href: "/services/va-disability/", title: "VA Disability & Medical Opinions", desc: "Medical physician-authored medical opinions establishing service connection for veterans" },
    { href: "/services/ssdi/", title: "SSDI Claims", desc: "Medical opinions supporting Social Security Disability applications" },
    { href: "/services/insurance-denial/", title: "Insurance Denial Appeals", desc: "Independent opinions challenging claim denials" },
    { href: "/services/medical-malpractice/", title: "Medical Malpractice Review", desc: "Expert evaluation of standard of care issues" },
    { href: "/services/second-opinion/", title: "Second Medical Opinions", desc: "Independent review of diagnosis or treatment plans" },
  ];

  const trustPoints = [
    { icon: CheckIcon, title: "Free Review, Real Answer", desc: "Free review. Only pay if you qualify." },
    { icon: ShieldIcon, title: "Physician-Led Review Team", desc: "Every opinion authored by a licensed physician (MD or DO) with relevant specialty expertise." },
    { icon: DocumentIcon, title: "Structured for Decision-Makers", desc: "Opinions formatted for VA raters, SSA examiners, judges, and insurance reviewers." },
    { icon: ClockIcon, title: "Standard or Expedited", desc: "Standard delivery up to 7 business days. Expedited 48-72 hours for $400." },
    { icon: HeartIcon, title: "No Pressure, No Obligation", desc: "If your case does not qualify, you owe nothing. We only work if we can help." },
  ];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section - Emotional Hook */}
        <section className="gradient-hero-elevated pt-32 pb-24 lg:pt-40 lg:pb-32">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <HomeListenButton />
              <p className="text-lg text-white/70 mb-4 font-medium">
                You have been through enough.
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Get a Real Answer About Your Case Before You Spend a Dime.
              </h1>
              <p className="text-xl text-white/80 mb-4 leading-relaxed">
                Most services take your money first and your records second. We do the opposite.
              </p>
              <p className="text-xl text-white/90 mb-8 leading-relaxed font-medium">
                Submit your medical records. Our physician-led team reviews them. You get a determination the same day, often within hours. Free review. Just the truth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={START_URL} className="btn-white text-lg">
                  Start Your Free Review
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/how-it-works/" className="btn-outline-white text-lg">
                  See How It Works
                </Link>
              </div>
              <p className="text-sm text-white/60 mt-6">
                Free review. Same-day determination. Payment only if you qualify.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Indicators - Corrected */}
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="stat-value">2,500+</p>
                <p className="stat-label">Cases Reviewed</p>
              </div>
              <div>
                <p className="stat-value">Same Day</p>
                <p className="stat-label">Determinations</p>
              </div>
              <div>
                <p className="stat-value">$0</p>
                <p className="stat-label">To Learn If You Qualify</p>
              </div>
              <div>
                <p className="stat-value">Physicians</p>
                <p className="stat-label">Author Every Opinion</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Determination - Key Moment Section */}
        <section className="section-padding bg-white">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block bg-[#e8f5f0] text-[#2c8a6e] text-sm font-bold px-4 py-2 rounded-full mb-6">THE MOMENT THAT MATTERS</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                First, We Tell You the Truth.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Before you pay anything, before you commit to anything, you deserve to know: does your case have merit? That is what we answer, for free.
              </p>
            </div>

            {/* Process Flow with Determination Emphasized */}
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-[#2c8a6e] to-gray-200" style={{marginLeft: '12.5%', marginRight: '12.5%', width: '75%'}}></div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="card card-hover text-center relative">
                  <div className="step-number mx-auto mb-6">1</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Submit Records</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Upload your medical documentation through our secure portal. Takes about 5 minutes.
                  </p>
                  <p className="text-xs text-gray-400 mt-4 font-medium">FREE</p>
                </div>

                {/* Step 2 */}
                <div className="card card-hover text-center relative">
                  <div className="step-number mx-auto mb-6">2</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Physician Review</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    A licensed physician with relevant specialty expertise reviews your records.
                  </p>
                  <p className="text-xs text-gray-400 mt-4 font-medium">FREE</p>
                </div>

                {/* Step 3 - DETERMINATION - Visually Dominant */}
                <div className="card-determination text-center relative">
                  <span className="determination-badge">THIS IS THE KEY STEP</span>
                  <div className="step-number-accent mx-auto mb-4">3</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">The Determination</h3>
                  <p className="text-gray-700 leading-relaxed text-sm font-medium mb-4">
                    You receive a clear answer: does your case qualify for a supporting medical opinion?
                  </p>
                  <div className="bg-white/80 rounded-lg p-3 text-sm">
                    <p className="text-[#2c8a6e] font-semibold">If yes: work begins automatically.</p>
                    <p className="text-gray-500">If no: you owe nothing.</p>
                  </div>
                  <p className="text-xs text-[#2c8a6e] mt-4 font-bold">FREE - SAME DAY</p>
                </div>

                {/* Step 4 */}
                <div className="card card-hover text-center relative bg-gray-50">
                  <span className="inline-block bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-4">ONLY IF QUALIFIED</span>
                  <div className="step-number mx-auto mb-4">4</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Physician Letter</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    If you qualify, a physician authors your medical opinion letter.
                  </p>
                  <p className="text-xs text-gray-500 mt-4 font-medium">PAYMENT AT THIS STEP</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-500 mb-6">
                <strong>Important:</strong> Receiving a determination that your case qualifies does not guarantee approval of your claim. A physician opinion letter is supporting evidence, not a guarantee of outcome.
              </p>
              <Link href="/how-it-works/" className="btn-ghost">
                See the Full Process
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Why We Start With Free */}
        <section className="section-padding gradient-soft">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="inline-block bg-[#e8f5f0] text-[#2c8a6e] text-sm font-bold px-4 py-2 rounded-full mb-6">WHY WE DO THIS</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why We Start With Free.
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Because you should not have to pay $500 to find out your case was never going to work.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Many services in this industry charge upfront, then deliver a letter regardless of whether it helps your case. That model does not serve you.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We review your records first because we only want to work on cases where a physician opinion can actually make a difference. If your records do not support the opinion you need, we tell you before you spend money.
                </p>
                <p className="text-gray-700 font-medium leading-relaxed">
                  The free review is not a sales tactic. It is how we earn your trust.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">What You Get With the Free Review</h3>
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#e8f5f0] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2c8a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Physician-led review of your medical records</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#e8f5f0] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2c8a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Same-day determination (often within hours)</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#e8f5f0] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2c8a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Clear answer: qualifies or does not qualify</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#e8f5f0] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2c8a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Free review, no obligation</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-700">Card verification:</strong> We verify your card with a temporary $1 authorization to prevent abuse. It automatically falls off within a few days. You are only charged if your case qualifies and you choose to proceed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Help */}
        <section className="re-services-grid section-padding">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Physician-Authored Medical Opinions
              </h2>
              <p className="text-lg text-gray-600">
                Whether you are a veteran seeking service connection, an attorney building a case, or an individual challenging a denial, our physicians provide the documented medical opinions that matter.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="service-card"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                  <span className="text-[#1a5f7a] font-medium text-sm inline-flex items-center gap-1">
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/services/" className="btn-secondary">
                Explore All Services
              </Link>
            </div>
          </div>
        </section>

        {/* Why Rosen Experts - Trust Points */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Evidence That Holds Up.
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We provide physician-authored medical opinions structured for the people who make decisions: VA raters, SSA examiners, judges, and insurance reviewers.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  While the VA accepts opinions from PAs and NPs, we use licensed physicians (MD and DO) with relevant specialty expertise because their opinions carry weight in contested cases.
                </p>
                <Link href={START_URL} className="btn-primary">
                  Start Free Review
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg border border-gray-100">
                <div className="space-y-6">
                  {trustPoints.map((point, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="icon-box icon-box-primary">
                        <point.icon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{point.title}</h3>
                        <p className="text-gray-600 text-sm">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges - Corrected */}
        <section className="py-12 border-y border-gray-100 bg-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Secure Document Handling</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="font-medium">Licensed Physicians (MD and DO)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero-elevated section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Find Out If Your Case Qualifies.
            </h2>
            <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
              Submit your medical records today. A licensed physician will review them at no cost and provide a same-day determination.
            </p>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Free review. Only pay if you qualify.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={START_URL} className="btn-white text-lg">
                Start Your Free Review
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

// Icon Components
function CheckIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
