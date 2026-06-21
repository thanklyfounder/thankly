import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Help & Support — Thankly',
  description: 'Get help with your Thankly account, payouts, QR page, and profile.',
}

const faqs = [
  {
    q: 'Does Thankly withhold taxes?',
    a: 'No. Thankly provides an Estimated Tax Pocket as a convenience tool only — it shows you how much to set aside based on a rate you choose. Thankly does not withhold, remit, or pay taxes on your behalf. You are solely responsible for reporting and paying your own taxes. See our Tax Disclaimer for full details.',
  },
  {
    q: 'Who handles my bank account details?',
    a: 'Your bank account and payout information is managed securely through Stripe Express — a bank-level payment platform. Thankly never stores your full bank account number, routing number, or debit card details.',
  },
  {
    q: 'How do I get paid?',
    a: 'Once you have a connected Stripe account and a verified bank account, you can initiate a payout from the Payouts tab in the app. Standard payouts arrive in 1–2 business days via ACH. Instant payouts to an eligible debit card are available within minutes and carry a small Stripe fee.',
  },
  {
    q: 'Can I change my QR profile?',
    a: 'Yes. Go to Settings → Profile Information to update your display name, photo, workplace, bio (English and Spanish), and your public profile link.',
  },
  {
    q: 'Can I change my Tax Pocket rate?',
    a: 'Yes. Go to Settings → Financial Preferences to choose from 0%, 10%, 15%, 20%, 25%, or a custom percentage. Your Tax Pocket estimate updates immediately.',
  },
  {
    q: 'What if a customer wants a refund?',
    a: 'Tips are voluntary gratuities, not purchases. Refunds are not generally available after a transaction is completed. Exceptions may be reviewed for duplicate transactions caused by a technical error, unauthorized fraud, or obvious input errors. Submit refund requests within 7 days to support@getthankly.com with your transaction details.',
  },
  {
    q: 'Why hasn\'t my payout arrived?',
    a: 'Standard payouts typically arrive within 1–2 business days after you initiate them. Stripe may place holds for identity verification, elevated chargebacks, or compliance reviews. Thankly has no control over Stripe\'s hold or reserve decisions. If your payout is delayed, check your Stripe Express dashboard or contact Stripe directly at stripe.com/contact.',
  },
  {
    q: 'How do I connect or update my bank account?',
    a: 'Go to Settings → Bank Account (Stripe) → Open Stripe Dashboard. All bank account changes are made directly inside your Stripe Express account, which Thankly links to.',
  },
  {
    q: 'How do I deactivate my account?',
    a: 'Go to Settings → Account Deactivation → Keep My Account Active / Deactivate Account. Deactivation hides your public QR page and stops customers from tipping you. Your transaction history is preserved. You can reactivate at any time by contacting support@getthankly.com.',
  },
  {
    q: 'How do I permanently delete my account?',
    a: 'Go to Settings → Account Deactivation → Delete Account. Deletion permanently removes your name, email, photo, QR code, and login credentials within 30 days. Transaction records are retained for 7 years as required by IRS financial regulations. You will receive a confirmation email detailing what was deleted and what is archived.',
  },
  {
    q: 'The app is showing an error. What should I do?',
    a: 'Try closing and reopening the app. If the issue persists, sign out and sign back in. For ongoing issues, contact support@getthankly.com with a description of what you were doing when the error appeared and your device type (iPhone/Android).',
  },
  {
    q: 'Can I use Thankly in Spanish?',
    a: 'Yes. Thankly is fully bilingual. Go to Settings and toggle the language between English and Español. All screens, notifications, and your public tip page support both languages.',
  },
]

const contactCards = [
  {
    icon: '💬',
    title: 'General Support',
    desc: 'Questions about your account, QR page, payouts, or the app.',
    email: 'support@getthankly.com',
    cta: 'Email support',
  },
  {
    icon: '⚖️',
    title: 'Legal & Compliance',
    desc: 'Questions about our policies, disclosures, or legal documents.',
    email: 'legal@getthankly.com',
    cta: 'Email legal',
  },
  {
    icon: '🏢',
    title: 'Business Inquiries',
    desc: 'Setting up a business account, team management, or enterprise arrangements.',
    email: 'hello@getthankly.com',
    cta: 'Email us',
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="bg-[#0F2347] h-16 flex items-center justify-between px-[5%]">
        <Link href="/" className="text-white font-black text-xl tracking-tight">
          Thankly
        </Link>
        <Link
          href="/"
          className="text-white/65 text-sm font-medium hover:text-white transition-colors"
        >
          ← Back to home
        </Link>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] px-[5%] pt-14 pb-16 text-white">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[#00B4D8] text-xs font-bold tracking-widest uppercase mb-3">
            Help & Support
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed">
            Get help with your Thankly account, payouts, QR page, and more. We typically respond within 24–48 hours.
          </p>
        </div>
      </div>

      {/* CONTACT CARDS */}
      <section className="px-[5%] py-16 bg-[#F0F6FF]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-2xl font-black text-[#0D1B2A] tracking-tight mb-8">
            Contact Thankly
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#00B4D8] hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-4 block">{card.icon}</span>
                <h3 className="font-extrabold text-[#0D1B2A] mb-2">{card.title}</h3>
                <p className="text-sm text-[#4A5568] leading-relaxed mb-4">{card.desc}</p>
                <a
                  href={`mailto:${card.email}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B3A6B] hover:text-[#00B4D8] transition-colors"
                >
                  {card.cta} →
                </a>
                <p className="text-xs text-[#718096] mt-1">{card.email}</p>
              </div>
            ))}
          </div>

          {/* Response time note */}
          <div className="mt-6 bg-white border border-slate-200 rounded-xl px-6 py-4 flex items-center gap-3">
            <span className="text-xl">⏱️</span>
            <p className="text-sm text-[#4A5568]">
              <strong className="text-[#0D1B2A]">Response time:</strong> We aim to respond to all support emails within 24–48 hours, Monday through Friday. Legal inquiries may take up to 5 business days.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-2xl font-black text-[#0D1B2A] tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-[#4A5568] mb-10">
            Can't find your answer? Email us at{' '}
            <a href="mailto:support@getthankly.com" className="text-[#1B3A6B] font-semibold">
              support@getthankly.com
            </a>
          </p>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none hover:bg-[#F0F6FF] transition-colors">
                  <span className="font-bold text-[#0D1B2A] pr-4">{faq.q}</span>
                  <span className="text-[#1B3A6B] text-xl font-light flex-shrink-0 group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 pt-1 text-sm text-[#4A5568] leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LEGAL LINKS */}
      <section className="px-[5%] py-12 bg-[#F0F6FF]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-lg font-extrabold text-[#0D1B2A] mb-6">
            Legal & Policy Documents
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                href: '/privacy',
                title: 'Privacy Policy',
                desc: 'How we collect, use, and protect your information. Includes Data Retention Policy.',
              },
              {
                href: '/terms',
                title: 'Terms of Service',
                desc: 'Platform terms, acceptable use, refund policy, QR code disclosure, and business terms.',
              },
              {
                href: '/disclosures',
                title: 'Disclosures',
                desc: 'Earnings, tax, payment processing, worker classification, consumer fee, and SMS disclosures.',
              },
            ].map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className="bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-[#00B4D8] hover:shadow-sm transition-all group"
              >
                <p className="font-bold text-[#0D1B2A] group-hover:text-[#1B3A6B] mb-1">
                  {doc.title} →
                </p>
                <p className="text-xs text-[#718096] leading-relaxed">{doc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD — placeholder until live */}
      <section className="px-[5%] py-12">
        <div className="max-w-[1000px] mx-auto bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] rounded-2xl px-8 py-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black mb-2">Download the Thankly app</h2>
            <p className="text-white/70 text-sm">
              Available on iOS and Android. Free to download and create your account.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="#"
              className="bg-white text-[#0F2347] font-bold text-sm px-5 py-3 rounded-xl hover:bg-[#90E0EF] transition-colors"
            >
              App Store
            </a>
            <a
              href="#"
              className="bg-white text-[#0F2347] font-bold text-sm px-5 py-3 rounded-xl hover:bg-[#90E0EF] transition-colors"
            >
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F2347] py-10 px-[5%] text-center">
        <div className="flex flex-wrap gap-5 justify-center mb-4">
          {[
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Service' },
            { href: '/disclosures', label: 'Disclosures' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/65 text-sm hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-white/40 text-xs">
          © 2026 Thankly LLC. All rights reserved. Orlando, Florida.{' '}
          <a href="mailto:support@getthankly.com" className="hover:text-white/70 transition-colors">
            support@getthankly.com
          </a>
        </p>
      </footer>

    </div>
  )
}
