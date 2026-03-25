import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Dubai Estate Guide",
  description:
    "Learn how Dubai Estate Guide collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            {" / "}Privacy Policy
          </p>
          <h1 className="text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Updated on March 16, 2026</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-10 text-foreground">

          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy explains how Dubai Estate Guide (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects,
            uses, and protects your personal data when you use our website and services available at{" "}
            <a href="https://dubaiestateguide.com/" className="text-yellow-600 dark:text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
              https://dubaiestateguide.com/
            </a>
            , including browsing property listings, submitting inquiries, and requesting callbacks.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We may collect the following types of information when you use our website:</p>

            <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Inquiry Data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
              <li>Content of your request</li>
              <li>Properties of interest</li>
              <li>Preferences related to property searches</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Technical Data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
              <li>IP address</li>
              <li>Cookies</li>
              <li>Device identifiers</li>
              <li>Log data</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Usage Data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Pages visited on https://dubaiestateguide.com/</li>
              <li>Clicks and interactions</li>
              <li>Traffic sources and browsing behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Legal Basis</h2>
            <p className="text-muted-foreground mb-4">We process your personal data based on the following legal grounds:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Contract performance or steps requested by you before entering into a contract</li>
              <li>Legitimate interests, such as improving our services, analytics, and security</li>
              <li>Your consent, including for marketing communications and cookies</li>
              <li>Legal obligations where applicable</li>
            </ul>
            <p className="text-muted-foreground mt-4">Where required, we comply with applicable data protection regulations including GDPR.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Purposes of Data Processing</h2>
            <p className="text-muted-foreground mb-4">Your information may be used for the following purposes:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Responding to inquiries and contacting you regarding property listings</li>
              <li>Providing relevant property recommendations</li>
              <li>Improving website performance and user experience</li>
              <li>Conducting analytics and traffic analysis</li>
              <li>Sending marketing communications (only with your consent)</li>
              <li>Preventing fraud and complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing &amp; Retention</h2>
            <p className="text-muted-foreground mb-4">We may share data with trusted service providers such as:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Web hosting providers</li>
              <li>Analytics services</li>
              <li>CRM systems</li>
              <li>Technical contractors supporting our website</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              These partners process data under strict confidentiality agreements and applicable data protection safeguards.
              If data is transferred outside your country, we ensure appropriate protection measures such as Standard Contractual Clauses (SCCs).
            </p>
            <h3 className="text-lg font-semibold mb-2">Data Retention Periods</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Inquiry data: up to 36 months</li>
              <li>Technical logs: up to 12 months</li>
              <li>Longer retention may apply if required by law or for legal claims</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location and applicable laws, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (right to be forgotten)</li>
              <li>Restrict or object to certain types of processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              You also have the right to lodge a complaint with a relevant data protection authority.
            </p>
            <p className="text-muted-foreground">
              To exercise any of these rights, please contact us at:{" "}
              <a href="mailto:info@dubaiestateguide.com" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                info@dubaiestateguide.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>HTTPS encryption</li>
              <li>Secure servers</li>
              <li>Restricted access to personal data</li>
              <li>Monitoring systems for suspicious activities</li>
            </ul>
            <p className="text-muted-foreground">
              While we strive to protect your data, no method of transmission over the Internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            <div className="text-muted-foreground space-y-2">
              <p><strong className="text-foreground">Dubai Estate Guide</strong></p>
              <p>
                Website:{" "}
                <a href="https://dubaiestateguide.com/" className="text-yellow-600 dark:text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  https://dubaiestateguide.com/
                </a>
              </p>
              <p>
                For privacy-related inquiries, please contact:{" "}
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
