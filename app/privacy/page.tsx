import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy — Thankly',
  description: 'Thankly LLC Privacy Policy and Data Retention Policy.',
}

export default function PrivacyPage() {
  return (
    <LegalLayout
      docNumber="01 & 11 of 14"
      audience="All Users"
      title="Privacy & Data Retention"
      effectiveDate="June 24, 2026"
      version="1.4"
      summary="Thankly does not sell your personal information. We do not serve third-party advertisements."
    >
      <p>This Privacy Policy explains what information Thankly LLC collects, how we use it, and the choices you have. By using the Platform, you agree to this policy.</p>

      {/* DOCUMENT 01 — PRIVACY POLICY */}
      <h2>1. Information We Collect</h2>
      <h3>1.1 Information You Provide</h3>
      <ul>
        <li>Account registration: name, email, phone number, preferred language</li>
        <li>Identity verification: government-issued ID, date of birth (required by Stripe for payment processing)</li>
        <li>Payment information: bank account or debit card (processed by Stripe; we never store raw card numbers)</li>
        <li>Profile: photo, job title, employer name, QR display preferences</li>
        <li>Support communications</li>
      </ul>

      <h3>1.2 Biometric Data — Collection and Retention</h3>
      <p>Stripe Identity may use facial recognition technology to compare a selfie against your government-issued ID during verification. This constitutes collection of a biometric identifier.</p>
      <p>Retention policy for ALL users:</p>
      <ul>
        <li>Biometric data is deleted by Stripe Identity upon successful verification, and in no event retained longer than 3 years from the date of collection</li>
        <li>Biometric data is never used for any purpose other than one-time identity verification</li>
        <li>Biometric data is never sold, leased, traded, shared with advertisers, or used to build any commercial profile</li>
        <li>Biometric data is processed and retained solely by Stripe; it is never transferred to Thankly servers</li>
      </ul>
      <p>State-specific protections:</p>
      <ul>
        <li><strong>Illinois residents (BIPA):</strong> Separate written consent screen before any biometric collection; written retention and destruction schedule available on request at <a href="mailto:hello@getthankly.com">hello@getthankly.com</a></li>
        <li><strong>Texas and Washington residents:</strong> Explicit in-app consent obtained before biometric processing</li>
        <li><strong>All other residents:</strong> Biometric processing occurs under Stripe's standard terms, accepted by proceeding with verification</li>
      </ul>

      <h3>1.3 Sensitive Personal Information (California CPRA)</h3>
      <p>Certain data we collect qualifies as Sensitive Personal Information (SPI) under the CPRA, including government-issued identification numbers. Thankly only collects and uses SPI to perform services specifically permitted under the CPRA (payment processing, identity verification, fraud prevention). Because our use is strictly limited to these permitted purposes, Thankly is not required to offer a "Limit the Use of My Sensitive Personal Information" opt-out link, and no such link is provided.</p>

      <h3>1.4 Information Collected Automatically</h3>
      <ul>
        <li>Device data: type, OS, browser, IP address</li>
        <li>Usage: pages viewed, features used, tap patterns</li>
        <li>Transactions: tip amounts, timestamps, payer city/region</li>
        <li>Approximate location from IP (no GPS unless you grant permission)</li>
      </ul>

      <h3>1.5 Information from Third Parties</h3>
      <ul>
        <li>Stripe: payment status, verification results, payout confirmations</li>
        <li>Businesses: your employer may provide your name and contact info if they enroll you</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Operate and improve the Platform</li>
        <li>Process tip payments</li>
        <li>Generate earnings reports and tax estimates</li>
        <li>Verify identity for payment and regulatory compliance</li>
        <li>Prevent fraud and comply with legal obligations</li>
        <li>Send transactional communications and (with consent) marketing</li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <ul>
        <li><strong>Stripe:</strong> for payment processing and KYC compliance</li>
        <li><strong>Service providers:</strong> hosting, analytics, support — bound by data processing agreements</li>
        <li><strong>Business accounts:</strong> name, tip totals, payout history only (never banking or identity details)</li>
        <li><strong>Legal authorities:</strong> when required by law, regulation, or court order</li>
        <li><strong>Business transfers:</strong> successor entity in a merger or acquisition</li>
      </ul>

      <h2>4. State-Specific Privacy Rights</h2>
      <h3>4.1 California (CCPA / CPRA)</h3>
      <p>Right to know, delete, correct, and opt out of sale or sharing of personal data. We do not sell personal data. Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> to exercise rights. No discrimination for exercising CCPA/CPRA rights.</p>
      <h3>4.2 Colorado and Virginia</h3>
      <p>Rights to access, correct, delete, portability, and opt out of targeted advertising. Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>.</p>
      <h3>4.3 Illinois (BIPA)</h3>
      <p>Written biometric consent obtained in-app before any collection. Written retention and destruction schedule available on request. Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>.</p>

      <h2>5. Data Retention</h2>
      <p>Account data retained for account lifetime plus 3 years. Transaction records retained 7 years. Identity verification records retained 5 years post-closure. Biometric data deleted on verification or within 3 years maximum. See Data Retention Policy below for the full schedule.</p>

      <h2>6. Security</h2>
      <p>TLS encryption in transit, access controls, and PCI DSS Level 1 payment handling via Stripe. We will notify you of breaches as required by applicable law.</p>

      <h2>7. Children's Privacy</h2>
      <p>Platform not directed to users under 18. Accounts belonging to minors will be deleted immediately upon discovery.</p>

      <h2>8. Your Rights</h2>
      <ul>
        <li>Access, correct, or delete your data</li>
        <li>Opt out of marketing at any time</li>
        <li>Request data portability (PDF or Excel)</li>
      </ul>
      <p>Contact: <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>. We respond within 30 days.</p>

      <h2>9. Changes to This Policy</h2>
      <p>Material changes notified 14 days in advance by email or in-app notice. Continued use constitutes acceptance.</p>

      <h2>10. Contact</h2>
      <p><a href="mailto:hello@getthankly.com">hello@getthankly.com</a> | Thankly LLC, Florida, United States</p>

      {/* DOCUMENT 11 — DATA RETENTION POLICY */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 11 of 14 — All Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Data Retention Policy</h2>
      </div>

      <h2>11. Why We Retain Data</h2>
      <p>To provide and improve services, comply with financial and tax regulations, resolve disputes, enforce agreements, and support workers' earnings documentation needs.</p>

      <h2>12. Retention Periods</h2>
      <table className="legal-table">
        <thead>
          <tr><th>Data Type</th><th>Retention Period</th><th>Legal Basis</th></tr>
        </thead>
        <tbody>
          <tr><td>Account & registration data</td><td>Account lifetime + 3 years</td><td>Legal compliance</td></tr>
          <tr><td>Transaction records</td><td>7 years</td><td>IRS / financial regulations</td></tr>
          <tr><td>Identity verification records</td><td>5 years post-closure</td><td>AML / KYC requirements</td></tr>
          <tr><td>Biometric data (if collected)</td><td>Deleted on verification or 3 years max</td><td>BIPA / state biometric laws</td></tr>
          <tr><td>Earnings reports</td><td>Available while account is active</td><td>User service</td></tr>
          <tr><td>Support communications</td><td>3 years</td><td>Dispute resolution</td></tr>
          <tr><td>Analytics / usage data</td><td>2 years</td><td>Service improvement</td></tr>
          <tr><td>Marketing consent records</td><td>3 years post opt-out</td><td>Consent documentation</td></tr>
        </tbody>
      </table>

      <h2>13. In-App Account Deletion — What Happens</h2>
      <p>Apple App Store guidelines require an in-app account deletion option. Thankly's deletion button initiates a two-phase process:</p>
      <h3>Phase 1: Immediate Deletion (within 30 days of request)</h3>
      <ul>
        <li>Name, email, phone, and profile photo</li>
        <li>Display name and QR code (QR deactivated immediately upon request)</li>
        <li>Login credentials and authentication tokens</li>
        <li>Device identifiers and push notification tokens</li>
        <li>Account settings and configuration data</li>
        <li>Support communications not required for pending disputes</li>
      </ul>
      <h3>Phase 2: Legally Required Archival (retained per schedule above)</h3>
      <ul>
        <li>Transaction records: retained 7 years per IRS financial recordkeeping requirements</li>
        <li>Identity verification records: retained 5 years per AML/BSA (held by Stripe, not Thankly)</li>
        <li>Records subject to a pending legal hold, investigation, or dispute</li>
      </ul>
      <div className="info-box">Archived compliance records are stored in a restricted-access environment, used for no commercial purpose, and inaccessible to any Thankly product team. They exist solely to satisfy IRS audit and financial regulatory requirements.</div>
      <p>A written confirmation email is sent specifying what was deleted immediately and what is being archived and for how long.</p>

      <h2>14. Deletion Requests Outside the App</h2>
      <p>Email <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>. The same two-phase process applies. We respond within 30 days.</p>

      <h2>15. Third-Party Data</h2>
      <p>Stripe retains payment and identity data under its own legally mandated schedules. Requests regarding Stripe-held data must be directed to Stripe.</p>
    </LegalLayout>
  )
}
