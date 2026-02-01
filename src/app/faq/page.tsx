import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQClient from "./FAQClient";
import type { Metadata } from "next";
import FAQListenButton from "./FAQListenButton";

export const metadata: Metadata = {
  title: "FAQ | Free Medical Review & Physician Opinions | Rosen Experts",
  description: "Answers to common questions about our free medical records review, physician opinion letters, VA nexus letters, SSDI support, and insurance denial appeals.",
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <FAQListenButton />
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Everything you need to know about our free medical records review, physician opinion letters, and how we can help with your case.
              </p>
            </div>
          </div>
        </section>

        <FAQClient />
      </main>
      <Footer />
    </>
  );
}
