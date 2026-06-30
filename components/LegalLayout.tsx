'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'

type Section = {
  id: string
  label: string
  docTag?: string
}

type Props = {
  badge: string
  title: string
  description: string
  effectiveDate: string
  version: string
  sections: Section[]
  children: ReactNode
}

export default function LegalLayout({
  badge,
  title,
  description,
  effectiveDate,
  version,
  sections,
  children,
}: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  return (
    <>
      <nav className="bg-[#0F2347] h-16 flex items-center justify-between px-[5%]">
        <Link href="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00B4D8]/20 text-[#00B4D8] text-xs">T</span>
          Thankly
        </Link>
        <Link
          href="/"
          className="text-white/65 text-sm font-medium hover:text-white transition-colors flex items-center gap-1"
        >
          Back to home
        </Link>
      </nav>

      <div className="bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] px-[5%] pt-12 pb-10 text-white">
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[#00B4D8] bg-[#00B4D8]/10 text-xs font-bold px-3 py-1 rounded-full">
              {badge}
            </span>
            <span className="text-white/45 text-xs">Updated {effectiveDate}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 max-w-2xl">{title}</h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="max-w-[1040px] mx-auto px-[5%] py-12 flex gap-10">
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <div className="sticky top-8">
            <p className="text-xs font-bold tracking-widest uppercase text-[#A0AEC0] mb-3 px-3">
              On this page
            </p>
            <nav className="flex flex-col gap-0.5">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                    activeId === s.id
                      ? 'bg-[#F0F6FF] text-[#1B3A6B] font-semibold'
                      : 'text-[#4A5568] hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-1 min-w-0 legal-content">
          <p className="text-sm text-[#718096] border-b border-slate-100 pb-6 mb-8">
            Version {version} Thankly LLC getthankly.com
          </p>
          {children}
        </div>
      </div>

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
          2026 Thankly LLC. All rights reserved. Orlando, Florida.{' '}
          <a href="mailto:hello@getthankly.com" className="hover:text-white/70 transition-colors">
            hello@getthankly.com
          </a>
        </p>
      </footer>
    </>
  )
}