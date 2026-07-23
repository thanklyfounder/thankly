'use client'

import Link from 'next/link'
import { useState } from 'react'

type Lang = 'en' | 'es'

const copy = {
  en: {
    switchLabel: 'Ver en Español',
    title: 'Fees',
    updated: 'Last updated: July 2026',
    intro:
      'Thankly keeps pricing simple: there are no monthly fees, no setup fees, and no minimums. You are charged only when you receive a tip.',

    platformTitle: 'Thankly platform fee',
    platformRows: [
      { label: 'Standard rate', value: '4% per tip' },
      { label: 'Founding 500 members', value: '2% per tip, for life' },
    ],
    platformNote:
      'The platform fee is what Thankly charges to operate the service. Founding 500 members keep the 2% rate for as long as their account remains open and in good standing, as described in our Terms of Service.',

    processingTitle: 'Payment processing fee',
    processingRows: [
      { label: 'Card processing', value: '2.9% + $0.30 per transaction' },
    ],
    processingNote:
      'Payment processing fees are charged by our payment processor, Stripe, and are separate from the Thankly platform fee. Thankly does not set or control these rates. Processing fees may vary by card type and region.',

    payoutTitle: 'Payouts',
    payoutRows: [
      { label: 'Standard payout to your bank', value: 'No Thankly fee' },
      { label: 'Fast payout, when eligible', value: 'Processor fee may apply' },
    ],
    payoutNote:
      'Standard payouts arrive on your selected schedule at no cost from Thankly. Fast payouts, where your account and bank are eligible, may carry a fee charged by the payment processor, which is shown before you confirm. Payout timing depends on account verification, bank eligibility, and processing timelines.',

    coverTitle: 'Who pays the fees',
    coverNote:
      'At checkout, the person leaving the tip can choose to cover the fees so the worker receives the full tip amount. If they do not, fees are deducted from the tip before it reaches the worker. The exact breakdown is always shown before payment is confirmed.',

    taxTitle: 'Taxes',
    taxNote:
      'Thankly is not a bank and does not withhold, remit, or file taxes on your behalf. The Tax Pocket feature provides an estimate to help you set money aside; it is not tax advice and does not constitute a tax payment.',

    changesTitle: 'Changes to fees',
    changesNote:
      'Thankly communicates any change to standard rates at least 30 days in advance. Rate changes do not affect the Founding 500 lifetime rate.',

    questions: 'Questions about fees? Contact hello@getthankly.com.',
  },

  es: {
    switchLabel: 'View in English',
    title: 'Tarifas',
    updated: 'Última actualización: julio de 2026',
    intro:
      'Thankly mantiene los precios simples: sin cuotas mensuales, sin costos de instalación y sin mínimos. Solo se te cobra cuando recibes una propina.',

    platformTitle: 'Tarifa de plataforma de Thankly',
    platformRows: [
      { label: 'Tarifa estándar', value: '4% por propina' },
      { label: 'Miembros Founding 500', value: '2% por propina, de por vida' },
    ],
    platformNote:
      'La tarifa de plataforma es lo que Thankly cobra para operar el servicio. Los miembros Founding 500 conservan la tarifa del 2% mientras su cuenta permanezca abierta y en regla, según se describe en nuestros Términos de Servicio.',

    processingTitle: 'Tarifa de procesamiento de pagos',
    processingRows: [
      { label: 'Procesamiento de tarjeta', value: '2.9% + $0.30 por transacción' },
    ],
    processingNote:
      'Las tarifas de procesamiento las cobra nuestro procesador de pagos, Stripe, y son distintas de la tarifa de plataforma de Thankly. Thankly no establece ni controla estas tarifas. Pueden variar según el tipo de tarjeta y la región.',

    payoutTitle: 'Retiros',
    payoutRows: [
      { label: 'Retiro estándar a tu banco', value: 'Sin cargo de Thankly' },
      { label: 'Retiro rápido, si eres elegible', value: 'Puede aplicar cargo del procesador' },
    ],
    payoutNote:
      'Los retiros estándar llegan según la frecuencia que elijas, sin costo por parte de Thankly. Los retiros rápidos, cuando tu cuenta y tu banco son elegibles, pueden tener un cargo del procesador de pagos, que se muestra antes de que confirmes. El tiempo de retiro depende de la verificación de tu cuenta, tu banco y los tiempos de procesamiento.',

    coverTitle: 'Quién paga las tarifas',
    coverNote:
      'Al pagar, la persona que deja la propina puede elegir cubrir las tarifas para que el trabajador reciba el monto completo. Si no lo hace, las tarifas se descuentan de la propina antes de llegar al trabajador. El desglose exacto siempre se muestra antes de confirmar el pago.',

    taxTitle: 'Impuestos',
    taxNote:
      'Thankly no es un banco y no retiene, paga ni declara impuestos por ti. La función Tax Pocket ofrece una estimación para ayudarte a apartar dinero; no es asesoría fiscal ni constituye un pago de impuestos.',

    changesTitle: 'Cambios en las tarifas',
    changesNote:
      'Thankly comunica cualquier cambio en las tarifas estándar con al menos 30 días de anticipación. Los cambios de tarifa no afectan la tarifa de por vida de los Founding 500.',

    questions: '¿Preguntas sobre las tarifas? Escribe a hello@getthankly.com.',
  },
} as const

function FeeBlock({
  title,
  rows,
  note,
}: {
  title: string
  rows: readonly { label: string; value: string }[]
  note: string
}) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`flex items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-slate-100' : ''}`}
          >
            <span className="text-sm text-slate-600">{r.label}</span>
            <span className="text-sm font-bold text-slate-900">{r.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{note}</p>
    </section>
  )
}

export default function FeesPage() {
  const [lang, setLang] = useState<Lang>('en')
  const c = copy[lang]

  return (
    <main className="min-h-screen bg-[#f4f8ff]">
      <div className="mx-auto max-w-2xl px-6 py-14">

        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-[#0f3f73] hover:underline">← Thankly</Link>
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white transition"
          >
            {c.switchLabel}
          </button>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900">{c.title}</h1>
        <p className="mt-1 text-xs text-slate-400">{c.updated}</p>
        <p className="mt-5 text-sm leading-relaxed text-slate-600">{c.intro}</p>

        <FeeBlock title={c.platformTitle} rows={c.platformRows} note={c.platformNote} />
        <FeeBlock title={c.processingTitle} rows={c.processingRows} note={c.processingNote} />
        <FeeBlock title={c.payoutTitle} rows={c.payoutRows} note={c.payoutNote} />

        <section className="mt-8">
          <h2 className="text-base font-bold text-slate-900">{c.coverTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.coverNote}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-slate-900">{c.taxTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.taxNote}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-slate-900">{c.changesTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.changesNote}</p>
        </section>

        <p className="mt-10 text-sm text-slate-500">{c.questions}</p>

        <div className="mt-10 flex gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400">
          <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>
          <Link href="/terms" className="underline hover:text-slate-600">Terms &amp; Conditions</Link>
          <Link href="/founding500" className="underline hover:text-slate-600">Founding 500</Link>
        </div>

      </div>
    </main>
  )
}
