import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { conditions, categoryNames, getConditionsByCategory } from "./data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Conditions We Support | VA, SSDI, Insurance | Rosen Experts",
  description: "Explore conditions we provide physician opinion letters for, including VA disability nexus letters, SSDI medical opinions, and insurance denial appeals.",
};

const START_URL = "/start/";

const categoryOrder: Array<"va" | "ssdi" | "insurance" | "general"> = ["va", "ssdi", "insurance", "general"];

export default function ConditionsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Conditions We Support
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Our physician network provides opinion letters for a wide range of conditions. Select a condition below to learn more about how we can help with your specific situation.
              </p>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              {categoryOrder.map(category => {
                const categoryConditions = getConditionsByCategory(category);
                if (categoryConditions.length === 0) return null;

                return (
                  <div key={category} className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#1a5f7a]">
                      {categoryNames[category]}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {categoryConditions.map(condition => (
                        <Link
                          key={condition.slug}
                          href={`/conditions/${condition.slug}`}
                          className="card hover:shadow-lg hover:border-[#1a5f7a]/30 transition-all group"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1a5f7a] transition-colors">
                            {condition.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {condition.shortDescription}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[#1a5f7a] text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                            Learn more
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Not Listed CTA */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Don't See Your Condition Listed?
              </h2>
              <p className="text-gray-600 mb-6">
                This is not an exhaustive list. Our physician network covers many conditions not shown here. Submit your records for a free review and we'll determine if we can help with your specific situation.
              </p>
              <Link href={START_URL} className="btn-primary">
                Start Free Medical Records Review
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
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
              Submit your medical records for a free review. We'll determine whether your case qualifies for a physician opinion letter.
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
