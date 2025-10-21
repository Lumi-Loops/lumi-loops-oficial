import { Metadata } from "next";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Lumi Loops",
  description:
    "Privacy Policy for Lumi Loops. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LegalPageLayout title="Privacy Policy" lastUpdated="January 21, 2025">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">1. Introduction</h2>
            <p className="mb-4">
              Lumi Loops (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
              respects your privacy and is committed to protecting your personal
              data. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our video creation
              services.
            </p>
            <p className="mb-4">
              This policy applies to information we collect through our website,
              services, and any related communications. By using our Service,
              you consent to the data practices described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              2. Information We Collect
            </h2>
            <h3 className="mb-3 text-xl font-semibold">
              2.1 Information You Provide
            </h3>
            <p className="mb-4">
              We collect information that you voluntarily provide when you:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>Contact us:</strong> Name, email address, business name,
                phone number
              </li>
              <li>
                <strong>Request services:</strong> Project details, content
                preferences, budget information
              </li>
              <li>
                <strong>Create an account:</strong> Username, password, profile
                information
              </li>
              <li>
                <strong>Make payments:</strong> Billing information (processed
                securely through third-party payment processors)
              </li>
              <li>
                <strong>Provide content:</strong> Brand materials, logos,
                images, videos, and other creative assets
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              2.2 Automatically Collected Information
            </h3>
            <p className="mb-4">
              When you access our Service, we automatically collect certain
              information:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>Device Information:</strong> IP address, browser type,
                operating system, device identifiers
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent, links
                clicked, referring URLs
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> See our{" "}
                <a href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </a>{" "}
                for details
              </li>
              <li>
                <strong>Analytics:</strong> We use Google Analytics and similar
                tools to understand user behavior
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use the collected information for:</p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>Service Delivery:</strong> Creating and delivering your
                custom video content
              </li>
              <li>
                <strong>Communication:</strong> Responding to inquiries, sending
                project updates, and customer support
              </li>
              <li>
                <strong>Payment Processing:</strong> Processing transactions and
                sending receipts
              </li>
              <li>
                <strong>Service Improvement:</strong> Analyzing usage patterns
                to enhance our Service
              </li>
              <li>
                <strong>Marketing:</strong> Sending promotional emails (with
                your consent, you can opt-out anytime)
              </li>
              <li>
                <strong>Legal Compliance:</strong> Complying with legal
                obligations and protecting our rights
              </li>
              <li>
                <strong>Security:</strong> Detecting and preventing fraud,
                abuse, and security incidents
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              4. Legal Basis for Processing (GDPR)
            </h2>
            <p className="mb-4">
              If you are from the European Economic Area (EEA), our legal basis
              for collecting and using your information depends on the data and
              context:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>Contract Performance:</strong> Processing necessary to
                provide our services
              </li>
              <li>
                <strong>Consent:</strong> You have given explicit consent for
                specific purposes
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Processing necessary for
                our legitimate business interests
              </li>
              <li>
                <strong>Legal Obligation:</strong> Processing required to comply
                with laws
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              5. Information Sharing and Disclosure
            </h2>
            <p className="mb-4">We may share your information with:</p>
            <h3 className="mb-3 text-xl font-semibold">
              5.1 Service Providers
            </h3>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Payment processors (Stripe, PayPal)</li>
              <li>Email service providers (for communications)</li>
              <li>Cloud storage providers (for project files)</li>
              <li>Analytics providers (Google Analytics)</li>
              <li>Customer support tools</li>
            </ul>
            <p className="mb-4">
              These third parties are contractually obligated to protect your
              data and use it only for specified purposes.
            </p>

            <h3 className="mb-3 text-xl font-semibold">
              5.2 Legal Requirements
            </h3>
            <p className="mb-4">
              We may disclose your information if required to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Comply with legal obligations or court orders</li>
              <li>Protect our rights, property, or safety</li>
              <li>Prevent fraud or security threats</li>
              <li>Cooperate with law enforcement</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              5.3 Business Transfers
            </h3>
            <p className="mb-4">
              In the event of a merger, acquisition, or sale of assets, your
              information may be transferred to the acquiring entity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">6. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information only as long as necessary for
              the purposes outlined in this policy:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>Active Accounts:</strong> For the duration of your
                account plus 2 years
              </li>
              <li>
                <strong>Project Files:</strong> For 3 years after project
                completion
              </li>
              <li>
                <strong>Financial Records:</strong> For 7 years (tax compliance)
              </li>
              <li>
                <strong>Marketing Data:</strong> Until you opt-out or request
                deletion
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">7. Your Privacy Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have the following rights:
            </p>

            <h3 className="mb-3 text-xl font-semibold">7.1 General Rights</h3>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate
                data
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a portable
                format
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing
                communications
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              7.2 California Privacy Rights (CCPA)
            </h3>
            <p className="mb-4">California residents have additional rights:</p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>
                Right to know if personal information is sold or disclosed
              </li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
            <p className="mb-4">
              <strong>Note:</strong> We do not sell your personal information.
            </p>

            <h3 className="mb-3 text-xl font-semibold">
              7.3 Virginia Privacy Rights (VCDPA)
            </h3>
            <p className="mb-4">Virginia residents have the right to:</p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Confirm whether we process their personal data</li>
              <li>Access their personal data</li>
              <li>Correct inaccuracies in their personal data</li>
              <li>Delete their personal data</li>
              <li>Obtain a copy of their personal data</li>
              <li>Opt-out of targeted advertising</li>
            </ul>

            <p className="mb-4">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:lumiloops.dev@gmail.com"
                className="text-primary hover:underline"
              >
                lumiloops.dev@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">8. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Encryption of data in transit (SSL/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
              <li>Secure cloud infrastructure</li>
            </ul>
            <p className="mb-4">
              However, no method of transmission over the Internet is 100%
              secure. While we strive to protect your data, we cannot guarantee
              absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              9. International Data Transfers
            </h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws.
            </p>
            <p className="mb-4">
              When we transfer data internationally, we ensure appropriate
              safeguards are in place, such as:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                Standard Contractual Clauses approved by the EU Commission
              </li>
              <li>Privacy Shield certification (where applicable)</li>
              <li>Adequacy decisions by relevant authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              10. Children&apos;s Privacy
            </h2>
            <p className="mb-4">
              Our Service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us
              immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">11. Third-Party Links</h2>
            <p className="mb-4">
              Our Service may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites. We
              encourage you to review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              12. Changes to This Privacy Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Posting the new policy on this page</li>
              <li>Updating the &quot;Last Updated&quot; date</li>
              <li>Sending an email notification (for significant changes)</li>
            </ul>
            <p className="mb-4">
              Your continued use of the Service after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">13. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or wish to
              exercise your privacy rights, please contact us:
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="mb-2">
                <strong>Lumi Loops</strong>
              </p>
              <p className="mb-2">Virginia, United States</p>
              <p className="mb-2">
                Email:{" "}
                <a
                  href="mailto:lumiloops.dev@gmail.com"
                  className="text-primary hover:underline"
                >
                  lumiloops.dev@gmail.com
                </a>
              </p>
            </div>
            <p className="mt-4">
              We will respond to your request within 30 days of receipt.
            </p>
          </section>
        </LegalPageLayout>
      </main>
      <Footer />
    </div>
  );
}
