'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const fadeRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-6')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* LANGUAGE BANNER */}
      <div className="bg-[#00B4D8]/10 border-b border-[#00B4D8]/20 py-2 px-[5%] text-center text-sm text-[#4A5568]">
        🇪🇸 ¿Prefieres español?{' '}
        <a href="#español" className="text-[#1B3A6B] font-bold">
          Ver en Español
        </a>
      </div>

      {/* NAV */}
      <nav className="fixed top-[40px] left-0 right-0 z-50 bg-[#1B3A6B]/97 backdrop-blur-md h-16 flex items-center justify-between px-[5%]">
        <Link href="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
          <Image src="/images/thanklyappicon.png" alt="Thankly" width={36} height={36} className="rounded-lg" />
          Thankly
        </Link>
        <ul className="hidden md:flex items-center gap-8 list-none">
          {[
            { href: '#how-it-works', label: 'How it works' },
            { href: '#features', label: 'Features' },
            { href: '#founding', label: 'Founding 500' },
            { href: '#business', label: 'For Business' },
          ].map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-white/80 text-sm font-medium hover:text-white transition-colors">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/auth"
              className="bg-[#00B4D8] text-[#0F2347] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#90E0EF] transition-colors"
            >
              Join Free
            </a>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="min-h-screen bg-gradient-to-br from-[#0F2347] via-[#1B3A6B] to-[#1a4a8a] flex items-center pt-32 pb-20 px-[5%] relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00B4D8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#00B4D8]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto w-full grid md:grid-cols-2 gap-20 items-center relative z-10">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00B4D8]/15 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[#00B4D8] rounded-full animate-pulse" />
              Now accepting Founding 500 members
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Your tips.<br />
              <span className="text-[#00B4D8]">Your money.</span><br />
              Your future.
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-[480px]">
              Thankly is the bilingual financial platform built for service workers. Collect digital tips, track every dollar, and build your financial future — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/auth"
                className="inline-flex items-center gap-2 bg-[#00B4D8] text-[#0F2347] font-extrabold text-base px-8 py-4 rounded-full hover:bg-[#90E0EF] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,180,216,0.35)] transition-all"
              >
                Join Founding 500 — Free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-transparent text-white font-bold text-base px-8 py-4 rounded-full border-2 border-white/30 hover:border-white/70 hover:bg-white/8 transition-all"
              >
                See how it works
              </a>
            </div>

            <div className="flex gap-8 mt-12 pt-10 border-t border-white/10">
              {[
                { value: '100%', label: 'of your tip, yours' },
                { value: '$0', label: 'to get started' },
                { value: 'EN/ES', label: 'fully bilingual' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                  <div className="text-xs text-white/55 mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Phone mockup */}
          <div className="flex justify-center items-center relative">
            <div className="relative w-[280px]">
              {/* Tip notification */}
              <div className="absolute top-16 -right-14 bg-white rounded-2xl px-4 py-3 shadow-2xl w-44 animate-[float_3s_ease-in-out_infinite] z-10">
                <div className="flex items-center gap-1 text-xs text-[#718096] mb-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  New tip received
                </div>
                <div className="text-2xl font-black text-[#1B3A6B]">$25.00</div>
                <div className="text-xs text-green-600 font-semibold">✓ You keep 100%</div>
              </div>

              {/* Payout badge */}
              <div className="absolute bottom-24 -left-16 bg-[#1B3A6B] text-white rounded-xl px-4 py-2.5 shadow-2xl text-xs font-bold animate-[float_3s_ease-in-out_1.5s_infinite] z-10 whitespace-nowrap">
                Payout sent
                <span className="text-[#00B4D8] text-base font-black block">$847.50</span>
                this week
              </div>

              {/* Phone frame */}
              <div className="w-[280px] h-[560px] bg-[#0F2347] rounded-[40px] border-[8px] border-white/15 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                {/* Notch */}
                <div className="w-20 h-6 bg-[#0F2347] rounded-b-2xl mx-auto" />

                {/* Screen */}
                <div className="h-full bg-gradient-to-b from-[#1B3A6B] from-45% to-[#f0f6ff] to-45% px-4 pb-4 flex flex-col">
                  {/* Logo */}
                  <div className="flex flex-col items-center pt-3 pb-2">
                    <Image src="/images/thanklyappicon.png" alt="Thankly" width={44} height={44} className="rounded-xl" />
                    <span className="text-white font-black text-sm mt-1">Thankly</span>
                  </div>

                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-red-400 border-3 border-white mx-auto flex items-center justify-center text-2xl mb-1">
                    👩
                  </div>

                  <p className="text-white font-bold text-sm text-center mb-0.5">Good evening, Maria 👋</p>
                  <p className="text-white/70 text-xs text-center mb-2">Cviche 305 📍</p>

                  {/* Card */}
                  <div className="bg-white rounded-2xl p-3 shadow-lg">
                    <p className="text-xs font-black text-center text-[#0D1B2A] mb-2">Today's Performance</p>
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {[
                        { label: 'Tips', value: '$142' },
                        { label: 'Txns', value: '8' },
                        { label: 'Net', value: '$136' },
                      ].map((m) => (
                        <div key={m.label} className="text-center">
                          <div className="text-[10px] text-[#718096]">{m.label}</div>
                          <div className="text-sm font-black text-[#0D1B2A]">{m.value}</div>
                        </div>
                      ))}
                    </div>
                    {/* Bars */}
                    <div className="flex items-end justify-between gap-1 h-10 px-1">
                      {[40, 65, 50, 80, 55, 90, 100].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t ${i === 6 ? 'bg-[#1B3A6B]' : 'bg-[#90E0EF]/60'}`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-[#e8f0fe] rounded-xl py-2 text-center text-[10px] font-bold text-[#1B3A6B]">📱 View QR</div>
                    <div className="bg-[#e8f0fe] rounded-xl py-2 text-center text-[10px] font-bold text-[#1B3A6B]">💸 Payout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F0F6FF] py-24 px-[5%]" id="how-it-works">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 fade-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[#00B4D8] text-xs font-bold tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tight mb-4">Up and earning in minutes</h2>
            <p className="text-[#4A5568] text-lg leading-relaxed max-w-xl mx-auto">No cash register needed. No hardware to buy. Just your phone and your Thankly QR code.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: '1', title: 'Create your profile', desc: 'Sign up free, add your photo, workplace, and personalized bio. Your public tip page is live in minutes.', bg: 'bg-[#1B3A6B]' },
              { n: '2', title: 'Connect your bank', desc: 'Securely link your bank account through Stripe Express. Bank-level security, zero hassle.', bg: 'bg-gradient-to-br from-[#1B3A6B] to-[#00B4D8]' },
              { n: '3', title: 'Share your QR code', desc: 'Display your QR at your table, station, or workspace. Customers scan and tip in seconds.', bg: 'bg-gradient-to-br from-[#00B4D8] to-[#254d8f]' },
              { n: '4', title: 'Get paid instantly', desc: 'Tips hit your Thankly account in real time. Cash out instantly or let it build — your choice.', bg: 'bg-[#00B4D8]' },
            ].map((step, i) => (
              <div key={i} className="text-center fade-up opacity-0 translate-y-6 transition-all duration-700" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`w-16 h-16 rounded-full ${step.bg} text-white text-xl font-black flex items-center justify-center mx-auto mb-5`}>
                  {step.n}
                </div>
                <h3 className="font-extrabold text-[#0D1B2A] mb-2">{step.title}</h3>
                <p className="text-sm text-[#4A5568] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-[5%]" id="features">
        <div className="max-w-[1200px] mx-auto">
          <div className="fade-up opacity-0 translate-y-6 transition-all duration-700 mb-14">
            <p className="text-[#00B4D8] text-xs font-bold tracking-widest uppercase mb-3">Built for workers</p>
            <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tight">Everything you need.<br />Nothing you don't.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📱', title: 'Your personal tip page', desc: 'A beautiful public profile at getthankly.com/yourname. Customers scan your QR, see your face, and tip you directly.' },
              { icon: '💰', title: 'Keep 100% of your tip', desc: 'When customers cover the processing fee, you receive every dollar they intended for you. Zero deductions from your tip.' },
              { icon: '📊', title: 'Real-time earnings dashboard', desc: 'Track tips by day, week, or month. See trends, top days, and your full transaction history — always current.' },
              { icon: '🏦', title: 'Instant or standard payouts', desc: 'Need money now? Instant payout in minutes. Or let it accumulate and transfer on your schedule.' },
              { icon: '🧾', title: 'Estimated Tax Pocket', desc: 'Set your estimated tax rate and Thankly tracks how much to set aside automatically. No surprises at tax time.' },
              { icon: '📄', title: 'Accounting-grade exports', desc: 'Download professional PDF or Excel reports for any date range. Perfect for tax prep, loan applications, or your own records.' },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-[#00B4D8] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,180,216,0.12)] transition-all fade-up opacity-0 translate-y-6 duration-700"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className="font-extrabold text-[#0D1B2A] mb-2">{f.title}</h3>
                <p className="text-sm text-[#4A5568] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BILINGUAL */}
      <section className="bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] py-24 px-[5%] relative overflow-hidden" id="español">
        <div className="absolute top-[-50%] right-[-20%] w-[700px] h-[700px] bg-[#00B4D8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          <div className="fade-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[#00B4D8] text-xs font-bold tracking-widest uppercase mb-3">Fully bilingual</p>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-6">Built for the community<br />that runs hospitality.</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Thankly is built in English and Spanish from the ground up — not translated, conversion-optimized. Every screen, every notification, every dollar.
            </p>
            <a href="#founding" className="inline-flex items-center gap-2 bg-[#00B4D8] text-[#0F2347] font-extrabold px-8 py-4 rounded-full hover:bg-[#90E0EF] transition-colors">
               Join Free — Únete gratis
            </a>
          </div>

          <div className="flex flex-col gap-4 fade-up opacity-0 translate-y-6 transition-all duration-700">
            {[
              { flag: '🇺🇸', lang: 'English', text: '"You just made Maria\'s day!"', sub: 'She received your full $20. Zero fees deducted.' },
              { flag: '🌎', lang: 'Español', text: '"¡Acabas de alegrarle el día a María!"', sub: 'Recibió tu apoyo completo de $20. Sin deducciones.' },
              { flag: '💳', lang: 'Tip page copy', text: '"Apoya a María" not just "Leave a tip"', sub: 'Warm, conversion-optimized Spanish throughout' },
            ].map((card) => (
              <div key={card.lang} className="bg-white/8 border border-white/12 rounded-2xl px-6 py-5 flex items-start gap-4">
                <span className="text-4xl">{card.flag}</span>
                <div>
                  <p className="text-white/50 text-xs mb-1">{card.lang}</p>
                  <p className="text-white font-bold">{card.text}</p>
                  <p className="text-[#00B4D8] text-sm mt-1">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDING 500 */}
      <section className="bg-[#F0F6FF] py-24 px-[5%]" id="founding">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="fade-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[#00B4D8] text-xs font-bold tracking-widest uppercase mb-3">Founding 500</p>
            <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tight leading-tight mb-6">Be one of the first.<br />Lock your rate forever.</h2>
            <p className="text-[#4A5568] text-lg leading-relaxed mb-8">The first 500 workers to join Thankly become Founding Members — with permanent benefits that standard members never get.</p>

            <ul className="flex flex-col gap-4 mb-8">
              {[
                { bold: '2% platform fee for life', rest: ' — locked permanently vs. 4% standard rate' },
                { bold: 'Founding Member badge', rest: ' on your public profile — permanent' },
                { bold: 'Monthly referral contest', rest: ' — $200 / $100 / $50 cash prizes' },
                { bold: 'Premium QR card', rest: ' — physical status card for your workspace' },
                { bold: 'Early access', rest: ' to every new feature before public release' },
              ].map((perk, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00B4D8]/15 border border-[#00B4D8] flex items-center justify-center flex-shrink-0 mt-0.5 text-[#00B4D8] text-xs font-bold">✓</div>
                  <span className="text-[#0D1B2A] text-[0.95rem]"><strong>{perk.bold}</strong>{perk.rest}</span>
                </li>
              ))}
            </ul>

            <a href="/auth" className="inline-flex items-center gap-2 bg-[#00B4D8] text-[#0F2347] font-extrabold px-8 py-4 rounded-full hover:bg-[#90E0EF] hover:-translate-y-0.5 transition-all">
              Claim your spot — It's free
            </a>
          </div>

          <div className="flex justify-center fade-up opacity-0 translate-y-6 transition-all duration-700">
            <div className="bg-[#1B3A6B] rounded-3xl px-10 py-12 text-center max-w-sm w-full relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00B4D8]/20 rounded-full blur-2xl" />
              <div className="text-8xl font-black text-[#00B4D8] leading-none tracking-tight">500</div>
              <div className="text-white font-bold mt-2">Founding Member Spots</div>
              <div className="text-white/50 text-sm mb-6">Limited. First come, first served.</div>
              <div className="bg-white/10 rounded-full h-2 overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] rounded-full w-[23%]" />
              </div>
              <div className="text-white/50 text-xs text-right">383 spots remaining</div>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS */}
      <section className="py-24 px-[5%]" id="business">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="fade-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[#00B4D8] text-xs font-bold tracking-widest uppercase mb-3">For businesses</p>
            <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tight leading-tight mb-4">Give your team a<br />financial edge.</h2>
            <p className="text-[#4A5568] text-lg leading-relaxed mb-8">Deploy Thankly across your entire staff in minutes. No hardware. No integration. Workers are live same day.</p>

            <div className="flex flex-col gap-6">
              {[
                { icon: '👥', title: 'Team dashboard', desc: 'See all workers, combined tip volume, and team performance in one view.' },
                { icon: '📊', title: 'Combined reports', desc: 'Export PDF or Excel reports for your entire team by date range — ready for accounting.' },
                { icon: '✉️', title: 'Simple worker onboarding', desc: 'Invite workers by email. They\'re set up and receiving tips the same shift.' },
              ].map((f) => (
                <div key={f.title} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-[#F0F6FF] flex items-center justify-center text-xl flex-shrink-0">{f.icon}</div>
                  <div>
                    <h3 className="font-bold text-[#0D1B2A] mb-1">{f.title}</h3>
                    <p className="text-sm text-[#4A5568] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report preview */}
          <div className="bg-[#F0F6FF] rounded-2xl p-7 border border-slate-200 fade-up opacity-0 translate-y-6 transition-all duration-700">
            <div className="flex items-center justify-between mb-5">
              <span className="font-extrabold text-[#0D1B2A]">Team Report — June 2026</span>
              <span className="bg-[#1B3A6B] text-white text-xs font-bold px-3 py-1 rounded-full">PDF Ready</span>
            </div>
            {[
              { label: 'Total tips collected', value: '$12,847.50' },
              { label: 'Active workers', value: '23' },
              { label: 'Total transactions', value: '1,204' },
              { label: 'Avg tip per transaction', value: '$10.67' },
              { label: 'Workers paid out', value: '23 / 23', green: true },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-slate-200 last:border-0">
                <span className="text-sm text-[#4A5568]">{row.label}</span>
                <span className={`text-sm font-bold ${row.green ? 'text-green-600' : 'text-[#0D1B2A]'}`}>{row.value}</span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-[#1B3A6B] text-white text-center py-2.5 rounded-xl text-xs font-bold">⬇ Export PDF</div>
              <div className="border border-[#1B3A6B] text-[#1B3A6B] text-center py-2.5 rounded-xl text-xs font-bold">⬇ Export Excel</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] py-24 px-[5%] text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-[#00B4D8]/12 rounded-full blur-3xl" />
        </div>
        <div className="max-w-[860px] mx-auto relative z-10 fade-up opacity-0 translate-y-6 transition-all duration-700">
          <h2 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">Ready to take control<br />of your tips?</h2>
          <p className="text-white/70 text-xl mb-10">Join Thankly free. No monthly fees. No hardware. Just your money — organized, tracked, and paid out on your terms.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/auth" className="inline-flex items-center gap-2 bg-[#00B4D8] text-[#0F2347] font-extrabold px-8 py-4 rounded-full hover:bg-[#90E0EF] hover:-translate-y-0.5 transition-all">
              Get started free
            </a>
            <a href="#how-it-works" className="inline-flex items-center gap-2 bg-transparent text-white font-bold px-8 py-4 rounded-full border-2 border-white/30 hover:border-white/70 transition-all">
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F2347] pt-16 pb-8 px-[5%]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/8 mb-8">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tight mb-4">
                <Image src="/images/thanklyappicon.png" alt="Thankly" width={32} height={32} className="rounded-lg" />
                Thankly
              </Link>
              <p className="text-white/50 text-sm leading-relaxed max-w-[280px]">
                The bilingual financial platform for tipped hospitality workers. Your tips. Your records. Your money under your control.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: [
                  { href: '#how-it-works', label: 'How it works' },
                  { href: '#features', label: 'Features' },
                  { href: '#founding', label: 'Founding 500' },
                  { href: '#business', label: 'For Business' },
                ],
              },
              {
                title: 'Support',
                links: [
                  { href: 'mailto:hello@getthankly.com', label: 'Contact us' },
                  { href: 'mailto:hello@getthankly.com', label: 'legal@getthankly.com' },
                  { href: 'mailto:legal@getthankly.com', label: 'support@getthankly.com' },
                ],
              },
              {
                title: 'Legal',
                links: [
                   { href: '/privacy', label: 'Privacy Policy' },
                   { href: '/terms', label: 'Terms of Service' },
                   { href: '/disclosures', label: 'Disclosures' },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-white/60 text-sm hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-white/40 text-xs">© 2026 Thankly LLC. All rights reserved. Orlando, Florida.</p>
            <div className="flex gap-5 flex-wrap">
              {[
                { href: '/privacy', label: 'Privacy' },
                { href: '/terms', label: 'Terms' },
                { href: '/disclosures', label: 'Disclosures' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-white/40 text-xs hover:text-white/80 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  )
}
