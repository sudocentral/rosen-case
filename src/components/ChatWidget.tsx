"use client";

import { useState } from "react";

interface QuickQuestion {
  label: string;
  answer: string;
}

const quickQuestions: QuickQuestion[] = [
  {
    label: "Is the review really free?",
    answer: "Yes, the initial medical records review is completely free. We analyze your records at no cost and tell you if your case qualifies for a physician opinion letter. You only pay if you qualify after receiving your determination.",
  },
  {
    label: "How long does it take?",
    answer: "Determinations are typically delivered the same day, often within hours. If you qualify, your physician opinion letter is delivered within 7 business days. We also offer expedited 48-72 hour delivery as a premium option for $400.",
  },
  {
    label: "What documents do I need?",
    answer: "Submit your relevant medical records, treatment notes, and any prior decisions or denial letters. For VA claims, include your service treatment records. The more complete your submission, the more accurate our determination.",
  },
  {
    label: "Who reviews my records?",
    answer: "Your records are reviewed by a team that uses comprehensive review for thoroughness, with final determination made by a licensed physician. Every opinion letter is written and signed by a licensed physician.",
  },
  {
    label: "What if I do not qualify?",
    answer: "If your case does not qualify, you pay nothing. We will explain why and, where possible, suggest what additional documentation might strengthen your case in the future. There is no obligation.",
  },
  {
    label: "Can I check my case status?",
    answer: "I cannot access your case details. To check your case status, please log in to your client center using the link sent to your email. Your case status and any messages from our team are available there.",
  },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const toggleQuestion = (label: string) => {
    setExpandedQuestion(expandedQuestion === label ? null : label);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#2c8a6e] text-white p-4 rounded-full shadow-lg hover:bg-[#1e6b55] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c8a6e]"
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat Assistant"
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
          style={{ maxHeight: "min(600px, calc(100vh - 150px))" }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#1a5f7a] to-[#2c8a6e] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Frequently Asked Questions</h3>
                <p className="text-white/70 text-xs">Tap a question to see the answer</p>
              </div>
            </div>
          </div>

          {/* Accordion Questions */}
          <div className="flex-1 overflow-y-auto">
            {quickQuestions.map((q) => (
              <div key={q.label} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => toggleQuestion(q.label)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={expandedQuestion === q.label}
                >
                  <span className="text-sm font-medium text-gray-700 pr-2">{q.label}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      expandedQuestion === q.label ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedQuestion === q.label && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
                      {q.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">
              This answers general questions only. For case-specific inquiries, please log in to your client center.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
