import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Rosen Experts | Medical Opinion Letters",
  description: "Contact Rosen Experts with questions about medical opinion letters, VA nexus letters, SSDI claims, or insurance denial appeals. Free medical records review available.",
};

const START_URL = "/start/";

export default function ContactPage() {
  const commonQuestions = [
    {
      q: "How do I check the status of my case?",
      a: "Log in to your client portal using the link sent to your email. Your case status and any messages from our team are available there."
    },
    {
      q: "I submitted records but haven't heard back. What should I do?",
      a: "Check your spam folder for emails from rosenexperts.com. If you still haven't received a response within one business day, use the form above with your name and submission details."
    },
    {
      q: "Can I talk to a doctor on the phone?",
      a: "Our physicians review records and provide written opinions. Phone consultations with physicians are not part of our standard service. For questions about our process, use the contact form above."
    },
    {
      q: "I'm an attorney. Do you offer volume pricing?",
      a: "Yes. Select 'Business & Legal Inquiries' in the form above to discuss attorney partnerships and volume arrangements."
    },
  ];

  const categoryInfo = [
    {
      title: "General Inquiries",
      desc: "Questions about our services, the process, or general information requests."
    },
    {
      title: "Existing Clients",
      desc: "Case status questions, document submissions, or letter delivery inquiries. Please include your case reference number."
    },
    {
      title: "Physicians Interested in Joining",
      desc: "Licensed physicians interested in joining our review network."
    },
    {
      title: "Business & Legal Inquiries",
      desc: "Attorney and law firm inquiries, insurance company inquiries, partnerships, and media requests."
    },
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
                Questions? We're Here to Help.
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Have questions about your case or our services? Our team responds within one business day. For the fastest path to answers about your case, start with our free medical records review.
              </p>
            </div>
          </div>
        </section>

        {/* Start Free Review First */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="card bg-[#e8f5f0] border-[#2c8a6e]/20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Most Questions Are Answered by Our Free Review
                </h2>
                <p className="text-gray-700 mb-6">
                  If you're wondering whether we can help with your case, the fastest way to find out is to submit your records for our free review. You'll receive a same-day determination with no obligation.
                </p>
                <Link href={START_URL} className="btn-primary">
                  Start Free Medical Records Review
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Send Us a Message
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Fill out the form below and we'll get back to you within one business day.
              </p>

              <div className="card">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Category Descriptions */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Inquiry Categories
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {categoryInfo.map((cat, index) => (
                  <div key={index} className="card">
                    <h3 className="font-semibold text-gray-900 mb-2">{cat.title}</h3>
                    <p className="text-gray-600 text-sm">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hours */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">When to Expect a Response</h2>

              <div className="card mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-700 text-lg">Monday through Friday: 9:00 AM to 6:00 PM Eastern</p>
              </div>

              <p className="text-gray-600">
                Free review determinations are often delivered outside regular business hours. Our physician-led team reviews cases throughout the day.
              </p>
            </div>
          </div>
        </section>

        {/* Common Questions */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Common Questions Before Contacting
              </h2>

              <div className="space-y-4">
                {commonQuestions.map((item, index) => (
                  <div key={index} className="card">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                    <p className="text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Client Portal Reminder */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="card text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Existing Clients
                </h2>
                <p className="text-gray-600 mb-6">
                  If you've already submitted your records, access your case status, messages, and documents through your secure client portal.
                </p>
                <Link href="/c/status" className="btn-secondary">
                  Access Client Portal
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Out If We Can Help?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              The fastest way to get answers about your case is to submit your records for a free review. You'll receive a determination, typically the same day, with no obligation.
            </p>
            <Link href={START_URL} className="btn-white text-lg">
              Start Free Medical Records Review
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
