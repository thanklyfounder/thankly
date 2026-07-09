import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Disclosures — Thankly',
  description: 'Thankly earnings, tax, payment processing, worker classification, consumer fee, and SMS & email communication disclosures.',
}

const sections = [
  { id: 'earnings', label: 'Earnings reports' },
  { id: 'tax', label: 'Tax Pocket & taxes' },
  { id: 'payments', label: 'How payments work' },
  { id: 'payouts', label: 'Payout options' },
  { id: 'classification', label: 'Worker classification' },
  { id: 'fees', label: 'Fees for customers' },
  { id: 'communications', label: 'SMS & email consent' },
]

export default function DisclosuresPage() {
  return (
    <LegalLayout
      badge="Disclosures"
      title="What we're required to tell you"
      description="Earnings, taxes, payments, and communications, explained plainly. These disclosures exist so nothing about how Thankly works is a surprise."
      effectiveDate="June 24, 2026"
      version="1.5"
      sections={sections}
    >
      <section id="earnings">
        <h2>Earnings reports</h2>
        <div className="info-box">Thankly earnings reports are organizational tools, not audited statements, income guarantees, or professional financial advice.</div>

        <h3>No earnings guarantee</h3>
        <p>Thankly does not guarantee any income, tip amounts, or earning levels. Tips are voluntary. Past history does not predict future earnings.</p>

        <h3>What reports do and do not include</h3>
        <p>Reports include only tips processed through Thankly. They do not include cash tips or tips from other platforms, wages or employer-paid income, or any other income.</p>
        <p>Reports are not audited financial statements, certified income verification, substitutes for pay stubs, or IRS-recognized tax documents.</p>

        <h3>Third-party use &amp; accuracy</h3>
        <p>Sharing reports with landlords, lenders, or government agencies is at your own risk. Thankly makes no representation that any third party will accept them for any purpose. Reports reflect transactions as recorded; notify us of discrepancies at <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> promptly.</p>
        <p>Nothing on Thankly constitutes financial, legal, or accounting advice. Consult a qualified professional for your specific situation.</p>
      </section>

      <section id="tax">
        <h2>Tax Pocket &amp; taxes</h2>
        <div className="info-box">Tax Pocket estimates are a convenience feature only. Thankly is not a tax professional, CPA, or enrolled agent.</div>

        <h3>What the Tax Pocket is</h3>
        <p>The Estimated Tax Pocket (also called &#x201C;Safe-to-Spend Balance&#x201D;) estimates the portion of tip income to set aside for taxes. It is based on simplified, publicly available tax rate assumptions, not individualized to your deductions, filing status, or credits, not endorsed by the IRS or any state tax authority, and subject to change as tax laws change, without notice.</p>

        <h3>Nature of Tax Pocket funds</h3>
        <p>The Tax Pocket is a display-only calculation. No funds are physically moved, segregated, or held in escrow. No interest accrues. All funds remain legally yours within your Stripe Connected Account balance until disbursed via Payout.</p>
        <div className="warning-box">If tax rates change during the year, the Tax Pocket estimate may be inaccurate. You are solely responsible for monitoring tax law changes and adjusting your savings. Thankly holds zero liability for tax shortfalls, underpayments, or penalties from reliance on these estimates.</div>

        <h3>IRS tax form issuance</h3>
        <p>Thankly does not issue Form 1099-NEC or Form 1099-MISC to Worker Users. Tip payments are peer-to-peer gratuities processed by Stripe, not wages, fees for services, or nonemployee compensation reportable under 1099-NEC or 1099-MISC rules.</p>
        <p>The applicable IRS form is Form 1099-K, issued directly by Stripe (not Thankly) to Worker Users who meet the applicable reporting threshold. Current thresholds are available at <a href="https://irs.gov" target="_blank" rel="noopener noreferrer">irs.gov</a>.</p>
        <div className="warning-box">The absence of a 1099-NEC or 1099-MISC from Thankly does not mean tip income is non-taxable. All tip income must be reported on your federal and state returns regardless of whether you receive a tax form. Consult a qualified tax professional.</div>

        <h3>Your tax obligations</h3>
        <ul>
          <li>Report all tip income on your federal and applicable state returns</li>
          <li>Pay all self-employment and income taxes owed</li>
          <li>Make quarterly estimated tax payments to the IRS if required</li>
          <li>Maintain income records as required by law</li>
        </ul>
        <p>Thankly does not withhold taxes. You are not an employee of Thankly. Thankly is not liable for penalties, interest, underpayments, or any other tax consequences arising from use of the Tax Pocket or any other Platform information. Consult a licensed CPA or enrolled agent.</p>
      </section>

      <section id="payments">
        <h2>How payments work</h2>
        <p>All payments are processed by Stripe, Inc. Thankly is not a payment processor, bank, or money transmitter.</p>
        <div className="info-box">Worker Users: by registering on Thankly, you agree to the <a href="https://stripe.com/connect-account/legal" target="_blank" rel="noopener noreferrer">Stripe Connected Account Agreement</a>. This governs your rights regarding payment processing, fund holding, payout timing, and dispute resolution.</div>

        <h3>How a tip payment works</h3>
        <ul>
          <li>Customer enters a tip amount on the Worker&#x2019;s Thankly QR page</li>
          <li>Stripe authorizes and captures the payment from the Customer&#x2019;s card</li>
          <li>Thankly deducts the applicable platform fee</li>
          <li>Net amount is credited to the Worker&#x2019;s Stripe Connect account balance</li>
          <li>Worker initiates a Payout using Standard or Instant method</li>
        </ul>

        <h3>Platform fee</h3>
        <p>The fee is a percentage of each transaction, shown before payment is confirmed. The Customer may cover the fee (Worker receives 100% of the intended tip) or have it deducted from the Worker&#x2019;s tip. Fees are non-refundable absent legal requirement or an approved exception.</p>

        <h3>Identity verification &amp; chargebacks</h3>
        <p>Workers must complete Stripe&#x2019;s KYC process (government-issued ID and date of birth) before receiving any payouts. This is a federal legal requirement.</p>
        <p>A Customer chargeback may result in deduction from future Worker payouts. Repeated chargebacks may trigger account suspension.</p>
        <p>Thankly does not offer loans, cash advances, or earned wage access. The Platform facilitates voluntary tip payments only.</p>
      </section>

      <section id="payouts">
        <h2>Payout options</h2>
        <p>Worker Users may choose between two payout methods when initiating a transfer from their Stripe balance.</p>

        <h3>Standard payout (default)</h3>
        <ul>
          <li>Funds are transferred to the Worker&#x2019;s linked bank account via ACH</li>
          <li>Typical arrival: 1&#x2013;2 business days after payout is initiated</li>
          <li>No additional fee charged by Thankly for standard payouts</li>
          <li>Subject to Stripe&#x2019;s standard ACH processing timelines</li>
        </ul>

        <h3>Instant payout (optional premium feature)</h3>
        <ul>
          <li>Funds are transferred to the Worker&#x2019;s linked debit card via Visa Direct or Mastercard Send</li>
          <li>Typical arrival: within minutes of payout initiation when eligible</li>
          <li>A fee assessed by Stripe applies to each Instant Payout, displayed before the Worker confirms</li>
          <li>Requires a Visa or Mastercard debit card linked to the Worker&#x2019;s Stripe account</li>
          <li>Subject to eligibility requirements set by Stripe, the Worker&#x2019;s card issuer, and Visa/Mastercard network rules</li>
        </ul>
        <div className="info-box">References to &#x201C;instant&#x201D; payment in app store listings, promotional materials, or in-app copy refer to the optional Instant Payout feature described above, which carries an additional fee and is subject to eligibility. Standard Payout (1&#x2013;2 business days) is the default payout method.</div>

        <h3>Rolling reserves and payout holds</h3>
        <p>Stripe may establish a reserve or delay payouts if an anomalous spike in high-dollar tip transactions is detected, elevated chargeback rates are associated with your account, outstanding identity verification requirements exist, or a compliance hold or law enforcement order applies. Thankly has no control over Stripe&#x2019;s reserve or hold decisions and is not liable for resulting delays.</p>

        <h3>Cross-border &amp; multi-currency limitations</h3>
        <p>The US Platform operates exclusively in USD at launch. Workers always receive payouts in USD regardless of the Customer&#x2019;s card currency.</p>
        <div className="warning-box">International customers: your card issuer may apply a foreign transaction fee when tipping in USD. Thankly is not responsible for these fees.</div>
        <p>Canada Phase 2: CAD-denominated transactions will be supported within Canada only. Cross-currency US&#x2013;Canada transactions will not be supported at initial Canadian launch.</p>
      </section>

      <section id="classification">
        <h2>Worker classification</h2>
        <div className="info-box">Thankly is a technology platform, not an employer. Workers are independent users, not employees, contractors, or agents of Thankly LLC.</div>

        <h3>No employment relationship</h3>
        <p>Using Thankly does not create any employment, agency, partnership, or joint venture with Thankly LLC. We do not set schedules or control your work, withhold income taxes, Social Security, or Medicare, provide workers&#x2019; compensation, health insurance, or benefits, or pay minimum wage, overtime, or other wage-and-hour protections.</p>

        <h3>Your employer</h3>
        <p>Your employment relationship is with your restaurant, hotel, salon, or other employer, not Thankly. We do not affect that relationship. You are solely responsible for all taxes on tip income, including self-employment tax where applicable.</p>

        <h3>Jurisdiction-specific laws</h3>
        <p>Classification laws vary by state and locality. Consult an employment attorney if you have questions about your status.</p>
      </section>

      <section id="fees">
        <h2>Fees for customers</h2>
        <p>This disclosure applies to anyone sending a tip through Thankly, provided in compliance with federal and state consumer protection laws governing fee transparency. No fees are hidden, deferred, or disclosed only after payment is confirmed.</p>

        <h3>The processing fee</h3>
        <p>Thankly charges a processing fee per tip transaction, always calculated and displayed before you confirm. You&#x2019;ll be presented with a clear choice: cover the fee yourself (total charge = tip + fee, Worker receives 100% of your intended tip), or have the fee deducted (total charge = tip only, Worker receives tip minus the fee). The exact dollar amount and your total charge are shown on the confirmation screen before you tap &#x201C;Confirm Tip.&#x201D;</p>

        <h3>No surprise fees</h3>
        <p>No fee is charged that was not fully disclosed on the pre-confirmation screen. No additional fees are added after you tap &#x201C;Confirm Tip.&#x201D; The total amount charged will exactly match what was shown. Thankly does not charge subscriptions, account fees, or recurring fees to Customer Users.</p>

        <h3>What Thankly is not</h3>
        <p>Thankly is not a payment processor. Payments are processed by Stripe, Inc. Thankly never receives, holds, or takes custody of your funds. You are only charged for transactions you individually authorize &#x2014; there are no stored payment methods or recurring charges without explicit separate consent.</p>

        <h3>Receipts &amp; refunds</h3>
        <p>A receipt is sent to your email (if provided) documenting the tip, fee, and total charged. Tips are voluntary gratuities &#x2014; refunds are not generally available outside limited exceptions. Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> for transaction questions or fee disputes.</p>
      </section>

      <section id="communications">
        <h2>SMS &amp; email consent</h2>
        <p>Provided in compliance with the Telephone Consumer Protection Act (TCPA), CAN-SPAM Act, and applicable state laws.</p>

        <h3>SMS communications and security &#x2014; A2P 10DLC registered</h3>
        <p>Thankly utilizes SMS messaging exclusively for account authentication and security-related notifications, such as one-time passwords (OTP). We do not use your phone number for marketing or promotional purposes. By providing your phone number, you opt in to receive these security-related messages. Message and data rates may apply depending on your mobile carrier plan.</p>
        <p><strong>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.</strong> All other categories of data sharing described in our policies exclude text-messaging originator opt-in data and consent; this information will not be shared with any third parties. We may share your mobile number only with trusted service providers (such as Twilio, our SMS delivery provider) who assist us in operating the verification messaging program, and only to deliver those messages on our behalf.</p>
        <p>SMS messages are delivered from our registered sender number +1 (407) 759-7255 via Twilio, our A2P 10DLC registered SMS provider. Our SMS campaign is registered under the &#x201C;Two-Factor Authentication&#x201D; use case with The Campaign Registry (TCR), covering all OTP and account verification messages sent through the Platform.</p>

        <h3>TCPA consent</h3>
        <p>By providing your mobile phone number and creating a Thankly account, you expressly consent to receive automated text messages (SMS) from Thankly LLC using an automatic telephone dialing system (ATDS) or similar technology. You are not required to consent to automated SMS as a condition of purchasing any goods or services. If you do not wish to receive automated SMS, do not provide your mobile number, or opt out using the instructions below.</p>

        <h3>Transactional communications (required)</h3>
        <p>Account verification and login OTP codes, payment receipts and tip confirmations, account security alerts, identity verification status updates, payout confirmations and status, and legal and policy update notices. Transactional security SMS, including OTP codes, cannot be fully disabled as they are required for account security and authentication.</p>

        <h3>Marketing communications</h3>
        <p>Thankly does not send marketing or promotional SMS messages. Our registered A2P 10DLC campaign is limited to Two-Factor Authentication use only. If you receive any unsolicited promotional message claiming to be from Thankly, please report it immediately to <a href="mailto:hello@getthankly.com">hello@getthankly.com</a>.</p>

        <h3>How to opt out</h3>
        <ul>
          <li>Reply STOP to any Thankly SMS &#x2014; one final confirmation message is sent, then no further non-essential SMS</li>
          <li>Reply HELP for help and contact information</li>
          <li>Email <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> to request removal from all SMS</li>
        </ul>
        <div className="warning-box">Opting out of marketing SMS does not opt you out of transactional security alerts such as login verification codes. Security SMS cannot be disabled.</div>

        <h3>Message frequency, email &amp; push notifications</h3>
        <p>Transactional messages are sent per event. Standard message and data rates may apply; Thankly is not responsible for carrier charges. Transactional emails are required for account operation. Marketing emails include an unsubscribe link and require separate consent, processed within 10 business days.</p>
        <p>The app requests push notification permission for transaction and payout alerts. You may grant or deny this at any time in device settings &#x2014; denial does not affect payment processing or payouts.</p>
        <p>English and Spanish are available. Set your preference in account settings. Thankly is not responsible for delayed or undelivered SMS caused by carriers or device issues.</p>
      </section>
    </LegalLayout>
  )
}