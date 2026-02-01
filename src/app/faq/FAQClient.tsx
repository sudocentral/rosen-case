"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  id: string;
  title: string;
  questions: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    id: "free-review",
    title: "About the Free Review",
    questions: [
      {
        q: "Is the medical records review really free?",
        a: "Yes. There is no charge for the initial review and determination. We analyze your submitted records at no cost and tell you whether your case qualifies for a physician opinion letter."
      },
      {
        q: "Do I need to provide a credit card for the free review?",
        a: "Yes. We collect your card and place a temporary $1 authorization to verify it and prevent abuse. This authorization automatically falls off within a few days. You are never charged unless your case qualifies and you choose to proceed with a physician opinion letter."
      },
      {
        q: "How long does the free review take?",
        a: "Most determinations are delivered within hours of submission. Complex cases with extensive documentation may take up to one business day."
      },
      {
        q: "What happens if my case doesn't qualify?",
        a: "You pay nothing. We'll explain why your case doesn't qualify and, where possible, suggest what additional documentation might strengthen your situation in the future."
      },
      {
        q: "What do I need to submit for the free review?",
        a: "Submit relevant medical records, treatment notes, and any prior decisions or denial letters. The more complete your submission, the more accurate our determination."
      },
    ]
  },
  {
    id: "opinion-letters",
    title: "About Physician Opinion Letters",
    questions: [
      {
        q: "Who writes the opinion letters?",
        a: "Every letter is authored by a licensed physician (MD or DO). We match your case with a physician who has relevant specialty expertise."
      },
      {
        q: "Are these real doctors?",
        a: "Yes. Our physician network consists of licensed, credentialed physicians across multiple specialties. Physician credentials are included with every letter."
      },
      {
        q: "How long does it take to receive my letter?",
        a: "Standard delivery takes up to 7 business days. Expedited delivery (48-72 hours) is available for $400. You can select your preference after your case qualifies."
      },
      {
        q: "Can I request revisions to my letter?",
        a: "If there are factual errors in your letter, we will correct them at no additional charge. Revisions for changes in medical opinion are handled on a case-by-case basis."
      },
      {
        q: "How do I receive my completed letter?",
        a: "Letters are delivered digitally through your secure client portal. You can download, print, or share as needed."
      },
    ]
  },
  {
    id: "process",
    title: "About Our Process",
    questions: [
      {
        q: "How does the review process work?",
        a: "Your records are comprehensively analyzed to identify relevant conditions, medications, dates, and findings. A licensed physician reviews the analysis and makes the final determination about your case."
      },
      {
        q: "Do I need to see a doctor in person?",
        a: "No. Our opinions are based on review of your existing medical records. We do not conduct physical examinations. If an examination is required for your case, you would obtain that separately."
      },
      {
        q: "Is my information secure?",
        a: "Yes. All uploads are encrypted and stored in compliance with HIPAA regulations. Your medical records are never shared without your authorization."
      },
      {
        q: "What if I have questions during the process?",
        a: "You can contact us through our portal or by using the contact form on our website. Our team responds to inquiries promptly during business hours."
      },
    ]
  },
  {
    id: "va-disability",
    title: "VA Disability & Nexus Letters",
    questions: [
      {
        q: "What is a nexus letter?",
        a: "A nexus letter is a medical opinion from a licensed physician stating that your current condition is connected to your military service. It uses language the VA recognizes, such as \"at least as likely as not.\""
      },
      {
        q: "Will a nexus letter guarantee my VA claim is approved?",
        a: "No. The VA makes all final decisions. A nexus letter provides independent medical evidence for the VA to consider alongside your service and medical records."
      },
      {
        q: "Can you help with secondary conditions?",
        a: "Yes. We can provide nexus letters for conditions caused or aggravated by a service-connected primary condition."
      },
      {
        q: "Do you provide DBQs?",
        a: "Yes. Disability Benefits Questionnaires are available as an add-on to nexus letter orders where clinically appropriate."
      },
      {
        q: "What if my C&P exam was unfavorable?",
        a: "Many clients come to us after an unfavorable C&P opinion. If the medical evidence supports a different conclusion, our physician can provide an independent opinion."
      },
    ]
  },
  {
    id: "ssdi",
    title: "SSDI & Disability Claims",
    questions: [
      {
        q: "Can you help with my SSDI application?",
        a: "Yes. We provide medical opinion letters documenting how your condition limits your ability to work, structured to meet SSA requirements."
      },
      {
        q: "I was denied SSDI. Can you help with my appeal?",
        a: "Yes. A strong medical opinion letter addressing the denial reasons can be submitted as new evidence during reconsideration or before an Administrative Law Judge."
      },
      {
        q: "Will your letter replace my treating physician's notes?",
        a: "No. Our letter supplements your existing medical records by providing the type of functional capacity documentation the SSA looks for but treating physicians often don't include."
      },
    ]
  },
  {
    id: "insurance",
    title: "Insurance Denials",
    questions: [
      {
        q: "My insurance claim was denied. Can you help?",
        a: "Yes. We provide independent medical opinions that address the insurer's stated denial reasons and document why your claim should be approved."
      },
      {
        q: "What types of insurance denials do you cover?",
        a: "We support appeals for health insurance, disability insurance, life insurance, and long-term care insurance denials."
      },
      {
        q: "Can I use your opinion if I sue my insurance company?",
        a: "Yes. Our opinions are written to be suitable for legal proceedings if your appeal is unsuccessful and you pursue litigation."
      },
    ]
  },
  {
    id: "pricing",
    title: "Pricing & Payment",
    questions: [
      {
        q: "How much does a letter cost?",
        a: "Physician opinion letters start at $1,000. The exact price for your case is provided after the free review, based on complexity and case type. We evaluate your submitted records and cover qualifying conditions within the scope of the engagement."
      },
      {
        q: "When do I pay?",
        a: "Payment is collected only after your free review is complete and you qualify. The $1 card authorization during signup is just for verification—you're never charged unless you qualify and choose to proceed."
      },
      {
        q: "Are there payment plans available?",
        a: "Financing options may be available through our checkout process. Options are displayed during payment if eligible."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover)."
      },
      {
        q: "What is the expedited delivery fee?",
        a: "Expedited delivery (48-72 hours) is available for an additional $400. Standard delivery takes up to 7 business days and is included in the base price."
      },
    ]
  },
];

function AccordionItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-5 px-1 text-left hover:text-[#1a5f7a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5f7a] focus-visible:ring-offset-2 rounded"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-900 pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-1 text-gray-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqSections;
    }

    const query = searchQuery.toLowerCase();
    return faqSections
      .map(section => ({
        ...section,
        questions: section.questions.filter(
          item =>
            item.q.toLowerCase().includes(query) ||
            item.a.toLowerCase().includes(query)
        )
      }))
      .filter(section => section.questions.length > 0);
  }, [searchQuery]);

  const toggleItem = (sectionId: string, questionIndex: number) => {
    const key = `${sectionId}-${questionIndex}`;
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveCategory(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const totalResults = filteredSections.reduce((acc, section) => acc + section.questions.length, 0);

  return (
    <>
      {/* Search and Category Navigation */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-gray-600 mb-6">
                {totalResults} {totalResults === 1 ? "result" : "results"} found for "{searchQuery}"
              </p>
            )}

            {/* Category Pills */}
            {!searchQuery && (
              <div className="flex flex-wrap gap-2">
                {faqSections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === section.id
                        ? "bg-[#1a5f7a] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            {filteredSections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No questions found matching your search.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#1a5f7a] font-medium hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredSections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#1a5f7a]">
                      {section.title}
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                      {section.questions.map((item, qIndex) => (
                        <AccordionItem
                          key={qIndex}
                          question={item.q}
                          answer={item.a}
                          isOpen={openItems.has(`${section.id}-${qIndex}`)}
                          onToggle={() => toggleItem(section.id, qIndex)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="gradient-hero section-padding">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            We're here to help. Contact our team or start your free medical records review to learn more about your specific situation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/start/" className="btn-white text-lg">
              Start Free Medical Records Review
            </Link>
            <Link href="/contact/" className="btn-outline-white text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
