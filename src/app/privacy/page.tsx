import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Rosen Experts",
  description: "Rosen Experts Privacy Policy. Learn how we collect, use, and protect your personal and medical information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Privacy Policy
              </h1>
              <p className="text-gray-600">
                <strong>Last Updated:</strong> January 10, 2026
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto prose prose-gray">
              
              <h2>Introduction</h2>
              <p>
                Rosen Experts ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website rosenexperts.com and use our medical records review and physician opinion letter services.
              </p>
              <p>
                Please read this Privacy Policy carefully. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>

              <h2>Information We Collect</h2>
              
              <h3>Information You Provide</h3>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, mailing address</li>
                <li><strong>Medical Records:</strong> Documents you upload for review, including treatment records, diagnostic imaging, lab results, physician notes, prior claim decisions</li>
                <li><strong>Case Information:</strong> Details about your claim type (VA disability, SSDI, insurance denial, etc.)</li>
                <li><strong>Payment Information:</strong> Credit card or debit card details processed through our secure payment provider</li>
                <li><strong>Communications:</strong> Messages you send through our portal or via email</li>
              </ul>

              <h3>Information Collected Automatically</h3>
              <ul>
                <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns</li>
                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                <li><strong>IP Address:</strong> Used for security and fraud prevention</li>
                <li><strong>Cookies:</strong> See our Cookie Policy section below</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide our medical records review services</li>
                <li>Process and deliver physician opinion letters</li>
                <li>Communicate with you about your case status</li>
                <li>Process payments</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations</li>
                <li>Detect and prevent fraud</li>
              </ul>

              <h2>HIPAA Compliance</h2>
              <p>
                Rosen Experts handles Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA). We maintain administrative, physical, and technical safeguards to protect your medical information.
              </p>
              <ul>
                <li>All medical records are encrypted in transit and at rest</li>
                <li>Access to PHI is limited to authorized personnel</li>
                <li>We do not sell your medical information</li>
                <li>You may request access to or deletion of your records</li>
              </ul>

              <h2>Information Sharing</h2>
              <p>We do not sell your personal information. We may share information with:</p>
              <ul>
                <li><strong>Physicians in Our Network:</strong> Licensed physicians who review your records and author opinion letters</li>
                <li><strong>Service Providers:</strong> Secure cloud hosting, payment processors, email services</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>With Your Consent:</strong> When you authorize sharing with attorneys, agencies, or other parties</li>
              </ul>

              <h2>Data Retention</h2>
              <ul>
                <li><strong>Medical Records:</strong> Retained for 7 years after case closure, as required for medical record keeping standards</li>
                <li><strong>Account Information:</strong> Retained while your account is active</li>
                <li><strong>Payment Records:</strong> Retained as required for tax and legal compliance</li>
              </ul>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information (subject to legal retention requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your medical records</li>
              </ul>
              <p>To exercise these rights, contact us at privacy@rosenexperts.com.</p>

              <h2>Data Security</h2>
              <p>We implement industry-standard security measures including:</p>
              <ul>
                <li>TLS encryption for data in transit</li>
                <li>AES-256 encryption for data at rest</li>
                <li>Access controls and authentication</li>
                <li>Regular security assessments</li>
                <li>Employee training on data protection</li>
              </ul>

              <h2>Cookie Policy</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences</li>
                <li>Analyze website traffic</li>
                <li>Enable marketing attribution</li>
              </ul>
              <p>You can control cookies through your browser settings. Disabling cookies may affect site functionality.</p>

              <h2>Third-Party Services</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites. This policy applies only to rosenexperts.com.
              </p>

              <h2>Minors</h2>
              <p>
                We provide services for individuals of all ages, including minors with disabilities. For clients under 18, a parent or legal guardian must provide consent and accept our Terms of Service on their behalf.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the "Last Updated" date.
              </p>

              <h2>Contact Us</h2>
              <p>For questions about this Privacy Policy or our privacy practices:</p>
              <p>
                <strong>Email:</strong> privacy@rosenexperts.com
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
