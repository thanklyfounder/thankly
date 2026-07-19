'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Lang = 'en' | 'es'

const copy = {
  en: {
    switchLabel: 'Ver en Español',
    h1: 'Be one of the Founding 500.',
    sub: 'The first 500 workers on Thankly get the 2% platform fee for life — half the standard rate — plus a permanent Founding Member badge, a premium physical QR card, and early access to everything we build.',
    counterSuffix: 'of 500 spots remaining',
    counterLoading: 'Checking spots…',
    counterFull: 'The Founding 500 is closed.',
    cta: 'Claim your founding spot',
    whoTitle: 'Who this is for',
    whoBody: 'Servers. Bartenders. Barbers. Stylists. Valets. Hotel and housekeeping staff. If you work for tips, this was built for you.',
    getTitle: 'What Founding 500 members get',
    get: [
      { t: '2% for life.', d: 'Every other worker pays the standard 4% platform fee. You never will.' },
      { t: 'The badge.', d: 'A permanent Founding Member mark on your tipping page. You were here first, and everyone who tips you will see it.' },
      { t: 'The card.', d: 'A premium physical QR card for your station, counter, or badge — founding members only.' },
      { t: 'First access.', d: 'Every new tool we ship, you get before anyone else.' },
      { t: 'Monthly contests.', d: 'Bring other workers to Thankly: the top 3 recruiters each month win $200, $100, and $50. Post your best Thankly moment with #MyThanklyMoment: best post each month wins $100.' },
    ],
    howTitle: 'How it works',
    how: [
      'Claim your spot and create your profile — about 2 minutes',
      'Get your personal QR code and tipping page',
      'Customers scan and tip in seconds — no cash, no app on their side',
      'Your money arrives through payouts processed by Stripe',
    ],
    whyTitle: 'Why only 500',
    whyBody: "Because the first workers on Thankly aren't just users — they're the reason this works. The Founding 500 shape the product, star in the story, and keep the 2% rate forever. When the counter hits zero, the program closes for good.",
    fine: '2% lifetime rate applies to the Thankly platform fee for Founding 500 members per the Terms of Service; payment processing fees are separate. Contests are limited to active workers; official contest rules at getthankly.com/contest-rules. Thankly is not a bank; payments and payouts are processed through Stripe. Payout timing depends on account verification, bank eligibility, and processing timelines.',
  },
  es: {
    switchLabel: 'View in English',
    h1: 'Sé parte de los Founding 500.',
    sub: 'Los primeros 500 trabajadores en Thankly pagan la tarifa de plataforma del 2% de por vida — la mitad de la tarifa estándar — más una insignia permanente de Miembro Fundador, una tarjeta QR física premium y acceso anticipado a todo lo que construyamos.',
    counterPrefix: 'Quedan',
    counterSuffix: 'de 500 lugares',
    counterLoading: 'Verificando lugares…',
    counterFull: 'Los Founding 500 están cerrados.',
    cta: 'Reclama tu lugar fundador',
    whoTitle: 'Para quién es',
    whoBody: 'Meseros. Bartenders. Barberos. Estilistas. Valets. Personal de hotel y limpieza. Si vives de las propinas, esto se hizo para ti.',
    getTitle: 'Lo que reciben los Founding 500',
    get: [
      { t: '2% de por vida.', d: 'Los demás trabajadores pagan la tarifa estándar del 4%. Tú nunca.' },
      { t: 'La insignia.', d: 'Una marca permanente de Miembro Fundador en tu página de propinas. Llegaste primero, y todos los que te dejen propina lo verán.' },
      { t: 'La tarjeta.', d: 'Una tarjeta QR física premium para tu estación o gafete — solo para miembros fundadores.' },
      { t: 'Acceso primero.', d: 'Cada herramienta nueva llega a ti antes que a nadie.' },
      { t: 'Concursos mensuales.', d: 'Invita a otros trabajadores: los 3 que más inviten cada mes ganan $200, $100 y $50. Publica tu mejor momento con #MyThanklyMoment: el mejor del mes gana $100.' },
    ],
    howTitle: 'Cómo funciona',
    how: [
      'Reclama tu lugar y crea tu perfil — unos 2 minutos',
      'Recibe tu código QR personal y tu página de propinas',
      'Tus clientes escanean y dejan propina en segundos — sin efectivo, sin descargar nada',
      'Tu dinero llega con pagos procesados por Stripe',
    ],
    whyTitle: '¿Por qué solo 500?',
    whyBody: 'Porque los primeros trabajadores en Thankly no son solo usuarios — son la razón por la que esto funciona. Los Founding 500 le dan forma al producto, protagonizan la historia y conservan el 2% para siempre. Cuando el contador llegue a cero, el programa se cierra definitivamente.',
    fine: 'La tarifa del 2% de por vida aplica a la tarifa de plataforma de Thankly para miembros Founding 500 según los Términos de Servicio; las tarifas de procesamiento de pagos son aparte. Concursos limitados a trabajadores activos; reglas oficiales en getthankly.com/contest-rules. Thankly no es un banco; los pagos se procesan a través de Stripe. El tiempo de pago depende de la verificación de cuenta, tu banco y los tiempos de procesamiento.',
  },
} as const

export default function Founding500Page() {
  const [lang, setLang] = useState<Lang>('en')
  const c = copy[lang] as typeof copy['en'] & { counterPrefix?: string }

  const [remaining, setRemaining] = useState<number | null>(null)
  const [counterError, setCounterError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/founding-counter')
        const data = await res.json()
        if (cancelled) return
        if (typeof data?.remaining === 'number') setRemaining(data.remaining)
        else setCounterError(true)
      } catch {
        if (!cancelled) setCounterError(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const isFull = remaining !== null && remaining <= 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2347] via-[#0f3f73] to-[#0F2347] text-white">
      <div className="mx-auto max-w-3xl px-6 py-14">

        <div className="mb-10 flex justify-end">
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
          >
            {c.switchLabel}
          </button>
        </div>

        {/* Hero */}
        <h1 className="text-4xl md:text-5xl font-black leading-[1.08] tracking-tight">
          {c.h1}
        </h1>
        <p className="mt-5 text-base md:text-lg text-white/75 leading-relaxed">
          {c.sub}
        </p>

        {/* Live counter */}
        <div className="mt-8 rounded-2xl border border-[#00B4D8]/40 bg-[#00B4D8]/10 px-6 py-5 text-center">
          {counterError ? (
            <p className="text-sm text-white/60">—</p>
          ) : remaining === null ? (
            <p className="text-sm text-white/70">{c.counterLoading}</p>
          ) : isFull ? (
            <p className="text-lg font-bold text-white">{c.counterFull}</p>
          ) : (
            <p className="text-2xl font-black text-[#90E0EF]">
              {lang === 'es' ? `${c.counterPrefix} ${remaining} ${c.counterSuffix}` : `${remaining} ${c.counterSuffix}`}
            </p>
          )}
        </div>

        {!isFull && (
          <div className="mt-6">
            <Link
              href="/auth?role=worker"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#00B4D8] px-8 py-4 text-base font-extrabold text-[#0F2347] hover:bg-[#90E0EF] transition"
            >
              {c.cta}
            </Link>
          </div>
        )}

        {/* Who this is for */}
        <section className="mt-14">
          <h2 className="text-xl font-black">{c.whoTitle}</h2>
          <p className="mt-3 text-white/75 leading-relaxed">{c.whoBody}</p>
        </section>

        {/* What members get */}
        <section className="mt-12">
          <h2 className="text-xl font-black">{c.getTitle}</h2>
          <ul className="mt-4 space-y-4">
            {c.get.map((g) => (
              <li key={g.t} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <p className="font-bold text-[#90E0EF]">{g.t}</p>
                <p className="mt-1 text-sm text-white/75 leading-relaxed">{g.d}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section className="mt-12">
          <h2 className="text-xl font-black">{c.howTitle}</h2>
          <ol className="mt-4 space-y-3">
            {c.how.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00B4D8] text-xs font-black text-[#0F2347]">
                  {i + 1}
                </span>
                <span className="text-sm text-white/75 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Why only 500 */}
        <section className="mt-12">
          <h2 className="text-xl font-black">{c.whyTitle}</h2>
          <p className="mt-3 text-white/75 leading-relaxed">{c.whyBody}</p>
        </section>

        {!isFull && (
          <div className="mt-12">
            <Link
              href="/auth?role=worker"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#00B4D8] px-8 py-4 text-base font-extrabold text-[#0F2347] hover:bg-[#90E0EF] transition"
            >
              {c.cta}
            </Link>
          </div>
        )}

        {/* Required fine print */}
        <p className="mt-12 text-[11px] leading-relaxed text-white/45">
          {c.fine}
        </p>

        <div className="mt-8 flex gap-4 text-[11px] text-white/45">
          <Link href="/privacy" className="underline hover:text-white/70">Privacy Policy</Link>
          <Link href="/terms" className="underline hover:text-white/70">Terms &amp; Conditions</Link>
        </div>

      </div>
    </main>
  )
}
