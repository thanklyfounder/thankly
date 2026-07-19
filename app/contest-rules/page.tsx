'use client'

import Link from 'next/link'
import { useState } from 'react'

type Lang = 'en' | 'es'

const copy = {
  en: {
    switchLabel: 'Ver en Español',
    title: 'Official Contest Rules',
    updated: 'Last updated: July 2026',
    intro:
      'These Official Rules govern the two monthly contests offered by Thankly LLC ("Thankly"). By entering, you agree to these Rules. No purchase or payment is necessary to enter or win. Both contests are skill-based; winners are determined by performance and merit, not by chance.',

    s1: '1. Sponsor',
    s1b: 'Thankly LLC, a Florida limited liability company. Contact: hello@getthankly.com.',

    s2: '2. Contest Period',
    s2b: 'Contests run in monthly cycles beginning on the first day and ending on the last day of each calendar month (U.S. Eastern Time). The initial program term is six (6) consecutive months from the launch month. Thankly may extend, modify, suspend, or discontinue the contests for any future month at its discretion. Any change will be posted on this page before the affected month begins. Contests already completed are not affected.',

    s3: '3. Eligibility',
    s3b: [
      'Entrants must be at least 18 years old and legal residents of the United States.',
      'Entrants must be active Thankly workers. "Active" means the worker has completed account onboarding, completed identity verification through our payment processor, and received at least one real tip through Thankly.',
      'Employees of Thankly and their immediate family or household members are not eligible.',
      'Each person may participate in only ONE Thankly referral program at a time — either the monthly referral contest or the Thankly Affiliate Partner program, never both.',
      'Void where prohibited or restricted by law.',
    ],

    s4: '4. Contest A — Monthly Referral Contest',
    s4b: 'Each month, the three (3) eligible workers who refer the most newly activated workers to Thankly win the following prizes:',
    s4prizes: ['1st place — $200 USD', '2nd place — $100 USD', '3rd place — $50 USD'],
    s4how: 'How referrals are counted:',
    s4howb: [
      'A referral counts only when the referred worker (a) signs up using the entrant\'s referral link or code, (b) completes account onboarding and identity verification, and (c) receives at least one genuine tip through Thankly.',
      'The referral is credited to the calendar month in which the referred worker receives their first genuine tip.',
      'Self-referrals, duplicate accounts, fabricated accounts, and any tips not arising from a genuine customer transaction are disqualified and may result in removal from the program.',
      'In the event of a tie, the tied entrant whose qualifying referrals were completed earliest in the month is ranked higher.',
    ],

    s5: '5. Contest B — #MyThanklyMoment',
    s5b: 'Each month, one (1) prize of $100 USD is awarded for the best public social media post using the hashtag #MyThanklyMoment.',
    s5how: 'How to enter:',
    s5howb: [
      'Publish a public post on a major social platform that includes the hashtag #MyThanklyMoment and relates to your real experience using Thankly.',
      'Your account must be public at the time of judging so the post can be reviewed.',
      'You may submit multiple posts; each is judged individually.',
      'Posts must comply with the platform\'s own terms and with applicable disclosure requirements.',
    ],
    s5judge: 'How entries are judged:',
    s5judgeb: [
      'Editorial merit — 70%. Judged by Thankly staff on authenticity, storytelling, how genuinely the post reflects real work life, and consistency with Thankly\'s brand values.',
      'Audience engagement — 30%. Measured as engagement RATE relative to the entrant\'s follower count, not raw totals, so that entrants with smaller followings compete fairly.',
      'Judging decisions are final. Thankly may decline to award a prize in a month with no qualifying entries.',
    ],

    s6: '6. Prohibited Content and Conduct',
    s6b: [
      'No content that is false, misleading, defamatory, discriminatory, harassing, sexually explicit, or unlawful.',
      'No earnings claims (for example, "I made $X with Thankly") unless independently verified in writing by Thankly.',
      'No content that shames, pressures, or guilts customers into tipping.',
      'No content presenting Thankly as a bank, or claiming Thankly withholds, remits, or files taxes.',
      'No purchased engagement, bot activity, or artificially inflated metrics.',
      'Thankly may disqualify any entry or entrant that violates these Rules.',
    ],

    s7: '7. Winner Notification and Prize Delivery',
    s7b: 'Winners are announced within ten (10) business days after the end of each monthly cycle and notified using the contact information on their Thankly account. Prizes are paid in U.S. dollars, typically to the winner\'s connected payout account, within thirty (30) days of verification. A winner who cannot be reached or verified within fourteen (14) days of notification may forfeit the prize, and Thankly may select an alternate.',

    s8: '8. Taxes',
    s8b: 'Winners are solely responsible for all taxes on prizes. Where required by law, Thankly will request a completed IRS Form W-9 and will issue an IRS Form 1099 to any winner receiving $600 or more in prizes from Thankly in a calendar year. Thankly does not provide tax advice.',

    s9: '9. Publicity and Content License',
    s9b: 'By entering #MyThanklyMoment, you grant Thankly a non-exclusive, royalty-free license to reproduce, display, and share your submitted post and your first name and city on Thankly channels for promotional purposes, with attribution where practical. You retain ownership of your content. You may request removal of your content from Thankly channels at any time by contacting hello@getthankly.com.',

    s10: '10. General Conditions',
    s10b: [
      'Thankly is not responsible for lost, late, incomplete, or misdirected entries, or for technical failures of any kind.',
      'Thankly reserves the right to modify, suspend, or cancel a contest if fraud, technical failure, or any other factor materially impairs its integrity, and to disqualify any entrant who tampers with entry mechanics.',
      'These Rules are governed by the laws of the State of Florida, without regard to conflict-of-law principles.',
      'These contests are not sponsored, endorsed, or administered by, or associated with, any social media platform.',
    ],

    s11: '11. Questions',
    s11b: 'Contact hello@getthankly.com with any questions about these Rules.',
  },

  es: {
    switchLabel: 'View in English',
    title: 'Reglas Oficiales de los Concursos',
    updated: 'Última actualización: julio de 2026',
    intro:
      'Estas Reglas Oficiales rigen los dos concursos mensuales ofrecidos por Thankly LLC ("Thankly"). Al participar, aceptas estas Reglas. No es necesario comprar ni pagar nada para participar o ganar. Ambos concursos se basan en mérito; los ganadores se determinan por desempeño, no por azar.',

    s1: '1. Organizador',
    s1b: 'Thankly LLC, una compañía de responsabilidad limitada de Florida. Contacto: hello@getthankly.com.',

    s2: '2. Periodo del Concurso',
    s2b: 'Los concursos operan en ciclos mensuales que comienzan el primer día y terminan el último día de cada mes calendario (hora del Este de EE. UU.). El periodo inicial del programa es de seis (6) meses consecutivos a partir del mes de lanzamiento. Thankly puede extender, modificar, suspender o descontinuar los concursos para cualquier mes futuro a su discreción. Cualquier cambio se publicará en esta página antes de que comience el mes afectado. Los concursos ya completados no se ven afectados.',

    s3: '3. Elegibilidad',
    s3b: [
      'Los participantes deben tener al menos 18 años y residir legalmente en Estados Unidos.',
      'Los participantes deben ser trabajadores activos de Thankly. "Activo" significa que el trabajador completó el registro de su cuenta, completó la verificación de identidad con nuestro procesador de pagos y recibió al menos una propina real a través de Thankly.',
      'Los empleados de Thankly y sus familiares directos o miembros de su hogar no son elegibles.',
      'Cada persona puede participar en UN SOLO programa de referidos de Thankly a la vez — ya sea el concurso mensual de referidos o el programa de Socios Afiliados de Thankly, nunca ambos.',
      'Nulo donde la ley lo prohíba o restrinja.',
    ],

    s4: '4. Concurso A — Concurso Mensual de Referidos',
    s4b: 'Cada mes, los tres (3) trabajadores elegibles que refieran a más trabajadores nuevos activados ganan los siguientes premios:',
    s4prizes: ['1er lugar — $200 USD', '2do lugar — $100 USD', '3er lugar — $50 USD'],
    s4how: 'Cómo se cuentan los referidos:',
    s4howb: [
      'Un referido cuenta solo cuando el trabajador referido (a) se registra usando el enlace o código del participante, (b) completa el registro de cuenta y la verificación de identidad, y (c) recibe al menos una propina genuina a través de Thankly.',
      'El referido se acredita al mes calendario en el que el trabajador referido recibe su primera propina genuina.',
      'Los autorreferidos, cuentas duplicadas, cuentas fabricadas y cualquier propina que no provenga de una transacción genuina quedan descalificados y pueden resultar en la expulsión del programa.',
      'En caso de empate, se clasifica más alto al participante cuyos referidos calificados se completaron primero en el mes.',
    ],

    s5: '5. Concurso B — #MyThanklyMoment',
    s5b: 'Cada mes se otorga un (1) premio de $100 USD a la mejor publicación pública en redes sociales que use el hashtag #MyThanklyMoment.',
    s5how: 'Cómo participar:',
    s5howb: [
      'Publica un post público en una plataforma social importante que incluya el hashtag #MyThanklyMoment y se relacione con tu experiencia real usando Thankly.',
      'Tu cuenta debe ser pública al momento de la evaluación para que el post pueda revisarse.',
      'Puedes enviar varias publicaciones; cada una se evalúa por separado.',
      'Las publicaciones deben cumplir con los términos de la plataforma y con los requisitos de divulgación aplicables.',
    ],
    s5judge: 'Cómo se evalúan las participaciones:',
    s5judgeb: [
      'Mérito editorial — 70%. Evaluado por el equipo de Thankly según autenticidad, narrativa, qué tan genuinamente refleja la vida laboral real y su consistencia con los valores de la marca Thankly.',
      'Interacción de la audiencia — 30%. Medida como TASA de interacción en relación con el número de seguidores del participante, no en totales brutos, para que quienes tienen menos seguidores compitan de forma justa.',
      'Las decisiones de evaluación son finales. Thankly puede no otorgar premio en un mes sin participaciones que califiquen.',
    ],

    s6: '6. Contenido y Conducta Prohibidos',
    s6b: [
      'Nada de contenido falso, engañoso, difamatorio, discriminatorio, de acoso, sexualmente explícito o ilegal.',
      'Nada de afirmaciones de ganancias (por ejemplo, "gané $X con Thankly") a menos que Thankly las verifique por escrito de forma independiente.',
      'Nada de contenido que avergüence, presione o haga sentir culpables a los clientes para dejar propina.',
      'Nada de contenido que presente a Thankly como un banco, ni que afirme que Thankly retiene, paga o declara impuestos.',
      'Nada de interacción comprada, actividad de bots o métricas infladas artificialmente.',
      'Thankly puede descalificar cualquier participación o participante que viole estas Reglas.',
    ],

    s7: '7. Notificación de Ganadores y Entrega de Premios',
    s7b: 'Los ganadores se anuncian dentro de los diez (10) días hábiles posteriores al cierre de cada ciclo mensual y se notifican usando la información de contacto de su cuenta Thankly. Los premios se pagan en dólares estadounidenses, normalmente a la cuenta de pagos conectada del ganador, dentro de los treinta (30) días posteriores a la verificación. Un ganador que no pueda ser contactado o verificado dentro de los catorce (14) días posteriores a la notificación puede perder el premio, y Thankly podrá seleccionar a un suplente.',

    s8: '8. Impuestos',
    s8b: 'Los ganadores son los únicos responsables de todos los impuestos sobre los premios. Cuando la ley lo requiera, Thankly solicitará un Formulario W-9 del IRS completo y emitirá un Formulario 1099 del IRS a cualquier ganador que reciba $600 o más en premios de Thankly en un año calendario. Thankly no brinda asesoría fiscal.',

    s9: '9. Publicidad y Licencia de Contenido',
    s9b: 'Al participar en #MyThanklyMoment, otorgas a Thankly una licencia no exclusiva y libre de regalías para reproducir, mostrar y compartir tu publicación, tu nombre de pila y tu ciudad en los canales de Thankly con fines promocionales, con atribución cuando sea posible. Tú conservas la propiedad de tu contenido. Puedes solicitar la eliminación de tu contenido de los canales de Thankly en cualquier momento escribiendo a hello@getthankly.com.',

    s10: '10. Condiciones Generales',
    s10b: [
      'Thankly no es responsable por participaciones perdidas, tardías, incompletas o mal dirigidas, ni por fallas técnicas de ningún tipo.',
      'Thankly se reserva el derecho de modificar, suspender o cancelar un concurso si el fraude, una falla técnica o cualquier otro factor afecta materialmente su integridad, y de descalificar a cualquier participante que manipule los mecanismos de participación.',
      'Estas Reglas se rigen por las leyes del Estado de Florida, sin considerar principios de conflicto de leyes.',
      'Estos concursos no están patrocinados, avalados ni administrados por ninguna plataforma de redes sociales, ni asociados con ellas.',
    ],

    s11: '11. Preguntas',
    s11b: 'Escribe a hello@getthankly.com si tienes preguntas sobre estas Reglas.',
  },
} as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  )
}

export default function ContestRulesPage() {
  const [lang, setLang] = useState<Lang>('en')
  const c = copy[lang]

  return (
    <main className="min-h-screen bg-[#f4f8ff]">
      <div className="mx-auto max-w-3xl px-6 py-14">

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

        <Section title={c.s1}><p>{c.s1b}</p></Section>
        <Section title={c.s2}><p>{c.s2b}</p></Section>
        <Section title={c.s3}><Bullets items={c.s3b} /></Section>

        <Section title={c.s4}>
          <p>{c.s4b}</p>
          <ul className="list-disc space-y-1 pl-5 font-semibold text-slate-800">
            {c.s4prizes.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <p className="pt-2 font-semibold text-slate-800">{c.s4how}</p>
          <Bullets items={c.s4howb} />
        </Section>

        <Section title={c.s5}>
          <p>{c.s5b}</p>
          <p className="pt-2 font-semibold text-slate-800">{c.s5how}</p>
          <Bullets items={c.s5howb} />
          <p className="pt-2 font-semibold text-slate-800">{c.s5judge}</p>
          <Bullets items={c.s5judgeb} />
        </Section>

        <Section title={c.s6}><Bullets items={c.s6b} /></Section>
        <Section title={c.s7}><p>{c.s7b}</p></Section>
        <Section title={c.s8}><p>{c.s8b}</p></Section>
        <Section title={c.s9}><p>{c.s9b}</p></Section>
        <Section title={c.s10}><Bullets items={c.s10b} /></Section>
        <Section title={c.s11}><p>{c.s11b}</p></Section>

        <div className="mt-12 flex gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400">
          <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>
          <Link href="/terms" className="underline hover:text-slate-600">Terms &amp; Conditions</Link>
          <Link href="/founding500" className="underline hover:text-slate-600">Founding 500</Link>
        </div>

      </div>
    </main>
  )
}
