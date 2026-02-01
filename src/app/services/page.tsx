import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import ServicesListenButton from "./ServicesListenButton";

export const metadata: Metadata = {
  title: "Medical Opinion Services | VA, SSDI, Insurance, Malpractice | Rosen Experts",
  description: "Expert medical opinion letters for VA disability, SSDI, insurance denials, malpractice review, and more. Free medical records review for all case types.",
};

const START_URL = "/start/";

export default function ServicesPage() {
  const services = [
    {
      href: "/services/va-disability/",
      title: "VA Disability & Nexus Letters",
      summary: "Medical nexus letters and Disability Benefits Questionnaires (DBQs) for veterans establishing service connection. Our physicians document the link between your current condition and military service.",
      whoFor: "Veterans filing or appealing VA disability claims",
      icon: MilitaryIcon,
    },
    {
      href: "/services/ssdi/",
      title: "SSDI Claims",
      summary: "Medical opinion letters supporting Social Security Disability Insurance applications. We document how your condition meets SSA's definition of disability and limits your ability to work.",
      whoFor: "Individuals applying for or appealing SSDI benefits",
      icon: DisabilityIcon,
    },
    {
      href: "/services/insurance-denial/",
      title: "Insurance Denial Appeals",
      summary: "Independent medical opinions challenging insurance claim denials. When your insurer says no, a physician-authored opinion can provide the evidence needed for reconsideration or litigation.",
      whoFor: "Policyholders whose health, disability, or life insurance claims were denied",
      icon: ShieldIcon,
    },
    {
      href: "/services/medical-malpractice/",
      title: "Medical Malpractice Review",
      summary: "Expert review of medical records to assess potential malpractice claims. Our physicians evaluate whether the standard of care was breached and document their findings for legal use.",
      whoFor: "Individuals or attorneys evaluating malpractice claims",
      icon: ScaleIcon,
    },
    {
      href: "/services/second-opinion/",
      title: "Second Medical Opinions",
      summary: "Independent physician review of a diagnosis, treatment plan, or prognosis. Get clarity and confidence before making major medical decisions.",
      whoFor: "Patients seeking confirmation or alternative perspective on their care",
      icon: SearchIcon,
    },
  ];

  const differentiators = [
    { title: "Free Review for All Case Types", desc: "Every service starts with a no-cost medical records review. Know if your case qualifies before paying anything." },
    { title: "Licensed Physicians", desc: "Every opinion authored by a licensed, credentialed physician with relevant expertise." },
    { title: "Thorough Documentation", desc: "Every case receives comprehensive review by our medical team before physician evaluation." },
    { title: "Court-Ready Documentation", desc: "Opinions structured to meet the evidentiary requirements of courts, agencies, and insurers." },
  ];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <ServicesListenButton />
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Medical Opinions for Every Case Type
              </h1>
              <p className="text-xl text-white/80 mb-6 leading-relaxed">
                From VA disability claims to insurance denials, our licensed physicians provide documented medical opinions that meet the evidentiary standards of courts, agencies, and insurers.
              </p>
              <div className="badge badge-success">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Every service begins with a free medical records review</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Can We Help?
              </h2>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto">
              {services.map((service) => (
                <Link 
                  key={service.href}
                  href={service.href}
                  className="block card card-hover group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="icon-box icon-box-primary flex-shrink-0">
                      <service.icon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#1a5f7a] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {service.summary}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        <strong>Who This Is For:</strong> {service.whoFor}
                      </p>
                      <span className="text-[#1a5f7a] font-medium inline-flex items-center gap-1">
                        Learn More
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* The Rosen Difference */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Sets Us Apart
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {differentiators.map((item, index) => (
                <div key={index} className="card">
                  <div className="flex gap-4">
                    <svg className="w-6 h-6 text-[#2c8a6e] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Start with our free medical records review. Our team will analyze your documentation and recommend the appropriate service based on your situation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={START_URL} className="btn-white text-lg">
                Start Free Medical Records Review
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/contact/" className="btn-outline-white text-lg">
                Contact Us with Questions
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
function MilitaryIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  );
}

function DisabilityIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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

function ScaleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
