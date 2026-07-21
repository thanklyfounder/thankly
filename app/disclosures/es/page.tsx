'use client'

import LegalLayout from '@/components/LegalLayout'

const sections = [
  { id: 'ingresos', label: 'Reportes de ingresos' },
  { id: 'impuestos', label: 'Tax Pocket e impuestos' },
  { id: 'pagos', label: 'Cómo funcionan los pagos' },
  { id: 'transferencias', label: 'Opciones de transferencia' },
  { id: 'clasificacion', label: 'Clasificación del trabajador' },
  { id: 'tarifas', label: 'Tarifas para clientes' },
  { id: 'comunicaciones', label: 'Consentimiento SMS y correo' },
]

export default function DisclosuresEsPage() {
  return (
    <LegalLayout
      badge="Divulgaciones"
      title="Lo que estamos obligados a informarte"
      description="Traducción al español proporcionada únicamente para comodidad del usuario. La versión en inglés es el texto legalmente vinculante."
      effectiveDate="24 de junio de 2026"
      version="1.6"
      lang="es"
      altLangHref="/disclosures"
      sections={sections}
    >
      <section id="idioma-aviso">
        <div className="warning-box">
          <strong>Aviso sobre el idioma.</strong> Estas divulgaciones fueron
          redactadas en inglés. Las versiones traducidas se ofrecen únicamente para
          comodidad del usuario. En caso de cualquier conflicto, la versión en inglés
          prevalece y constituye el único texto legalmente vinculante. La versión en
          inglés está disponible en{' '}
          <a href="/disclosures">getthankly.com/disclosures</a>.
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CONTENT PENDING CERTIFIED TRANSLATION REVIEW

          Source drafts (side-by-side EN/ES, awaiting legal verification):
            · thankly-disclosures-es-part1.md — Earnings reports,
              Tax Pocket & taxes, How payments work
            · thankly-disclosures-es-part2.md — Payout options, Worker
              classification, Fees for customers, SMS & email consent

          HIGHEST-PRIORITY REVIEWER FLAGS FOR THIS PAGE:
            · Flag F — Worker classification (affects legal rights,
              tax liability, benefits eligibility)
            · Flag G — SMS non-sharing clause (Twilio A2P verbatim)
            · Flag B — IRS forms warning (absence of form ≠ non-taxable)

          ⚠️ DO NOT PUBLISH the SMS non-sharing clause in Spanish until
          Twilio confirms the verbatim requirement. The clause must also be
          word-for-word identical across /privacy, /terms, and /disclosures
          in whichever language is published — Twilio has previously
          rejected this campaign citing conflicting compliance pages.
          ───────────────────────────────────────────────────────────── */}
      <section id="pendiente">
        <h2>Traducción en revisión</h2>
        <p>
          La versión en español de estas divulgaciones se encuentra actualmente en
          revisión por un traductor legal certificado. Mientras tanto, la versión
          vigente y legalmente vinculante está disponible en{' '}
          <a href="/disclosures">inglés</a>.
        </p>
        <p>
          Si necesitas ayuda para entender estas divulgaciones en español, escríbenos
          a <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> y con gusto
          te asistiremos.
        </p>
      </section>
    </LegalLayout>
  )
}
