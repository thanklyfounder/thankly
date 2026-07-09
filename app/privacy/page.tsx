import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy — Thankly',
  description: 'Thankly LLC Privacy Policy and Data Retention Policy.',
}

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'collect', label: 'What we collect' },
  { id: 'use', label: 'How we use it' },
  { id: 'share', label: 'How we share it' },
  { id: 'rights', label: 'Your rights by state' },
  { id: 'retention', label: 'Data retention' },
  { id: 'deletion', label: 'Account deletion' },
  { id: 'security', label: 'Security & contact' },
]

export default function PrivacyPage() {
  return (
    <LegalLayout
      badge="Privacy"
      title="Privacy & how we handle your data"
      description="We don't sell your information and we don't run ads. Here's exactly what we collect, why, and how long we keep it."
      effectiveDate="June 24, 2026"
      version="1.5"
      sections={sections}
    >
      <section id="overview">
        <p>This Privacy Policy explains what information Thankly LLC collects, how we use it, and the choices you have. By using the Platform, you agree to this policy.</p>
        <div className="info-box">Thankly does not sell your personal information. We do not serve third-party advertisements.</div>
      </section>

      <section id="collect">
        <h2>What we collect</h2>

        <h3>Information you provide</h3>
        <ul>
          <li>Account registration: name, email, phone number, preferred language</li>
          <li>Identity verification: government-issued ID, date of birth (required by Stripe for payment processing)</li>
          <li>Payment information: bank account or debit card (processed by Stripe; we never store raw card numbers)</li>
          <li>Profile: photo, job title, employer name, QR display preferences</li>
          <li>Support communications</li>
        </ul>

        <h3>Biometric data — collection and retention</h3>
        <p>Stripe Identity may use facial recognition technology to compare a selfie against your government-issued ID during verification. This constitutes collection of a biometric identifier.</p>
        <p>Retention policy for all users:</p>
        <ul>
          <li>Biometric data is deleted by Stripe Identity upon successful verification, and in no event retained longer than 3 years from the date of collection</li>
          <li>Biometric data is never used for any purpose other than one-time identity verification</li>
          <li>Biometric data is never sold, leased, traded, shared with advertisers, or used to build any commercial profile</li>
          <li>Biometric data is processed and retained solely by Stripe; it is never transferred to Thankly servers</li>
        </ul>
        <p>State-specific protections:</p>
        <ul>
          <li><strong>Illinois residents (BIPA):</strong> separate written consent screen before any biometric collection; written retention and destruction schedule available on request at <a href="mailto:hello@getthankly.com">hello@getthankly.com</a></li>
          <li><strong>Texas and Washington residents:</strong> explicit in-app consent obtained before biometric processing</li>
          <li><strong>All other residents:</strong> biometric processing occurs under Stripe&#x2019;s standard terms, accepted by proceeding with verification</li>
        </ul>

        <h3>Sensitive Personal Information (California CPRA)</h3>
        <p>Certain data we collect qualifies as Sensitive Personal Information (SPI) under the CPRA, including government-issued identification numbers. Thankly only collects and uses SPI to perform services specifically permitted under the CPRA (payment processing, identity verification, fraud prevention). Because our use is strictly limited to these permitted purposes, Thankly is not required to offer a &#x201C;Limit the Use of My Sensitive Personal Information&#x201D; opt-out link, and no such link is provided.</p>

        <h3>Information collected automatically</h3>
        <ul>
          <li>Device data: type, OS, browser, IP address</li>
          <li>Usage: pages viewed, features used, tap patterns</li>
          <li>Transactions: tip amounts, timestamps, payer city/region</li>
          <li>Approximate location from IP (no GPS unless you grant permission)</li>
        </ul>

        <h3>Information from third parties</h3>
        <ul>
          <li>Stripe: payment status, verification results, payout confirmations</li>
          <li>Businesses: your employer may provide your name and contact info if they enroll you</li>
        </ul>
      </section>

      <section id="use">
        <h2>How we use it</h2>
        <ul>
          <li>Operate and improve the Platform</li>
          <li>Process tip payments</li>
          <li>Generate earnings reports and tax estimates</li>
          <li>Verify identity for payment and regulatory compliance</li>
          <li>Prevent fraud and comply with legal obligations</li>
          <li>Send transactional communications and (with consent) marketing</li>
        </ul>

        <h3>SMS communications and security</h3>
        <p>Thankly utilizes SMS messaging exclusively for account authentication and security-related notifications, such as one-time passwords (OTP). We collect your mobile number when you provide it during registration and consent to receive these messages. We do not use your phone number for marketing or promotional purposes.</p>
        <p><strong>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.</strong> All other categories of data sharing described in this policy exclude text-messaging originator opt-in data and consent; this information will not be shared with any third parties. We may share your mobile number only with trusted service providers (such as Twilio, our SMS delivery provider) who assist us in operating the verification messaging program, and only to deliver those messages on our behalf.</p>
        <p>Message frequency: messages are sent only during account signup and authentication. Message and data rates may apply depending on your mobile carrier plan. Reply STOP to opt out, HELP for help, or contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> for assistance.</p>
        <p>SMS messages are sent from our registered number +1 (407) 759-7255 via Twilio, our A2P 10DLC registered SMS provider, under the &#x201C;Two-Factor Authentication&#x201D; use case, covering all OTP and verification messages sent during account signup and authentication.</p>
      </section>

      <section id="share">
        <h2>How we share it</h2>
        <ul>
          <li><strong>Stripe:</strong> for payment processing and KYC compliance</li>
          <li><strong>Service providers:</strong> hosting, analytics, support — bound by data processing agreements</li>
          <li><strong>Business accounts:</strong> name, tip totals, payout history only (never banking or identity details)</li>
          <li><strong>Legal authorities:</strong> when required by law, regulation, or court order</li>
          <li><strong>Business transfers:</strong> successor entity in a merger or acquisition</li>
        </ul>
      </section>

      <section id="rights">
        <h2>Your rights by state</h2>

        <h3>California (CCPA / CPRA)</h3>
        <p>Right to know, delete, correct, and opt out of sale or sharing of personal data. We do not sell personal data. Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> to exercise rights. No discrimination for exercising CCPA/CPRA rights.</p>

        <h3>Colorado and Virginia</h3>
        <p>Rights to access, correct, delete, portability, and opt out of targeted advertising. Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>.</p>

        <h3>Illinois (BIPA)</h3>
        <p>Written biometric consent obtained in-app before any collection. Written retention and destruction schedule available on request. Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>.</p>

        <h3>Children&#x2019;s privacy</h3>
        <p>The Platform is not directed to users under 18. Accounts belonging to minors will be deleted immediately upon discovery.</p>

        <h3>Your general rights</h3>
        <ul>
          <li>Access, correct, or delete your data</li>
          <li>Opt out of marketing at any time</li>
          <li>Request data portability (PDF or Excel)</li>
        </ul>
        <p>Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>. We respond within 30 days.</p>
      </section>

      <section id="retention">
        <h2>Data retention</h2>
        <p>We retain account data for the account lifetime plus 3 years. Transaction records are retained 7 years. Identity verification records are retained 5 years post-closure. Biometric data is deleted on verification or within 3 years maximum.</p>

        <table>
          <thead>
            <tr><th>Data type</th><th>Retention period</th><th>Legal basis</th></tr>
          </thead>
          <tbody>
            <tr><td>Account &amp; registration data</td><td>Account lifetime + 3 years</td><td>Legal compliance</td></tr>
            <tr><td>Transaction records</td><td>7 years</td><td>IRS / financial regulations</td></tr>
            <tr><td>Identity verification records</td><td>5 years post-closure</td><td>AML / KYC requirements</td></tr>
            <tr><td>Biometric data (if collected)</td><td>Deleted on verification or 3 years max</td><td>BIPA / state biometric laws</td></tr>
            <tr><td>Earnings reports</td><td>Available while account is active</td><td>User service</td></tr>
            <tr><td>Support communications</td><td>3 years</td><td>Dispute resolution</td></tr>
            <tr><td>Analytics / usage data</td><td>2 years</td><td>Service improvement</td></tr>
            <tr><td>Marketing consent records</td><td>3 years post opt-out</td><td>Consent documentation</td></tr>
          </tbody>
        </table>

        <p>We retain this data to provide and improve services, comply with financial and tax regulations, resolve disputes, enforce agreements, and support workers&#x2019; earnings documentation needs.</p>
      </section>

      <section id="deletion">
        <h2>Account deletion</h2>
        <p>Apple App Store guidelines require an in-app account deletion option. Thankly&#x2019;s deletion button initiates a two-phase process.</p>

        <h3>Phase 1 — immediate deletion (within 30 days)</h3>
        <ul>
          <li>Name, email, phone, and profile photo</li>
          <li>Display name and QR code (QR deactivated immediately upon request)</li>
          <li>Login credentials and authentication tokens</li>
          <li>Device identifiers and push notification tokens</li>
          <li>Account settings and configuration data</li>
          <li>Support communications not required for pending disputes</li>
        </ul>

        <h3>Phase 2 — legally required archival</h3>
        <ul>
          <li>Transaction records: retained 7 years per IRS financial recordkeeping requirements</li>
          <li>Identity verification records: retained 5 years per AML/BSA (held by Stripe, not Thankly)</li>
          <li>Records subject to a pending legal hold, investigation, or dispute</li>
        </ul>
        <div className="info-box">Archived compliance records are stored in a restricted-access environment, used for no commercial purpose, and inaccessible to any Thankly product team. They exist solely to satisfy IRS audit and financial regulatory requirements.</div>
        <p>A written confirmation email is sent specifying what was deleted immediately and what is being archived, and for how long.</p>
        <p>To request deletion outside the app, email <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>. The same two-phase process applies. We respond within 30 days.</p>
        <p>Stripe retains payment and identity data under its own legally mandated schedules. Requests regarding Stripe-held data must be directed to Stripe.</p>
      </section>

      <section id="security">
        <h2>Security &amp; contact</h2>
        <p>We use TLS encryption in transit, access controls, and PCI DSS Level 1 payment handling via Stripe. We will notify you of breaches as required by applicable law.</p>

        <h3>Changes to this policy</h3>
        <p>Material changes are communicated 14 days in advance by email or in-app notice. Continued use constitutes acceptance.</p>

        <h3>Contact</h3>
        <p><a href="mailto:hello@getthankly.com">hello@getthankly.com</a> &middot; Thankly LLC, Florida, United States</p>
      </section>
    </LegalLayout>
  )
}