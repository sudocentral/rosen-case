import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Rosen Experts",
  description: "Rosen Experts Terms of Service. Review our terms and conditions for using our medical records review and physician opinion letter services.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Terms of Service
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

              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using the Rosen Experts website and services, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
              </p>

              <h2>2. Description of Services</h2>
              <p>Rosen Experts provides:</p>
              <ul>
                <li><strong>Free Medical Records Review:</strong> Analysis of submitted medical documentation to determine if a case qualifies for a supporting physician opinion</li>
                <li><strong>Physician Opinion Letters:</strong> Written medical opinions authored by licensed physicians, including physician-authored medical opinions, SSDI support letters, and independent medical opinions</li>
                <li><strong>Disability Benefits Questionnaires (DBQs):</strong> Standardized forms documenting condition severity (available as add-on)</li>
              </ul>

              <h2>3. Service Limitations</h2>
              <h3>What We Do Not Provide</h3>
              <ul>
                <li>Medical treatment, diagnosis, or prescriptions</li>
                <li>Emergency medical advice</li>
                <li>Legal advice or representation</li>
                <li>Guarantees of claim approval or case outcomes</li>
                <li>Direct physician consultations (our service is records-based review)</li>
              </ul>
              <h3>No Guarantee of Outcomes</h3>
              <p>
                A physician opinion letter is one piece of evidence in your claim. The VA, SSA, insurance companies, and courts make final decisions. We do not guarantee any particular outcome.
              </p>

              <h2>4. User Responsibilities</h2>
              <p>By using our services, you agree to:</p>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Submit only records you are authorized to share</li>
                <li>Not submit fraudulent or fabricated documents</li>
                <li>Maintain confidentiality of your account credentials</li>
                <li>Use our services only for lawful purposes</li>
              </ul>

              <h2>5. Free Review and Determination</h2>
              <ul>
                <li>The initial medical records review is provided at no cost</li>
                <li>We will inform you whether your case qualifies for a physician opinion</li>
                <li>If your case does not qualify, you owe nothing</li>
                <li>The free review does not obligate you. Payment is only charged if your case qualifies</li>
              </ul>

              <h2>6. Payment Terms</h2>
              <ul>
                <li>Pricing is provided after your free review determination</li>
                <li>Payment is collected only after you qualify</li>
                <li>We accept major credit and debit cards</li>
                <li>All sales are final once the physician review process begins</li>
                <li>Refunds may be issued at our discretion if no physician work has commenced</li>
              </ul>

              <h2>7. Delivery of Services</h2>
              <ul>
                <li>Most determinations are delivered the same business day</li>
                <li>Physician opinion letters are typically delivered within 48 to 72 hours after payment</li>
                <li>Complex cases may require additional time</li>
                <li>Delivery is via secure digital download through your client portal</li>
              </ul>

              <h2>8. Revisions Policy</h2>
              <ul>
                <li>Factual corrections (errors in dates, names, diagnoses) are provided at no additional charge</li>
                <li>Requests for changes to medical opinion or conclusions are subject to physician review and may incur additional fees</li>
                <li>Revisions must be requested within 30 days of delivery</li>
              </ul>

              <h2>9. Intellectual Property</h2>
              <ul>
                <li>Physician opinion letters become your property upon delivery</li>
                <li>You may share, submit, or reproduce letters for your claim purposes</li>
                <li>Website content, branding, and design remain property of Rosen Experts</li>
                <li>You may not reproduce our website content without permission</li>
              </ul>

              <h2>10. Privacy and Medical Records</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy. By using our services, you consent to:
              </p>
              <ul>
                <li>Collection and processing of your medical records</li>
                <li>Sharing of records with physicians in our network</li>
                <li>Retention of records as described in our Privacy Policy</li>
              </ul>

              <h2>11. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law:</p>
              <ul>
                <li>Rosen Experts is not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid for services</li>
                <li>We are not liable for claim denials or adverse decisions by third parties</li>
                <li>We are not liable for delays caused by factors outside our control</li>
              </ul>

              <h2>12. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Rosen Experts, its physicians, employees, and contractors from claims arising from:
              </p>
              <ul>
                <li>Your use of our services</li>
                <li>Your submission of fraudulent or inaccurate information</li>
                <li>Your violation of these Terms</li>
              </ul>

              <h2>13. Dispute Resolution</h2>
              <ul>
                <li>Disputes will be resolved through binding arbitration</li>
                <li>You waive the right to participate in class actions</li>
                <li>Small claims court remains available for qualifying disputes</li>
              </ul>

              <h2>14. Termination</h2>
              <p>We reserve the right to:</p>
              <ul>
                <li>Refuse service to any individual</li>
                <li>Terminate accounts for violation of these Terms</li>
                <li>Discontinue services at any time with reasonable notice</li>
              </ul>

              <h2>15. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Material changes will be posted on our website. Continued use after changes constitutes acceptance.
              </p>

              <h2>16. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Florida, without regard to conflict of law principles.
              </p>

              <h2>17. Severability</h2>
              <p>
                If any provision of these Terms is found unenforceable, the remaining provisions remain in effect.
              </p>

              <h2>18. Contact Information</h2>
              <p>For questions about these Terms:</p>
              <p>
                <strong>Email:</strong> legal@rosenexperts.com
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
