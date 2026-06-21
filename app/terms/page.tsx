import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Terms of Service — Thankly',
  description: 'Thankly Terms of Service, Electronic Consent, Acceptable Use, Refund Policy, QR Code Disclosure, and Business Dashboard Terms.',
}

export default function TermsPage() {
  return (
    <LegalLayout
      docNumber="02, 07, 08, 09, 10 & 14 of 14"
      audience="All Users"
      title="Terms of Service & Policies"
      effectiveDate="June 24, 2026"
      version="1.4"
      summary="By creating an account or using the Platform, you agree to these Terms. If you do not agree, do not use the Platform."
    >

      {/* DOCUMENT 02 — TERMS OF SERVICE */}
      <h2>1. Definitions</h2>
      <ul>
        <li><strong>"Platform":</strong> the Thankly website, mobile app (iOS and Android), and all associated services</li>
        <li><strong>"Worker User":</strong> a service industry professional who receives tips and uses earnings tools</li>
        <li><strong>"Customer User":</strong> a person who sends a tip via QR code without a Thankly account</li>
        <li><strong>"Business User":</strong> a legal entity managing a team of Worker Users on the Platform</li>
        <li><strong>"Stripe":</strong> Stripe, Inc., the third-party payment processor used by the Platform</li>
        <li><strong>"Transaction":</strong> any tip payment initiated by a Customer User through the Platform</li>
        <li><strong>"Payout":</strong> disbursement of net tip proceeds to a Worker's linked bank account or debit card via Stripe</li>
      </ul>

      <h2>2. About Thankly</h2>
      <p>Thankly enables cashless tipping and earnings documentation for service industry workers. Thankly is not a bank, payroll provider, or tax advisor.</p>

      <h2>3. Eligibility</h2>
      <ul>
        <li>Must be 18 or older</li>
        <li>Must be authorized to receive payments in the United States</li>
        <li>Must provide accurate registration information</li>
        <li>One account per person</li>
        <li>Business accounts must be registered legal entities</li>
      </ul>

      <h2>4. Worker Accounts</h2>
      <h3>4.1 QR Code and Profile</h3>
      <p>You receive a unique QR code linked to your public profile. You control your display name and photo and are responsible for profile accuracy.</p>
      <h3>4.2 Payment Processing and Stripe Connected Account Agreement</h3>
      <p>Tips are processed via Stripe Connect. By registering as a Worker User, you agree to the <a href="https://stripe.com/connect-account/legal" target="_blank" rel="noopener noreferrer">Stripe Connected Account Agreement</a>. You must complete KYC verification before receiving payouts.</p>
      <h3>4.3 Platform Fee</h3>
      <p>A fee is charged per transaction as displayed at time of payment. Current rates at getthankly.com/fees. Rate changes notified 30 days in advance.</p>
      <h3>4.4 Earnings Reports</h3>
      <p>PDF and Excel reports are informational tools only — not audited statements. See <a href="/disclosures">Earnings Disclaimer</a>.</p>

      <h2>5. Stripe Connect Platform Relationship</h2>
      <ul>
        <li>Thankly does not have access to your Stripe account credentials, login information, or authentication tokens</li>
        <li>Thankly cannot and will not interfere with Stripe's direct contractual relationship with you as a connected account holder</li>
        <li>Your rights regarding payment processing, fund holding, dispute resolution, and payout timing are governed by the Stripe Connected Account Agreement between you and Stripe directly</li>
        <li>Thankly's role is limited to initiating transfer instructions, displaying transaction data, and collecting the platform fee — Thankly never takes custody of your funds</li>
        <li>If there is a conflict between Thankly's instructions and Stripe's Connected Account Agreement, Stripe's agreement controls with respect to payment operations</li>
      </ul>
      <div className="info-box">Thankly cannot override Stripe's compliance decisions, reserve requirements, or verification holds. Resolve Stripe account issues directly at stripe.com/contact.</div>

      <h2>6. Third-Party App Store Terms</h2>
      <p>The Thankly mobile application is distributed through the Apple App Store and Google Play Store. With respect to app store distribution:</p>
      <ul>
        <li>The agreement for use of the Thankly Platform is between you and Thankly LLC only — not Apple Inc. or Google LLC</li>
        <li>Apple and Google are not parties to these Terms and bear no responsibility for the Platform or its content</li>
        <li>Notwithstanding the above, Apple Inc. and Google LLC are each third-party beneficiaries of these Terms and have the right to enforce these Terms against you as a third-party beneficiary</li>
        <li>In the event of any conflict between these Terms and the Apple App Store or Google Play terms of service, these Terms govern the relationship between you and Thankly; the app store terms govern your relationship with Apple or Google respectively</li>
        <li>Apple has no obligation whatsoever to furnish any maintenance or support services for the Thankly app</li>
        <li>To the maximum extent permitted by applicable law, Apple will have no warranty obligation with respect to the Thankly app</li>
      </ul>

      <h2>7. Prohibited Conduct</h2>
      <ul>
        <li>Illegal use or violation of any applicable law</li>
        <li>Fraud, fake tips, or fabricated transaction records</li>
        <li>Money laundering or financial crimes</li>
        <li>Impersonating another worker or person</li>
        <li>Reverse-engineering or scraping the Platform</li>
        <li>Violating the Stripe Connected Account Agreement or payment network rules</li>
      </ul>

      <h2>8. Intellectual Property</h2>
      <p>All Platform content and technology is owned by or licensed to Thankly LLC. Workers retain ownership of their personal content and grant Thankly a limited display license.</p>

      <h2>9. Disclaimers</h2>
      <p>THE PLATFORM IS PROVIDED "AS IS." THANKLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.</p>

      <h2>10. Limitation of Liability</h2>
      <p>THANKLY IS NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES INCLUDING LOST TIPS OR LOST PROFITS. TOTAL LIABILITY CAPPED AT THE GREATER OF FEES PAID IN THE PRIOR 12 MONTHS OR $100 USD.</p>

      <h2>11. Dispute Resolution</h2>
      <h3>11.1 Informal Resolution</h3>
      <p>Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> first. A 30-day good-faith resolution period is required before initiating formal proceedings.</p>
      <h3>11.2 Binding Arbitration</h3>
      <p>Unresolved disputes are resolved by binding individual arbitration under AAA Consumer Arbitration Rules, conducted in Florida or by videoconference.</p>
      <h3>11.3 Class Action Waiver</h3>
      <div className="warning-box"><strong>YOU WAIVE THE RIGHT TO JURY TRIAL AND TO PARTICIPATE IN CLASS ACTIONS OR ANY REPRESENTATIVE PROCEEDING.</strong> All disputes must be brought solely in your individual capacity.</div>
      <h3>11.4 Mass Filing Protections</h3>
      <p>If 25 or more claimants submit substantially similar demands within 60 days (a "Mass Filing"):</p>
      <ul>
        <li>Demands are grouped into sequential batches of no more than 50 claimants</li>
        <li>Each batch is administered as a separate arbitration proceeding</li>
        <li>Remaining demands are stayed pending resolution of earlier batches</li>
        <li>The statute of limitations for each claimant's claim is tolled from the date their initial demand is filed until the date their batch is formally scheduled for arbitration</li>
      </ul>
      <h3>11.5 Arbitration Opt-Out</h3>
      <p>You may opt out of Sections 11.2 and 11.3 by emailing <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> within 30 days of account creation, including your name, account email, and a clear opt-out statement.</p>
      <h3>11.6 Exceptions</h3>
      <p>Either party may seek emergency injunctive relief in a court of competent jurisdiction to prevent irreparable harm pending arbitration.</p>

      <h2>12. Governing Language</h2>
      <p>These Terms are prepared in English. Translated versions are for user convenience only. In any conflict, the English version controls and is the sole legally binding text.</p>

      <h2>13. Modifications and Termination</h2>
      <p>We may update these Terms with 14 days' advance notice. You may close your account at <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>. We may terminate accounts that violate these Terms. Sections 8–12 survive termination.</p>

      <h2>14. Contact</h2>
      <p><a href="mailto:hello@getthankly.com">hello@getthankly.com</a> | <a href="https://getthankly.com">getthankly.com</a></p>

      {/* DOCUMENT 07 — ELECTRONIC CONSENT & E-SIGN */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 07 of 14 — All Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Electronic Consent & E-Sign Disclosure</h2>
      </div>
      <h2>15. Consent to Electronic Communications</h2>
      <p>By creating an account, you consent to receive all communications electronically, including:</p>
      <ul>
        <li>Terms of Service and legal agreements</li>
        <li>Privacy Policy updates</li>
        <li>Transaction receipts and confirmations</li>
        <li>Earnings reports and tax documents</li>
        <li>Account and security alerts</li>
        <li>Customer service communications</li>
      </ul>
      <h2>16. Requirements</h2>
      <ul>
        <li>Internet-connected device</li>
        <li>Supported web browser or Thankly mobile app</li>
        <li>Valid email address</li>
        <li>PDF reader for documents</li>
      </ul>
      <h2>17. Paper Copies</h2>
      <p>Request paper copies at <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>. A reasonable fee may apply except where paper delivery is legally required.</p>
      <h2>18. Withdrawing Consent</h2>
      <p>Withdraw at any time by contacting <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>. Withdrawal may limit platform access, including payouts. Does not affect prior electronic communications.</p>
      <h2>19. Keep Information Current</h2>
      <p>Keep your email and phone current in account settings. Communications sent to your registered email are considered received.</p>
      <h2>20. Federal E-SIGN Act</h2>
      <p>This consent complies with the federal E-SIGN Act and applicable state laws. Electronic signatures have the same legal effect as handwritten signatures.</p>

      {/* DOCUMENT 08 — ACCEPTABLE USE POLICY */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 08 of 14 — All Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Acceptable Use Policy</h2>
      </div>
      <h2>21. Permitted Uses</h2>
      <ul>
        <li>Worker Users receiving and tracking tip income</li>
        <li>Customer Users sending voluntary tips</li>
        <li>Business Users managing worker tipping programs</li>
        <li>Generating earnings documentation</li>
      </ul>
      <h2>22. Prohibited — Financial Fraud</h2>
      <ul>
        <li>Creating fictitious tips or fabricating transaction records</li>
        <li>Money laundering or obscuring the source of funds</li>
        <li>Processing payments unrelated to legitimate tips</li>
        <li>Filing fraudulent chargebacks</li>
      </ul>
      <h2>23. Prohibited — Identity and Account Fraud</h2>
      <ul>
        <li>Impersonating another Worker or person</li>
        <li>Creating multiple accounts to circumvent bans or fees</li>
        <li>Using someone else's QR code</li>
        <li>Providing false registration information</li>
      </ul>
      <h2>24. Prohibited — Platform Abuse</h2>
      <ul>
        <li>Scraping, crawling, or data harvesting</li>
        <li>Reverse-engineering or decompiling the Platform</li>
        <li>Introducing malicious code or viruses</li>
        <li>Automated tools generating artificial transactions</li>
      </ul>
      <h2>25. User-Generated Content and Profile Reporting</h2>
      <p>Worker profile photos and display names are User-Generated Content (UGC). Photos must be appropriate for all audiences — no nudity, hate symbols, graphic violence, or unauthorized third-party trademarks. Display names may not impersonate real persons, public figures, or Thankly staff. Profile content may not include copyrighted images without explicit rights-holder permission. Thankly may remove violating UGC without prior notice.</p>
      <p>To report an inappropriate profile: tap "Report Profile" on any Worker's public profile page. Reports are reviewed within 24 hours.</p>
      <h2>26. Copyright and DMCA Takedown Policy</h2>
      <p>Thankly complies with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512. Submit written DMCA notices to <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> (Subject: "DMCA Takedown Notice") including your contact information, description of the copyrighted work, location of the infringing content, a good faith belief statement, and your physical or electronic signature. Counter-notifications may be submitted to the same address. Accounts of repeat copyright infringers will be terminated.</p>
      <h2>27. Enforcement</h2>
      <p>AUP violations may result in warnings, suspension, payout withholding, termination, or referral to law enforcement. Report violations to <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>.</p>

      {/* DOCUMENT 09 — REFUND & CHARGEBACK POLICY */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 09 of 14 — All Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Refund & Chargeback Policy</h2>
      </div>
      <h2>28. General Policy</h2>
      <p>Tips are voluntary gratuities, not purchases. Thankly does not generally issue refunds after a transaction is completed.</p>
      <h2>29. Exceptions</h2>
      <p>Refunds may be reviewed for duplicate transactions caused by a Thankly technical error, unauthorized transactions resulting from fraud or account compromise, or obvious UI-caused input errors. Requests must be submitted within 7 days to <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> with transaction details.</p>
      <h2>30. Platform Fees</h2>
      <p>Non-refundable except where required by law or under the exceptions above.</p>
      <h2>31. Chargebacks</h2>
      <ul>
        <li>Stripe initiates a dispute process if a customer files a chargeback</li>
        <li>Thankly cooperates by providing transaction evidence to Stripe</li>
        <li>Upheld chargebacks plus associated fees may be deducted from future Worker payouts</li>
        <li>Repeated chargebacks may result in account suspension</li>
      </ul>
      <p>Chargeback outcomes are determined by card networks. Thankly is not liable for resulting losses.</p>

      {/* DOCUMENT 10 — QR CODE USAGE & PUBLIC PROFILE */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 10 of 14 — Worker Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">QR Code Usage & Public Profile Disclosure</h2>
      </div>
      <h2>32. Your Public Profile</h2>
      <p>Your QR code links to a public profile showing your display name, optional photo, optional job title, and a tip payment interface. Anyone who scans your code can see this page.</p>
      <h2>33. What Is Never Public</h2>
      <ul>
        <li>Your full legal name (unless you choose to display it)</li>
        <li>Home address, phone, or email</li>
        <li>Banking or payout information</li>
        <li>Earnings history or tip amounts</li>
        <li>Identity verification documents</li>
      </ul>
      <h2>34. QR Code Responsibility</h2>
      <p>You control where you display your QR code. Thankly cannot control who scans it. Display it only in professional contexts.</p>
      <h2>35. Disabling Your Profile</h2>
      <p>Deactivate your profile at any time in account settings. Your QR code stops functioning immediately. Reactivation is instant.</p>
      <h2>36. Business-Managed Profiles</h2>
      <p>If enrolled by a Business User, the business may update certain profile fields and view your tip activity but cannot access your banking details. See Business Dashboard Terms below.</p>

      {/* DOCUMENT 14 — BUSINESS DASHBOARD TERMS */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 14 of 14 — Business Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Business Dashboard Terms</h2>
      </div>
      <p>These Business Dashboard Terms supplement the Thankly Terms of Service and govern all Business User accounts. In case of conflict, these terms govern with respect to Business Users.</p>
      <h2>37. Business Account Registration</h2>
      <ul>
        <li>Must be a duly registered legal entity</li>
        <li>Must have authority to legally bind the entity</li>
        <li>Must provide accurate business name, address, and tax identification</li>
        <li>Must complete all required Stripe and Thankly verification</li>
      </ul>
      <h2>38. Worker Enrollment and Consent</h2>
      <p>By enrolling any Worker User, you represent, warrant, and covenant that each Worker has individually given informed, affirmative consent to enroll on Thankly and has been provided access to Thankly's Terms of Service, Privacy Policy, and fee schedule before enrollment. Enrollment must not violate any employment agreement, collective bargaining agreement, or applicable labor law. You will promptly remove Workers upon termination, resignation, or written request.</p>
      <h2>39. Dashboard Features</h2>
      <p>Includes multi-worker management, aggregate tip analytics, QR code generation, and onboarding tools. Feature availability may vary by tier.</p>
      <h2>40. Data Access and Restrictions</h2>
      <p>Business accounts may access Worker display names, transaction totals, and aggregate tip activity. Business accounts have no access to Worker banking details, identity documents, SSNs, individual payout amounts, or Stripe credentials. Worker data may only be used for legitimate business management purposes and must never be shared with third parties without written Worker consent.</p>
      <h2>41. No Employment Relationship with Thankly</h2>
      <p>Thankly is a technology vendor only. All duties and liabilities to Workers under applicable employment law remain solely and exclusively with the Business.</p>
      <h2>42. Fees and Billing</h2>
      <p>Business subscriptions may have fees in addition to per-transaction platform fees. See getthankly.com/business. 30 days' advance notice for pricing changes.</p>
      <h2>43. Termination</h2>
      <p>Either party may terminate with 30 days' written notice. Upon termination, business dashboard access deactivates, Worker Users retain their individual accounts unaffected, pending Worker payouts process per normal Stripe schedules, and all outstanding Business fees become immediately due.</p>
      <h2>44. Business Indemnification</h2>
      <p>Business Users agree to fully and completely indemnify, defend (with counsel reasonably acceptable to Thankly), and hold harmless Thankly LLC and its members, managers, officers, employees, agents, successors, and assigns from and against any and all claims, actions, damages, liabilities, losses, fines, penalties, costs, and expenses (including reasonable attorneys' fees) arising from: failure to obtain valid, informed worker consent before enrollment; violation of the FLSA, state wage and hour laws, minimum wage, overtime, or worker classification laws; any tip-pooling, tip-sharing, or tip-credit arrangement implemented in connection with Thankly; worker complaints, labor board filings, or civil litigation due to the Business's workforce practices; misuse or unauthorized disclosure of Worker data; or material misrepresentation during account registration or worker enrollment. This indemnification is unconditional and survives termination.</p>
      <h2>45. FLSA and Tip-Pooling Compliance</h2>
      <p>Thankly does not administer tip pools, calculate tip credits, verify wage law compliance, or provide legal guidance on wage and hour obligations. The Business bears sole and exclusive legal responsibility for compliance with the FLSA and all applicable federal, state, and local wage and hour laws.</p>
      <div className="warning-box"><strong>High-risk jurisdictions: California (no tip credit; strict tip pool rules), New York (complex industry-specific tip credit calculations), Minnesota (no tip credit), Washington (no tip credit), and Oregon (no tip credit). Consult qualified employment counsel before deploying Thankly in these markets.</strong></div>
      <h2>46. Contact</h2>
      <p>Business support and enterprise inquiries: <a href="mailto:hello@getthankly.com">hello@getthankly.com</a></p>

    </LegalLayout>
  )
}
