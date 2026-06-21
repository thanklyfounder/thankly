import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'

export const metadata: Metadata = {
  title: 'Disclosures — Thankly',
  description: 'Thankly earnings, tax, payment processing, worker classification, consumer fee, and SMS & email communication disclosures.',
}

export default function DisclosuresPage() {
  return (
    <LegalLayout
      docNumber="03, 04, 05, 06, 12 & 13 of 14"
      audience="All Users"
      title="Disclosures"
      effectiveDate="June 24, 2026"
      version="1.4"
      summary="This page contains all Thankly financial, tax, payment, worker classification, fee, and communication disclosures required by law and App Store guidelines."
    >

      {/* DOCUMENT 03 — EARNINGS DISCLAIMER */}
      <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 03 of 14 — Worker Users</p>
      <h2 className="!border-t-0 !pt-0 !mt-0">Earnings Disclaimer</h2>
      <div className="info-box">Thankly earnings reports are organizational tools — not audited statements, income guarantees, or professional financial advice.</div>

      <h2>1. No Earnings Guarantee</h2>
      <p>Thankly does not guarantee any income, tip amounts, or earning levels. Tips are voluntary. Past history does not predict future earnings.</p>

      <h2>2. What Reports Do and Do Not Include</h2>
      <p>Reports include only tips processed through Thankly. They do NOT include:</p>
      <ul>
        <li>Cash tips or tips from other platforms</li>
        <li>Wages or employer-paid income</li>
        <li>Any other income</li>
      </ul>
      <p>Reports are NOT:</p>
      <ul>
        <li>Audited financial statements</li>
        <li>Certified income verification</li>
        <li>Substitutes for pay stubs</li>
        <li>IRS-recognized tax documents</li>
      </ul>

      <h2>3. Third-Party Use</h2>
      <p>Sharing reports with landlords, lenders, or government agencies is at your own risk. Thankly makes no representation that any third party will accept them for any purpose.</p>

      <h2>4. Accuracy</h2>
      <p>Reports reflect transactions as recorded. Notify us of discrepancies at <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> promptly.</p>

      <h2>5. No Professional Advice</h2>
      <p>Nothing on Thankly constitutes financial, legal, or accounting advice. Consult a qualified professional for your specific situation.</p>

      {/* DOCUMENT 04 — TAX DISCLAIMER */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 04 of 14 — Worker Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Tax Disclaimer</h2>
      </div>
      <div className="info-box">Tax Pocket estimates are a convenience feature only. Thankly is not a tax professional, CPA, or enrolled agent.</div>

      <h2>6. What the Tax Pocket Is</h2>
      <p>The Estimated Tax Pocket (also called "Safe-to-Spend Balance") estimates the portion of tip income to set aside for taxes. It is:</p>
      <ul>
        <li>Based on simplified, publicly available tax rate assumptions</li>
        <li>Not individualized to your deductions, filing status, or credits</li>
        <li>Not endorsed by the IRS or any state tax authority</li>
        <li>Subject to change as tax laws change, without notice</li>
      </ul>

      <h2>7. Nature of Tax Pocket Funds</h2>
      <p>The Tax Pocket is a display-only calculation. No funds are physically moved, segregated, or held in escrow. No interest accrues. All funds remain legally yours within your Stripe Connected Account balance until disbursed via Payout.</p>
      <div className="warning-box"><strong>If tax rates change during the year, the Tax Pocket estimate may be inaccurate. You are solely responsible for monitoring tax law changes and adjusting your savings. Thankly holds zero liability for tax shortfalls, underpayments, or penalties from reliance on these estimates.</strong></div>

      <h2>8. IRS Tax Form Issuance — What Thankly Does and Does Not Issue</h2>
      <p>Thankly does not issue Form 1099-NEC (Nonemployee Compensation) or Form 1099-MISC to Worker Users. Tip payments are peer-to-peer gratuities processed by Stripe — not wages, fees for services, or nonemployee compensation reportable under 1099-NEC or 1099-MISC rules.</p>
      <p>The applicable IRS form is Form 1099-K, issued directly by Stripe (not Thankly) to Worker Users who meet the applicable reporting threshold. Current thresholds are available at <a href="https://irs.gov" target="_blank" rel="noopener noreferrer">irs.gov</a>.</p>
      <div className="warning-box"><strong>The absence of a 1099-NEC or 1099-MISC from Thankly does not mean tip income is non-taxable. All tip income must be reported on your federal and state returns regardless of whether you receive a tax form. Consult a qualified tax professional.</strong></div>

      <h2>9. Your Tax Obligations</h2>
      <ul>
        <li>Report all tip income on your federal and applicable state returns</li>
        <li>Pay all self-employment and income taxes owed</li>
        <li>Make quarterly estimated tax payments to the IRS if required</li>
        <li>Maintain income records as required by law</li>
      </ul>
      <p>Thankly does not withhold taxes. You are not an employee of Thankly. See Worker Classification Disclaimer below.</p>

      <h2>10. No Liability for Tax Decisions</h2>
      <p>Thankly is not liable for penalties, interest, underpayments, or any other tax consequences arising from use of the Tax Pocket or any other Platform information. Consult a licensed CPA or enrolled agent.</p>

      {/* DOCUMENT 05 — PAYMENT PROCESSING DISCLOSURE */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 05 of 14 — All Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Payment Processing Disclosure</h2>
      </div>

      <h2>11. Our Payment Processor</h2>
      <p>All payments are processed by Stripe, Inc. Thankly is not a payment processor, bank, or money transmitter.</p>
      <div className="info-box">Worker Users: By registering on Thankly, you agree to the <a href="https://stripe.com/connect-account/legal" target="_blank" rel="noopener noreferrer">Stripe Connected Account Agreement</a>. This governs your rights regarding payment processing, fund holding, payout timing, and dispute resolution.</div>

      <h2>12. How a Tip Payment Works</h2>
      <ul>
        <li>Customer enters a tip amount on the Worker's Thankly QR page</li>
        <li>Stripe authorizes and captures the payment from the Customer's card</li>
        <li>Thankly deducts the applicable platform fee</li>
        <li>Net amount is credited to the Worker's Stripe Connect account balance</li>
        <li>Worker initiates a Payout using Standard or Instant method (see Section 13)</li>
      </ul>

      <h2>13. Platform Fee</h2>
      <p>Fee is a percentage of each transaction, shown before payment is confirmed. The Customer may cover the fee (Worker receives 100% of intended tip) or the fee is deducted from the Worker's tip. Fees are non-refundable absent legal requirement or approved exception under the Refund Policy.</p>

      <h2>14. Payout Options</h2>
      <p>Worker Users may choose between two payout methods when initiating a transfer from their Stripe balance:</p>
      <h3>14.1 Standard Payout (Default)</h3>
      <ul>
        <li>Funds are transferred to the Worker's linked bank account via ACH</li>
        <li>Typical arrival: 1–2 business days after payout is initiated</li>
        <li>No additional fee charged by Thankly for standard payouts</li>
        <li>Subject to Stripe's standard ACH processing timelines</li>
      </ul>
      <h3>14.2 Instant Payout (Optional Premium Feature)</h3>
      <ul>
        <li>Funds are transferred to the Worker's linked debit card via Visa Direct or Mastercard Send</li>
        <li>Typical arrival: within minutes of payout initiation when eligible</li>
        <li>A fee assessed by Stripe applies to each Instant Payout — the applicable rate is displayed before the Worker confirms</li>
        <li>Requires a Visa or Mastercard debit card linked to the Worker's Stripe account</li>
        <li>Subject to eligibility requirements set by Stripe, the Worker's card issuer, and Visa/Mastercard network rules</li>
        <li>Not all cards or accounts are eligible for Instant Payouts; Thankly makes no guarantee of Instant Payout availability for any specific account</li>
      </ul>

      <h2>15. Rolling Reserves and Payout Holds</h2>
      <p>Stripe may establish a reserve or delay payouts (for either Standard or Instant methods) if an anomalous spike in high-dollar tip transactions is detected, elevated chargeback rates are associated with your account, outstanding identity verification requirements exist, or a compliance hold or law enforcement order applies. Thankly has no control over Stripe's reserve or hold decisions and is not liable for resulting delays.</p>

      <h2>16. Cross-Border and Multi-Currency Limitations</h2>
      <p>The US Platform operates exclusively in USD at launch. All US Platform transactions must be initiated and settled in USD. Foreign card holders will have transactions converted to USD by their card issuer or Stripe at the applicable exchange rate. Thankly applies no additional conversion fee; exchange rate risk rests with the Customer.</p>
      <div className="warning-box"><strong>International Customers:</strong> Your card issuer may apply a foreign transaction fee when tipping in USD. Thankly is not responsible for these fees.</div>
      <p>Canada Phase 2: CAD-denominated transactions will be supported within Canada only. Cross-currency US–Canada transactions will not be supported at initial Canadian launch.</p>

      <h2>17. Identity Verification (KYC)</h2>
      <p>Workers must complete Stripe's KYC process (government-issued ID and date of birth) before receiving any payouts. This is a federal legal requirement.</p>

      <h2>18. Chargebacks</h2>
      <p>A Customer chargeback may result in deduction from future Worker payouts. Repeated chargebacks may trigger account suspension. See <a href="/terms">Refund & Chargeback Policy</a>.</p>

      <h2>19. Limitations</h2>
      <p>Thankly does not offer loans, cash advances, or earned wage access. The Platform facilitates voluntary tip payments only.</p>

      {/* DOCUMENT 06 — WORKER CLASSIFICATION DISCLAIMER */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 06 of 14 — Worker Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Worker Classification Disclaimer</h2>
      </div>
      <div className="info-box">Thankly is a technology platform, not an employer. Workers are independent users — not employees, contractors, or agents of Thankly LLC.</div>

      <h2>20. No Employment Relationship</h2>
      <p>Using Thankly does not create any employment, agency, partnership, or joint venture with Thankly LLC. We do not:</p>
      <ul>
        <li>Set schedules or control your work</li>
        <li>Withhold income taxes, Social Security, or Medicare</li>
        <li>Provide workers' compensation, health insurance, or benefits</li>
        <li>Pay minimum wage, overtime, or other wage-and-hour protections</li>
      </ul>

      <h2>21. Your Employer</h2>
      <p>Your employment relationship is with your restaurant, hotel, salon, or other employer — not Thankly. We do not affect that relationship.</p>

      <h2>22. Tax Obligations</h2>
      <p>You are solely responsible for all taxes on tip income, including self-employment tax where applicable. See Tax Disclaimer above.</p>

      <h2>23. No Benefits from Thankly</h2>
      <p>No Thankly employment benefits. This does not affect any benefits you have from your actual employer.</p>

      <h2>24. Jurisdiction-Specific Laws</h2>
      <p>Classification laws vary by state and locality. Consult an employment attorney if you have questions about your status.</p>

      {/* DOCUMENT 12 — CONSUMER FEE DISCLOSURE */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 12 of 14 — Customer Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">Consumer Fee Disclosure</h2>
      </div>
      <div className="info-box">This disclosure applies to anyone sending a tip through Thankly, provided in compliance with federal and state consumer protection laws governing fee transparency.</div>

      <h2>25. Fee Transparency Commitment</h2>
      <p>No fees are hidden, deferred, or disclosed only after payment is confirmed. This document explains every fee and when it will be shown to you.</p>

      <h2>26. The Processing Fee</h2>
      <p>Thankly charges a processing fee per tip transaction, always calculated and displayed before you confirm. You will be presented with a clear choice:</p>
      <ul>
        <li>Cover the fee yourself: total charge = tip + fee. Worker receives 100% of your intended tip.</li>
        <li>Have the fee deducted: total charge = tip only. Worker receives tip minus the fee.</li>
      </ul>
      <p>The exact dollar amount, how it is applied, and your total charge are shown on the confirmation screen before you tap "Confirm Tip."</p>

      <h2>27. No Surprise Fees</h2>
      <ul>
        <li>No fee is charged that was not fully disclosed on the pre-confirmation screen</li>
        <li>No additional fees are added after you tap "Confirm Tip"</li>
        <li>The total amount charged will exactly match what was shown</li>
        <li>Thankly does not charge subscriptions, account fees, or recurring fees to Customer Users</li>
      </ul>

      <h2>28. What Thankly Is Not</h2>
      <p>Thankly is not a payment processor. Payments are processed by Stripe, Inc. Thankly never receives, holds, or takes custody of your funds.</p>

      <h2>29. No Recurring Charges</h2>
      <p>Charged only for transactions you individually authorize. No stored payment method or recurring charges without explicit separate consent.</p>

      <h2>30. Receipts</h2>
      <p>A receipt is sent to your email (if provided) documenting the tip, fee, and total charged. Retain for your records.</p>

      <h2>31. Refund Rights</h2>
      <p>Tips are voluntary gratuities. Refunds are not generally available. See <a href="/terms">Refund & Chargeback Policy</a> for limited exceptions.</p>

      <h2>32. Questions</h2>
      <p>Contact <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> for transaction questions or fee disputes.</p>

      {/* DOCUMENT 13 — SMS & EMAIL COMMUNICATION CONSENT */}
      <div className="mt-16 pt-12 border-t-2 border-slate-200">
        <p className="text-xs font-bold tracking-widest uppercase text-[#00B4D8] mb-2">Document 13 of 14 — All Users</p>
        <h2 className="!border-t-0 !pt-0 !mt-0">SMS & Email Communication Consent</h2>
      </div>
      <div className="info-box">Provided in compliance with the Telephone Consumer Protection Act (TCPA), CAN-SPAM Act, and applicable state laws.</div>

      <h2>33. TCPA Consent — Automated SMS Messages</h2>
      <p>By providing your mobile phone number and creating a Thankly account, you expressly consent to receive automated text messages (SMS) from Thankly LLC using an automatic telephone dialing system (ATDS) or similar technology. You are not required to consent to automated SMS as a condition of purchasing any goods or services. If you do not wish to receive automated SMS, do not provide your mobile number, or opt out immediately using Section 36.</p>

      <h2>34. Transactional Communications (Required)</h2>
      <ul>
        <li>Payment receipts and tip confirmations</li>
        <li>Account security alerts</li>
        <li>Identity verification codes and status updates</li>
        <li>Payout confirmations and status</li>
        <li>Legal and policy update notices</li>
      </ul>
      <p>Transactional security SMS cannot be fully disabled as they protect your account.</p>

      <h2>35. Marketing Communications (Optional — Separate Consent)</h2>
      <p>Sent only with separate affirmative opt-in. May include product updates, earnings tips, promotions, and referral program news. Withdraw consent at any time.</p>

      <h2>36. How to Opt Out of SMS</h2>
      <ul>
        <li>Reply <strong>STOP</strong> to any Thankly SMS. One final confirmation message sent; no further non-essential SMS.</li>
        <li>Reply <strong>HELP</strong> for help and contact information.</li>
        <li>Email <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> to request removal from all SMS.</li>
      </ul>
      <div className="warning-box"><strong>Opting out of marketing SMS does not opt you out of transactional security alerts such as login verification codes. Security SMS cannot be disabled.</strong></div>

      <h2>37. Message Frequency and Rates</h2>
      <p>Transactional messages sent per event. Marketing messages: no more than 2–4 per month with consent. Standard message and data rates may apply. Thankly is not responsible for carrier charges.</p>

      <h2>38. Email Communications</h2>
      <p>Transactional emails required for account operation. Marketing emails include an unsubscribe link and require separate consent. Unsubscribe requests processed within 10 business days.</p>

      <h2>39. Push Notifications</h2>
      <p>App requests push notification permission for transaction and payout alerts. Grant or deny at any time in device settings. Denial does not affect payment processing or payouts.</p>

      <h2>40. Language</h2>
      <p>English and Spanish available. Set preference in account settings.</p>

      <h2>41. CAN-SPAM Compliance</h2>
      <p>All marketing emails include accurate sender identification, required labels, our mailing address, and a functioning one-click unsubscribe.</p>

      <h2>42. Carrier Liability</h2>
      <p>Thankly is not responsible for delayed or undelivered SMS caused by carriers or device issues. Carrier fees may apply.</p>

    </LegalLayout>
  )
}
