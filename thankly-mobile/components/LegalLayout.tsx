import Link from 'next/link'

interface LegalLayoutProps {
  docNumber: string
  audience: string
  title: string
  effectiveDate?: string
  version?: string
  summary?: string
  children: React.ReactNode
}

export default function LegalLayout({
  docNumber,
  audience,
  title,
  effectiveDate = 'June 1, 2025',
  version = '1.2 (Final)',
  summary,
  children,
}: LegalLayoutProps) {
  return (
    <>
      {/* NAV */}
      <nav className="bg-[#0F2347] h-16 flex items-center justify-between px-[5%]">
        <Link href="/" className="text-white font-black text-xl tracking-tight">
          Thankly
        </Link>
        <Link
          href="/"
          className="text-white/65 text-sm font-medium hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back to home
        </Link>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] px-[5%] pt-14 pb-12 text-white">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[#00B4D8] text-xs font-bold tracking-widest uppercase mb-3">
            Document {docNumber} — {audience}
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-3">{title}</h1>
          <div className="flex flex-wrap gap-5 text-white/55 text-sm">
            <span>Effective {effectiveDate}</span>
            <span>Version {version}</span>
            <span>Thankly LLC — getthankly.com</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-[860px] mx-auto px-[5%] pt-14 pb-20">
        {summary && (
          <div className="bg-[#F0F6FF] border-l-4 border-[#00B4D8] rounded-r-xl px-6 py-5 mb-10 text-[#4A5568] text-[0.95rem] italic leading-relaxed">
            {summary}
          </div>
        )}
        <div className="legal-content">{children}</div>
      </div>

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
          <a href="mailto:hello@getthankly.com" className="hover:text-white/70 transition-colors">
            hello@getthankly.com
          </a>
        </p>
      </footer>
    </>
  )
}
