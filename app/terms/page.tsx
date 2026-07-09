import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Terms of Service — Thankly',
  description: 'Thankly Terms of Service, Electronic Consent, Acceptable Use, Refund Policy, QR Code Disclosure, and Business Dashboard Terms.',
}

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'accounts', label: 'Accounts & eligibility' },
  { id: 'stripe', label: 'Stripe & payments' },
  { id: 'appstore', label: 'App store terms' },
  { id: 'conduct', label: 'Acceptable use' },
  { id: 'content', label: 'Content & copyright' },
  { id: 'refunds', label: 'Refunds & chargebacks' },
  { id: 'qr', label: 'QR code & public profile' },
  { id: 'electronic', label: 'Electronic consent' },
  { id: 'disputes', label: 'Disputes & arbitration' },
  { id: 'business', label: 'Business accounts' },
  { id: 'general', label: 'General terms' },
]

export default function TermsPage() {
  return (
    <LegalLayout
      badge="Terms"
      title="Terms of service"
      description="The rules for using Thankly, written as plainly as a legal agreement allows. By creating an account, you agree to these terms."
      effectiveDate="June 24, 2026"
      version="1.5"
      sections={sections}
    >
      <section id="overview">
        <p>By creating an account or using the Platform, you agree to these Terms. If you do not agree, do not use the Platform.</p>

        <h3>Definitions</h3>
        <ul>
          <li><strong>Platform:</strong> the Thankly website, mobile app (iOS and Android), and all associated services</li>
          <li><strong>Worker User:</strong> a service industry professional who receives tips and uses earnings tools</li>
          <li><strong>Customer User:</strong> a person who sends a tip via QR code without a Thankly account</li>
          <li><strong>Business User:</strong> a legal entity managing a team of Worker Users on the Platform</li>
          <li><strong>Stripe:</strong> Stripe, Inc., the third-party payment processor used by the Platform</li>
          <li><strong>Transaction:</strong> any tip payment initiated by a Customer User through the Platform</li>
          <li><strong>Payout:</strong> disbursement of net tip proceeds to a Worker&#x2019;s linked bank account or debit card via Stripe</li>
        </ul>

        <h3>About Thankly</h3>
        <p>Thankly enables cashless tipping and earnings documentation for service industry workers. Thankly is not a bank, payroll provider, or tax advisor.</p>
      </section>

      <section id="accounts">
        <h2>Accounts &amp; eligibility</h2>
        <ul>
          <li>Must be 18 or older</li>
          <li>Must be authorized to receive payments in the United States</li>
          <li>Must provide accurate registration information</li>
          <li>One account per person</li>
          <li>Business accounts must be registered legal entities</li>
        </ul>

        <h3>QR code and profile</h3>
        <p>You receive a unique QR code linked to your public profile. You control your display name and photo and are responsible for profile accuracy.</p>

        <h3>SMS verification</h3>
        <p>Account registration and login require phone number verification via SMS one-time password (OTP). By providing your phone number, you consent to receive security-related SMS messages from Thankly. Messages are sent exclusively for authentication purposes from our registered number +1 (407) 759-7255. We do not use your phone number for marketing. <strong>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.</strong> Message and data rates may apply.</p>

        <h3>Platform fee</h3>
        <p>A fee is charged per transaction as displayed at time of payment. Current rates at getthankly.com/fees. Rate changes are communicated 30 days in advance.</p>

        <h3>Earnings reports</h3>
        <p>PDF and Excel reports are informational tools only, not audited statements.</p>
      </section>

      <section id="stripe">
        <h2>Stripe &amp; payments</h2>
        <p>Tips are processed via Stripe Connect. By registering as a Worker User, you agree to the <a href="https://stripe.com/connect-account/legal" target="_blank" rel="noopener noreferrer">Stripe Connected Account Agreement</a>. You must complete KYC verification before receiving payouts.</p>
        <p>Thankly operates as a platform on top of Stripe Connect:</p>
        <ul>
          <li>Thankly does not have access to your Stripe account credentials, login information, or authentication tokens</li>
          <li>Thankly cannot and will not interfere with Stripe&#x2019;s direct contractual relationship with you as a connected account holder</li>
          <li>Your rights regarding payment processing, fund holding, dispute resolution, and payout timing are governed by the Stripe Connected Account Agreement between you and Stripe directly</li>
          <li>Thankly&#x2019;s role is limited to initiating transfer instructions, displaying transaction data, and collecting the platform fee &#x2014; Thankly never takes custody of your funds</li>
          <li>If there is a conflict between Thankly&#x2019;s instructions and Stripe&#x2019;s Connected Account Agreement, Stripe&#x2019;s agreement controls with respect to payment operations</li>
        </ul>
        <div className="info-box">Thankly cannot override Stripe&#x2019;s compliance decisions, reserve requirements, or verification holds. Resolve Stripe account issues directly at stripe.com/contact.</div>
      </section>

      <section id="appstore">
        <h2>App store terms</h2>
        <p>The Thankly mobile application is distributed through the Apple App Store and Google Play Store.</p>
        <ul>
          <li>The agreement for use of the Thankly Platform is between you and Thankly LLC only, not Apple Inc. or Google LLC</li>
          <li>Apple and Google are not parties to these Terms and bear no responsibility for the Platform or its content</li>
          <li>Notwithstanding the above, Apple Inc. and Google LLC are each third-party beneficiaries of these Terms and have the right to enforce these Terms against you</li>
          <li>In the event of any conflict between these Terms and the Apple App Store or Google Play terms of service, these Terms govern your relationship with Thankly; the app store terms govern your relationship with Apple or Google respectively</li>
          <li>Apple has no obligation to furnish any maintenance or support services for the Thankly app</li>
          <li>To the maximum extent permitted by law, Apple has no warranty obligation with respect to the Thankly app</li>
        </ul>
      </section>

      <section id="conduct">
        <h2>Acceptable use</h2>

        <h3>Permitted uses</h3>
        <ul>
          <li>Worker Users receiving and tracking tip income</li>
          <li>Customer Users sending voluntary tips</li>
          <li>Business Users managing worker tipping programs</li>
          <li>Generating earnings documentation</li>
        </ul>

        <h3>Prohibited: financial fraud</h3>
        <ul>
          <li>Creating fictitious tips or fabricating transaction records</li>
          <li>Money laundering or obscuring the source of funds</li>
          <li>Processing payments unrelated to legitimate tips</li>
          <li>Filing fraudulent chargebacks</li>
        </ul>

        <h3>Prohibited: identity and account fraud</h3>
        <ul>
          <li>Impersonating another Worker or person</li>
          <li>Creating multiple accounts to circumvent bans or fees</li>
          <li>Using someone else&#x2019;s QR code</li>
          <li>Providing false registration information</li>
        </ul>

        <h3>Prohibited: platform abuse</h3>
        <ul>
          <li>Scraping, crawling, or data harvesting</li>
          <li>Reverse-engineering or decompiling the Platform</li>
          <li>Introducing malicious code or viruses</li>
          <li>Automated tools generating artificial transactions</li>
        </ul>

        <p>Violations may result in warnings, suspension, payout withholding, termination, or referral to law enforcement. Report violations to <a href="mailto:legal@getthankly.com">legal@getthankly.com</a>.</p>
      </section>

      <section id="content">
        <h2>Content &amp; copyright</h2>

        <h3>User-generated content and profile reporting</h3>
        <p>Worker profile photos and display names are User-Generated Content (UGC). Content standards:</p>
        <ul>
          <li>Photos must be appropriate for all audiences &#x2014; no nudity, hate symbols, graphic violence, or unauthorized third-party trademarks</li>
          <li>Display names may not impersonate real persons, public figures, or Thankly staff</li>
          <li>Profile content may not include copyrighted images without explicit rights-holder permission</li>
          <li>Thankly may remove violating UGC without prior notice</li>
        </ul>
        <p>To report an inappropriate profile, tap &#x201C;Report Profile&#x201D; on any Worker&#x2019;s public profile page. Reports are reviewed within 24 hours.</p>

        <h3>Intellectual property</h3>
        <p>All Platform content and technology is owned by or licensed to Thankly LLC. Workers retain ownership of their personal content and grant Thankly a limited display license.</p>

        <h3>Copyright and DMCA takedown policy</h3>
        <p>Thankly complies with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. &#xA7; 512, to maintain statutory safe harbor protection.</p>
        <p><strong>Reporting infringement:</strong> submit written DMCA notices to <a href="mailto:legal@getthankly.com">legal@getthankly.com</a> (Subject: &#x201C;DMCA Takedown Notice&#x201D;). Your notice must include your name, address, telephone number, and email; a description of the copyrighted work claimed to be infringed; the location of the allegedly infringing content; a good faith belief statement that the use is not authorized; a statement under penalty of perjury that the information is accurate and you are authorized to act; and your physical or electronic signature.</p>
        <p><strong>Counter-notification:</strong> if content was removed in error, submit a counter-notification to <a href="mailto:legal@getthankly.com">legal@getthankly.com</a> with your contact information, identification of the removed content, a statement under penalty of perjury that removal was mistaken, and consent to jurisdiction of a federal court in Florida.</p>
        <p><strong>Repeat infringers:</strong> accounts determined to be repeat copyright infringers will be terminated.</p>
      </section>

      <section id="refunds">
        <h2>Refunds &amp; chargebacks</h2>
        <p>Tips are voluntary gratuities, not purchases. Thankly does not generally issue refunds after a transaction is completed.</p>

        <h3>Exceptions</h3>
        <p>Refunds may be reviewed for duplicate transactions caused by a Thankly technical error, unauthorized transactions resulting from fraud or account compromise, or obvious UI-caused input errors. Requests must be submitted within 7 days to <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> with transaction details.</p>

        <h3>Platform fees</h3>
        <p>Non-refundable except where required by law or under the exceptions above.</p>

        <h3>Chargebacks</h3>
        <ul>
          <li>Stripe initiates a dispute process if a customer files a chargeback</li>
          <li>Thankly cooperates by providing transaction evidence to Stripe</li>
          <li>Upheld chargebacks plus associated fees may be deducted from future Worker payouts</li>
          <li>Repeated chargebacks may result in account suspension</li>
        </ul>
        <p>Chargeback outcomes are determined by card networks. Thankly is not liable for resulting losses.</p>
      </section>

      <section id="qr">
        <h2>QR code &amp; public profile</h2>
        <p>Your QR code links to a public profile showing your display name, optional photo, optional job title, and a tip payment interface. Anyone who scans your code can see this page.</p>

        <h3>What is never public</h3>
        <ul>
          <li>Your full legal name (unless you choose to display it)</li>
          <li>Home address, phone, or email</li>
          <li>Banking or payout information</li>
          <li>Earnings history or tip amounts</li>
          <li>Identity verification documents</li>
        </ul>

        <h3>Your responsibility</h3>
        <p>You control where you display your QR code. Thankly cannot control who scans it. Display it only in professional contexts.</p>

        <h3>Disabling your profile</h3>
        <p>Deactivate your profile at any time in account settings. Your QR code stops functioning immediately. Reactivation is instant.</p>

        <h3>Business-managed profiles</h3>
        <p>If enrolled by a Business User, the business may update certain profile fields and view your tip activity but cannot access your banking details.</p>
      </section>

      <section id="electronic">
        <h2>Electronic consent</h2>
        <p>By creating an account, you consent to receive all communications electronically, including terms of service and legal agreements, privacy policy updates, transaction receipts and confirmations, earnings reports and tax documents, account and security alerts, and customer service communications.</p>

        <h3>What you need</h3>
        <ul>
          <li>An internet-connected device</li>
          <li>A supported web browser or the Thankly mobile app</li>
          <li>A valid email address</li>
          <li>A PDF reader for documents</li>
        </ul>

        <h3>Paper copies &amp; withdrawing consent</h3>
        <p>Request paper copies at <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>; a reasonable fee may apply except where paper delivery is legally required. You may withdraw electronic consent at any time by contacting <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>, though withdrawal may limit platform access, including payouts.</p>
        <p>This consent complies with the federal E-SIGN Act and applicable state laws. Electronic signatures have the same legal effect as handwritten signatures.</p>
      </section>

      <section id="disputes">
        <h2>Disputes &amp; arbitration</h2>

        <h3>Informal resolution</h3>
        <p>Contact <a href="mailto:legal@getthankly.com">legal@getthankly.com</a> first. A 30-day good-faith resolution period is required before initiating formal proceedings.</p>

        <h3>Binding arbitration</h3>
        <p>Unresolved disputes are resolved by binding individual arbitration under AAA Consumer Arbitration Rules, conducted in Florida or by videoconference.</p>

        <div className="warning-box"><strong>Class action waiver:</strong> you waive the right to a jury trial and to participate in class actions or any representative proceeding. All disputes must be brought solely in your individual capacity.</div>

        <h3>Mass filing protections</h3>
        <p>If 25 or more claimants submit substantially similar demands within 60 days (a &#x201C;Mass Filing&#x201D;), demands are grouped into sequential batches of no more than 50 claimants, each batch is administered as a separate arbitration proceeding, and remaining demands are stayed pending resolution of earlier batches. The statute of limitations for each claimant&#x2019;s claim is tolled from the date their initial demand is filed until their batch is formally scheduled, ensuring no claim expires while waiting in queue.</p>

        <h3>Arbitration opt-out</h3>
        <p>You may opt out of binding arbitration and the class action waiver by emailing <a href="mailto:legal@getthankly.com">legal@getthankly.com</a> within 30 days of account creation, including your name, account email, and a clear opt-out statement.</p>

        <h3>Exceptions</h3>
        <p>Either party may seek emergency injunctive relief in a court of competent jurisdiction to prevent irreparable harm pending arbitration.</p>
      </section>

      <section id="business">
        <h2>Business accounts</h2>
        <p>These terms supplement the Thankly Terms of Service and govern all Business User accounts. In case of conflict, these terms govern with respect to Business Users.</p>

        <h3>Registration</h3>
        <ul>
          <li>Must be a duly registered legal entity</li>
          <li>Must have authority to legally bind the entity</li>
          <li>Must provide accurate business name, address, and tax identification</li>
          <li>Must complete all required Stripe and Thankly verification</li>
        </ul>

        <h3>Worker enrollment and consent</h3>
        <p>By enrolling any Worker User, you represent, warrant, and covenant that each Worker has individually given informed, affirmative consent to enroll on Thankly; each Worker has been provided access to Thankly&#x2019;s Terms of Service, Privacy Policy, and fee schedule before enrollment; enrollment does not violate any employment agreement, collective bargaining agreement, or applicable labor law; you will promptly remove Workers upon termination, resignation, or written request; and you have not misrepresented enrollment as any employment benefit, wage supplement, or compensation program.</p>

        <h3>Dashboard features &amp; data access</h3>
        <p>The dashboard includes multi-worker management, aggregate tip analytics, QR code generation, and onboarding tools. Feature availability may vary by tier.</p>
        <p>Business accounts may access Worker display names, transaction totals, and aggregate tip activity. You agree to use Worker data solely for legitimate business management purposes, never share Worker-level data with third parties without written Worker consent, maintain appropriate technical and organizational security controls, and comply with all applicable privacy and data protection laws.</p>
        <div className="info-box">Business accounts have no access to Worker banking details, identity documents, SSNs, individual payout amounts, or Stripe credentials.</div>

        <h3>No employment relationship with Thankly</h3>
        <p>Thankly is a technology vendor only. All duties and liabilities to Workers under applicable employment law remain solely and exclusively with the Business.</p>

        <h3>Fees, billing &amp; termination</h3>
        <p>Business subscriptions may have fees in addition to per-transaction platform fees, with 30 days&#x2019; advance notice for pricing changes. Either party may terminate with 30 days&#x2019; written notice. Upon termination, business dashboard access deactivates on the effective date, Worker Users retain their individual accounts unaffected, pending Worker payouts process per normal Stripe schedules, and all outstanding Business fees become immediately due.</p>

        <h3>Business indemnification</h3>
        <p>Business Users agree to fully and completely indemnify, defend, and hold harmless Thankly LLC and its members, managers, officers, employees, agents, successors, and assigns from any claims arising from: failure to obtain valid worker consent before enrollment; violation of the FLSA, state wage and hour laws, or worker classification laws arising from the Business&#x2019;s use of Thankly; any tip-pooling or tip-sharing arrangement implemented by the Business; worker complaints, labor board filings, or litigation brought due to the Business&#x2019;s workforce practices; misuse or breach of Worker data accessed through the dashboard; material misrepresentation during registration or enrollment; and any claim by a Worker that enrollment violated their employment agreement or applicable law. This indemnification is unconditional and survives termination.</p>
        <div className="warning-box">Thankly reserves the right to assume exclusive control of any defense or settlement of any indemnified claim. The Business agrees to cooperate fully and not to settle any such claim without Thankly&#x2019;s prior written consent.</div>

        <h3>FLSA and tip-pooling compliance</h3>
        <p>Thankly does not administer tip pools, calculate tip credits, verify wage law compliance, or provide legal guidance on wage and hour obligations. The Business bears sole and exclusive legal responsibility for compliance with the FLSA and all applicable wage and hour laws, lawful tip pool and tip-sharing arrangements, ensuring any tip credit is not invalidated by use of Thankly, correctly classifying Workers under applicable law, and compliance with state and local tipping regulations.</p>
        <div className="warning-box"><strong>High-risk jurisdictions:</strong> California (no tip credit; strict tip pool rules), New York (complex industry-specific tip credit calculations), Minnesota (no tip credit), Washington (no tip credit), and Oregon (no tip credit). Consult qualified employment counsel before deploying Thankly in these markets.</div>
        <p>These obligations survive termination of the Business account. For enterprise inquiries, contact <a href="mailto:legal@getthankly.com">legal@getthankly.com</a>.</p>
      </section>

      <section id="general">
        <h2>General terms</h2>

        <h3>Disclaimers &amp; liability</h3>
        <p>The Platform is provided &#x201C;as is.&#x201D; Thankly disclaims all warranties, express or implied, including merchantability and fitness for a particular purpose. Thankly is not liable for indirect, incidental, or consequential damages including lost tips or lost profits. Total liability is capped at the greater of fees paid in the prior 12 months or $100 USD.</p>

        <h3>Governing language</h3>
        <p>These Terms are prepared in English. Translated versions are for user convenience only. In any conflict, the English version controls and is the sole legally binding text.</p>

        <h3>Modifications and termination</h3>
        <p>We may update these Terms with 14 days&#x2019; advance notice. You may close your account at <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>. We may terminate accounts that violate these Terms.</p>

        <h3>Contact</h3>
        <p>General questions: <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> &middot; Legal matters: <a href="mailto:legal@getthankly.com">legal@getthankly.com</a></p>
      </section>
    </LegalLayout>
  )
}