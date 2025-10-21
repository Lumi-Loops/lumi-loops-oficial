import { Metadata } from "next";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service | Lumi Loops",
  description:
    "Terms of Service for Lumi Loops video creation services. Read our terms and conditions for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LegalPageLayout
          title="Terms of Service"
          lastUpdated="January 21, 2025"
        >
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using Lumi Loops (&quot;Service&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to
              be bound by these Terms of Service (&quot;Terms&quot;). If you
              disagree with any part of these terms, you may not access the
              Service.
            </p>
            <p className="mb-4">
              Lumi Loops is operated from Virginia, United States, and these
              Terms are governed by the laws of the Commonwealth of Virginia and
              applicable federal laws of the United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              2. Description of Service
            </h2>
            <p className="mb-4">
              Lumi Loops provides professional video content creation services
              for social media platforms, including but not limited to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                Short-form video content (TikTok, Instagram Reels, YouTube
                Shorts)
              </li>
              <li>Long-form video content (YouTube)</li>
              <li>Stories and ephemeral content</li>
              <li>Educational and tutorial videos</li>
              <li>Promotional and advertising content</li>
            </ul>
            <p className="mb-4">
              We combine AI-assisted tools with human creativity to deliver
              custom, brand-aligned video content optimized for various social
              media platforms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              3. User Accounts and Registration
            </h2>
            <p className="mb-4">
              To use certain features of our Service, you may be required to
              provide information about yourself. You agree to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your information</li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              4. Service Plans and Pricing
            </h2>
            <p className="mb-4">
              We offer various service plans with different features and
              pricing. All prices are in U.S. Dollars (USD) and are subject to
              change with notice.
            </p>
            <h3 className="mb-3 text-xl font-semibold">4.1 Payment Terms</h3>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>One-time payments are due before project commencement</li>
              <li>Monthly subscriptions are billed in advance</li>
              <li>
                All payments are processed through secure third-party payment
                processors
              </li>
              <li>You are responsible for all applicable taxes</li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold">4.2 Refund Policy</h3>
            <p className="mb-4">
              Due to the custom nature of our services, refunds are handled on a
              case-by-case basis. We strive for 100% client satisfaction and
              will work with you to resolve any issues before considering
              refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              5. Intellectual Property Rights
            </h2>
            <h3 className="mb-3 text-xl font-semibold">5.1 Client Content</h3>
            <p className="mb-4">
              You retain all rights to content you provide to us (logos, brand
              materials, etc.). By submitting content, you grant us a limited
              license to use it solely for creating your requested videos.
            </p>
            <h3 className="mb-3 text-xl font-semibold">5.2 Delivered Videos</h3>
            <p className="mb-4">
              Upon full payment, you receive commercial usage rights to the
              final delivered videos. This includes the right to:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Post on your social media platforms</li>
              <li>Use in advertising and marketing campaigns</li>
              <li>Modify or edit the videos as needed</li>
              <li>Use for commercial purposes</li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold">5.3 Portfolio Rights</h3>
            <p className="mb-4">
              We reserve the right to showcase completed projects in our
              portfolio and marketing materials unless otherwise agreed in
              writing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              6. Delivery and Revisions
            </h2>
            <h3 className="mb-3 text-xl font-semibold">
              6.1 Delivery Timeline
            </h3>
            <p className="mb-4">
              Standard delivery times are estimates and may vary based on
              project complexity and current workload. We will communicate any
              delays promptly.
            </p>
            <h3 className="mb-3 text-xl font-semibold">6.2 Revision Policy</h3>
            <p className="mb-4">
              Each plan includes a specified number of revision rounds.
              Additional revisions may incur extra charges. Revisions must be
              requested within 7 days of delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">7. Prohibited Uses</h2>
            <p className="mb-4">You agree not to use our Service to:</p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Create content that violates any laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Create misleading, fraudulent, or deceptive content</li>
              <li>Promote hate speech, violence, or discrimination</li>
              <li>Create adult or explicit content without prior agreement</li>
              <li>
                Violate platform guidelines of target social media platforms
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              8. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Lumi Loops shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to loss of profits,
              data, or goodwill.
            </p>
            <p className="mb-4">
              Our total liability for any claims arising from these Terms or the
              Service shall not exceed the amount you paid us in the 12 months
              preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">9. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless Lumi Loops and its
              officers, directors, employees, and agents from any claims,
              damages, losses, liabilities, and expenses (including attorney
              fees) arising from:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Content you provide to us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">10. Termination</h2>
            <p className="mb-4">
              We reserve the right to terminate or suspend your access to the
              Service immediately, without prior notice, for any reason,
              including but not limited to breach of these Terms.
            </p>
            <p className="mb-4">
              Upon termination, your right to use the Service will cease
              immediately. Provisions that by their nature should survive
              termination shall survive, including intellectual property rights,
              limitation of liability, and dispute resolution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">11. Dispute Resolution</h2>
            <h3 className="mb-3 text-xl font-semibold">11.1 Governing Law</h3>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of the Commonwealth of Virginia, without regard to its
              conflict of law provisions.
            </p>
            <h3 className="mb-3 text-xl font-semibold">11.2 Arbitration</h3>
            <p className="mb-4">
              Any dispute arising from these Terms or the Service shall be
              resolved through binding arbitration in accordance with the rules
              of the American Arbitration Association, conducted in Virginia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">12. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. We will
              notify users of material changes via email or through the Service.
              Your continued use of the Service after changes constitutes
              acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">13. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms, please contact us at:
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
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">14. Severability</h2>
            <p className="mb-4">
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision shall be limited or eliminated to the
              minimum extent necessary, and the remaining provisions shall
              remain in full force and effect.
            </p>
          </section>
        </LegalPageLayout>
      </main>
      <Footer />
    </div>
  );
}
