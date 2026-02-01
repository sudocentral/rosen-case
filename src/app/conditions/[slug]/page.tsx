import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { conditions, getConditionBySlug, getRelatedConditions, categoryNames } from "../data";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return conditions.map((condition) => ({
    slug: condition.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const condition = getConditionBySlug(slug);

  if (!condition) {
    return {
      title: "Condition Not Found | Rosen Experts",
    };
  }

  return {
    title: condition.seoTitle || `${condition.name} | Medical Opinion Letters | Rosen Experts`,
    description: condition.seoDescription || condition.shortDescription,
  };
}

export default async function ConditionPage({ params }: PageProps) {
  const { slug } = await params;
  const condition = getConditionBySlug(slug);

  if (!condition) {
    notFound();
  }

  const relatedConditions = getRelatedConditions(condition);

  const startUrl = condition.category === "va"
    ? "/start?service=va"
    : condition.category === "ssdi"
    ? "/start?service=ssdi"
    : condition.category === "insurance"
    ? "/start?service=insurance"
    : "/start/";

  const serviceLink = condition.category === "va"
    ? "/services/va-disability/"
    : condition.category === "ssdi"
    ? "/services/ssdi/"
    : condition.category === "insurance"
    ? "/services/insurance-denial/"
    : "/services/";

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-white/60 text-sm flex-wrap">
                  <li><Link href="/conditions/" className="hover:text-white">Conditions</Link></li>
                  <li aria-hidden="true">/</li>
                  <li><Link href={serviceLink} className="hover:text-white">{categoryNames[condition.category]}</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">{condition.name}</li>
                </ol>
              </nav>
              <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                {categoryNames[condition.category]}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                {condition.name}
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                {condition.shortDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={startUrl} className="btn-white text-lg">
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

        {/* About This Condition */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Understanding {condition.name}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {condition.longDescription}
              </p>

              {condition.symptoms && condition.symptoms.length > 0 && (
                <div className="card mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Symptoms</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {condition.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-[#1a5f7a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How We Can Help
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our physician network can provide a detailed medical opinion letter addressing your {condition.name.toLowerCase()} case. Here's what we do:
              </p>
              <div className="space-y-4">
                {condition.howWeHelp.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#1a5f7a] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Summary */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Getting Started Is Simple
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#e8f5f0] text-[#2c8a6e] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Submit Records</h3>
                  <p className="text-gray-600 text-sm">Upload your medical documentation for free review</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#e8f5f0] text-[#2c8a6e] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Get Your Determination</h3>
                  <p className="text-gray-600 text-sm">Learn if your case qualifies for an opinion letter</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#e8f5f0] text-[#2c8a6e] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Receive Your Letter</h3>
                  <p className="text-gray-600 text-sm">Physician-authored letter delivered securely</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <Link href="/how-it-works/" className="text-[#1a5f7a] font-medium hover:underline">
                  Learn more about our process
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Conditions */}
        {relatedConditions.length > 0 && (
          <section className="section-padding bg-gray-50">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Conditions</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedConditions.map(related => (
                    <Link
                      key={related.slug}
                      href={`/conditions/${related.slug}`}
                      className="card hover:shadow-lg hover:border-[#1a5f7a]/30 transition-all group"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1a5f7a] transition-colors">
                        {related.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{related.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Your {condition.name} Case Reviewed?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Submit your medical records today for a free review. We'll determine if your case qualifies for a physician opinion letter.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={startUrl} className="btn-white text-lg">
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
