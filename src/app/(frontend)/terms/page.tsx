import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Dubai Estate Guide",
  description:
    "Read the Terms of Service governing your use of Dubai Estate Guide.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            {" / "}Terms of Service
          </p>
          <h1 className="text-4xl font-bold text-foreground mb-3">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Updated on March 16, 2026</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-10 text-foreground">

          <p className="text-muted-foreground leading-relaxed">
            These Terms of Service (&ldquo;Agreement&rdquo;) govern your use of the website and services provided by
            Dubai Estate Guide (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) available at{" "}
            <a href="https://dubaiestateguide.com/" className="text-yellow-600 dark:text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
              https://dubaiestateguide.com/
            </a>
            . By accessing or using our website, you agree to comply with these Terms.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Services</h2>
            <p className="text-muted-foreground mb-4">Dubai Estate Guide provides an online platform where users can:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Browse property listings</li>
              <li>Submit property inquiries</li>
              <li>Request callbacks or additional information about properties</li>
            </ul>
            <p className="text-muted-foreground">
              Dubai Estate Guide is not a party to any property transactions between users and third parties unless
              explicitly stated otherwise. Any agreements related to property purchases, rentals, or services are made
              directly between users and the respective third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p className="text-muted-foreground mb-4">When using our services, you agree that:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>You will provide accurate, current, and complete information when submitting inquiries or registering on the website.</li>
              <li>You are responsible for maintaining the confidentiality of any login credentials or account information.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms or engage in suspicious or harmful activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">
              When using{" "}
              <a href="https://dubaiestateguide.com/" className="text-yellow-600 dark:text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
                https://dubaiestateguide.com/
              </a>
              , you agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Scrape, copy, or extract data from the website using automated tools.</li>
              <li>Reverse engineer, hack, or attempt to compromise website security.</li>
              <li>Post or submit illegal, misleading, harmful, or fraudulent content.</li>
              <li>Use property information for commercial purposes without permission.</li>
            </ul>
            <p className="text-muted-foreground">
              Property data and content available on our website are intended solely for personal browsing and
              legitimate property inquiries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Content &amp; Intellectual Property Rights</h2>
            <p className="text-muted-foreground mb-4">All materials available on Dubai Estate Guide, including:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Property descriptions</li>
              <li>Images and media</li>
              <li>Logos and branding</li>
              <li>Website design and content</li>
            </ul>
            <p className="text-muted-foreground">
              are owned by Dubai Estate Guide or its partners and licensors. You may not reproduce, copy, distribute,
              modify, or publish any content from this website without prior written permission, except where allowed
              by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The services provided on{" "}
              <a href="https://dubaiestateguide.com/" className="text-yellow-600 dark:text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
                https://dubaiestateguide.com/
              </a>
              {" "}are offered &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind.
            </p>
            <p className="text-muted-foreground mb-4">We do not guarantee:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Accuracy or completeness of property information</li>
              <li>Continuous availability of the website</li>
              <li>That the service will be free from errors or interruptions</li>
            </ul>
            <p className="text-muted-foreground">
              Property details, prices, and availability may be provided by third parties and may change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              To the maximum extent permitted by law, Dubai Estate Guide shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Decisions made based on information found on the website</li>
            </ul>
            <p className="text-muted-foreground">
              If any liability is established, our total liability will be limited to the amount you paid for services
              through the website during the last three (3) months, if applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to These Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to update or modify these Terms of Service at any time. Any changes will be posted
              on this page with an updated date. Continued use of{" "}
              <a href="https://dubaiestateguide.com/" className="text-yellow-600 dark:text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
                https://dubaiestateguide.com/
              </a>
              {" "}after updates means you accept the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed by and interpreted in accordance with applicable laws of the jurisdiction
              in which Dubai Estate Guide operates, unless mandatory local laws provide otherwise.
            </p>
            <p className="text-muted-foreground">
              Any disputes should first be resolved amicably. If a resolution cannot be reached, disputes will be
              handled in the appropriate courts of jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions regarding these Terms of Service, please contact us:
            </p>
            <div className="text-muted-foreground space-y-2">
              <p><strong className="text-foreground">Dubai Estate Guide</strong></p>
              <p>
                Website:{" "}
                <a href="https://dubaiestateguide.com/" className="text-yellow-600 dark:text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  https://dubaiestateguide.com/
                </a>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:info@dubaiestateguide.com" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                  info@dubaiestateguide.com
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
