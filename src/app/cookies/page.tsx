import { Metadata } from "next";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Cookie Policy | Lumi Loops",
  description:
    "Cookie Policy for Lumi Loops. Learn about how we use cookies and similar technologies on our website.",
};

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LegalPageLayout title="Cookie Policy" lastUpdated="January 21, 2025">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">1. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your device
              (computer, smartphone, or tablet) when you visit a website. They
              are widely used to make websites work more efficiently and provide
              information to website owners.
            </p>
            <p className="mb-4">
              Cookies help us understand how you use our website, remember your
              preferences, and improve your overall experience. This Cookie
              Policy explains what cookies we use and why.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              2. Types of Cookies We Use
            </h2>

            <h3 className="mb-3 text-xl font-semibold">
              2.1 Strictly Necessary Cookies
            </h3>
            <p className="mb-4">
              These cookies are essential for the website to function properly.
              They enable core functionality such as security, network
              management, and accessibility.
            </p>
            <div className="bg-muted/50 mb-4 rounded-lg p-4">
              <p className="mb-2">
                <strong>Examples:</strong>
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Session cookies for maintaining your login state</li>
                <li>Security cookies for fraud prevention</li>
                <li>Load balancing cookies for website performance</li>
              </ul>
              <p className="mt-3 text-sm">
                <strong>Duration:</strong> Session (deleted when you close your
                browser)
              </p>
              <p className="text-sm">
                <strong>Can be disabled:</strong> No (required for website
                functionality)
              </p>
            </div>

            <h3 className="mb-3 text-xl font-semibold">
              2.2 Performance and Analytics Cookies
            </h3>
            <p className="mb-4">
              These cookies collect information about how visitors use our
              website, such as which pages are visited most often and if users
              receive error messages.
            </p>
            <div className="bg-muted/50 mb-4 rounded-lg p-4">
              <p className="mb-2">
                <strong>Examples:</strong>
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Google Analytics cookies (_ga, _gid, _gat)</li>
                <li>Page view tracking</li>
                <li>Session duration tracking</li>
                <li>Bounce rate measurement</li>
              </ul>
              <p className="mt-3 text-sm">
                <strong>Duration:</strong> Up to 2 years
              </p>
              <p className="text-sm">
                <strong>Can be disabled:</strong> Yes (through cookie settings)
              </p>
            </div>

            <h3 className="mb-3 text-xl font-semibold">
              2.3 Functionality Cookies
            </h3>
            <p className="mb-4">
              These cookies allow the website to remember choices you make (such
              as your language preference or theme selection) and provide
              enhanced, personalized features.
            </p>
            <div className="bg-muted/50 mb-4 rounded-lg p-4">
              <p className="mb-2">
                <strong>Examples:</strong>
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Language preference cookies</li>
                <li>Theme selection (light/dark mode)</li>
                <li>Video player settings</li>
                <li>Font size preferences</li>
              </ul>
              <p className="mt-3 text-sm">
                <strong>Duration:</strong> Up to 1 year
              </p>
              <p className="text-sm">
                <strong>Can be disabled:</strong> Yes (may affect functionality)
              </p>
            </div>

            <h3 className="mb-3 text-xl font-semibold">
              2.4 Targeting and Advertising Cookies
            </h3>
            <p className="mb-4">
              These cookies are used to deliver advertisements more relevant to
              you and your interests. They also help limit the number of times
              you see an advertisement and measure the effectiveness of
              advertising campaigns.
            </p>
            <div className="bg-muted/50 mb-4 rounded-lg p-4">
              <p className="mb-2">
                <strong>Examples:</strong>
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Google Ads cookies</li>
                <li>Facebook Pixel</li>
                <li>Retargeting cookies</li>
                <li>Conversion tracking</li>
              </ul>
              <p className="mt-3 text-sm">
                <strong>Duration:</strong> Up to 2 years
              </p>
              <p className="text-sm">
                <strong>Can be disabled:</strong> Yes (through cookie settings)
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">3. Third-Party Cookies</h2>
            <p className="mb-4">
              We use services from third-party companies that may set cookies on
              your device. These companies have their own privacy policies:
            </p>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="mb-2 font-semibold">Google Analytics</p>
                <p className="mb-2 text-sm">
                  Used for website analytics and understanding user behavior.
                </p>
                <p className="text-sm">
                  Privacy Policy:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://policies.google.com/privacy
                  </a>
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="mb-2 font-semibold">Google Ads</p>
                <p className="mb-2 text-sm">
                  Used for advertising and remarketing purposes.
                </p>
                <p className="text-sm">
                  Privacy Policy:{" "}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://policies.google.com/technologies/ads
                  </a>
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="mb-2 font-semibold">Facebook Pixel</p>
                <p className="mb-2 text-sm">
                  Used for social media advertising and analytics.
                </p>
                <p className="text-sm">
                  Privacy Policy:{" "}
                  <a
                    href="https://www.facebook.com/privacy/explanation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://www.facebook.com/privacy/explanation
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              4. How to Manage Cookies
            </h2>
            <p className="mb-4">
              You have the right to decide whether to accept or reject cookies.
              You can manage your cookie preferences through:
            </p>

            <h3 className="mb-3 text-xl font-semibold">4.1 Browser Settings</h3>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their
              settings. Here&apos;s how to manage cookies in popular browsers:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>Google Chrome:</strong> Settings → Privacy and security
                → Cookies and other site data
              </li>
              <li>
                <strong>Firefox:</strong> Settings → Privacy & Security →
                Cookies and Site Data
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Cookies and
                website data
              </li>
              <li>
                <strong>Edge:</strong> Settings → Cookies and site permissions →
                Cookies and site data
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">4.2 Opt-Out Tools</h3>
            <p className="mb-4">
              You can opt out of targeted advertising cookies using these tools:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Digital Advertising Alliance Opt-Out
                </a>
              </li>
              <li>
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Network Advertising Initiative Opt-Out
                </a>
              </li>
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Analytics Opt-Out Browser Add-on
                </a>
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              4.3 Mobile Device Settings
            </h3>
            <p className="mb-4">
              On mobile devices, you can limit ad tracking:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>iOS:</strong> Settings → Privacy → Tracking → Allow Apps
                to Request to Track
              </li>
              <li>
                <strong>Android:</strong> Settings → Google → Ads → Opt out of
                Ads Personalization
              </li>
            </ul>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
              <p className="text-sm">
                <strong>Note:</strong> Blocking or deleting cookies may impact
                your experience on our website. Some features may not function
                properly without cookies.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">5. Do Not Track Signals</h2>
            <p className="mb-4">
              Some browsers include a &quot;Do Not Track&quot; (DNT) feature
              that signals to websites that you do not want to be tracked.
              Currently, there is no industry standard for how to respond to DNT
              signals.
            </p>
            <p className="mb-4">
              We respect your privacy choices. If you enable DNT, we will honor
              it for analytics cookies, though strictly necessary cookies will
              still be used for website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">6. Cookie Lifespan</h2>
            <p className="mb-4">
              Cookies can be either &quot;session&quot; or
              &quot;persistent&quot; cookies:
            </p>
            <ul className="mb-4 ml-6 list-disc space-y-2">
              <li>
                <strong>Session Cookies:</strong> Temporary cookies that are
                deleted when you close your browser
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Remain on your device for a
                set period (up to 2 years) or until you delete them
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              7. Updates to This Policy
            </h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for legal, operational, or regulatory
              reasons. We will notify you of significant changes by posting the
              updated policy on this page with a new &quot;Last Updated&quot;
              date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">8. More Information</h2>
            <p className="mb-4">
              For more information about how we use your personal data, please
              see our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
            <p className="mb-4">
              If you have questions about our use of cookies, please contact us:
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
            <h2 className="mb-4 text-2xl font-bold">9. Useful Resources</h2>
            <p className="mb-4">
              To learn more about cookies and online privacy, visit:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <a
                  href="https://www.allaboutcookies.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  All About Cookies
                </a>
              </li>
              <li>
                <a
                  href="https://www.youronlinechoices.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Your Online Choices
                </a>
              </li>
              <li>
                <a
                  href="https://ico.org.uk/for-the-public/online/cookies/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ICO Cookie Guidance
                </a>
              </li>
            </ul>
          </section>
        </LegalPageLayout>
      </main>
      <Footer />
    </div>
  );
}
