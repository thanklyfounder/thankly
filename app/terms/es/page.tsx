'use client'

import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Términos de Servicio | Thankly',
  description: 'Términos de Servicio de Thankly LLC en español.',
}

const sections = [
  { id: 'cuentas', label: 'Cuentas y elegibilidad' },
  { id: 'stripe', label: 'Stripe y pagos' },
  { id: 'tiendas', label: 'Tiendas de aplicaciones' },
  { id: 'uso', label: 'Uso aceptable' },
  { id: 'contenido', label: 'Contenido y derechos de autor' },
  { id: 'reembolsos', label: 'Reembolsos y contracargos' },
  { id: 'qr', label: 'Código QR y perfil público' },
  { id: 'electronico', label: 'Consentimiento electrónico' },
  { id: 'disputas', label: 'Disputas y arbitraje' },
  { id: 'negocios', label: 'Cuentas de negocio' },
  { id: 'generales', label: 'Términos generales' },
  { id: 'idioma', label: 'Idioma que rige' },
]

export default function TermsEsPage() {
  return (
    <LegalLayout
      badge="Términos"
      title="Términos de Servicio"
      description="Traducción al español proporcionada únicamente para comodidad del usuario. La versión en inglés es el texto legalmente vinculante."
      effectiveDate="24 de junio de 2026"
      version="1.6"
      lang="es"
      altLangHref="/terms"
      sections={sections}
    >
      {/* ─────────────────────────────────────────────────────────────
          GOVERNING LANGUAGE — must appear first and must not be removed.
          This clause is what makes publishing a translation safe.
          ───────────────────────────────────────────────────────────── */}
      <section id="idioma-aviso">
        <div className="warning-box">
          <strong>Aviso sobre el idioma.</strong> Estos Términos fueron redactados en
          inglés. Las versiones traducidas se ofrecen únicamente para comodidad del
          usuario. En caso de cualquier conflicto, discrepancia o ambigüedad, la
          versión en inglés prevalece y constituye el único texto legalmente
          vinculante. La versión en inglés está disponible en{' '}
          <a href="/terms">getthankly.com/terms</a>.
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CONTENT PENDING CERTIFIED TRANSLATION REVIEW

          Source drafts (side-by-side EN/ES, awaiting legal verification):
            · thankly-terms-v2-part1.md — Overview, Definitions, Accounts,
              SMS, Platform fee, Founding 500
            · thankly-terms-v2-part2.md — Stripe & Payments, App Store,
              Acceptable Use, Content & Copyright
            · thankly-terms-v2-part3.md — Refunds, QR, Electronic Consent,
              Arbitration
            · thankly-terms-v2-part4.md — Business Accounts, General Terms,
              Governing Language, Modifications

          TO PUBLISH: replace this block with the verified Spanish content,
          preserving the section ids listed in `sections` above so the
          in-page navigation works.

          ⚠️ DO NOT PUBLISH the SMS non-sharing clause in Spanish until
          Twilio confirms whether carrier requirements demand the English
          original appear verbatim. Campaign previously rejected on 30908.
          ───────────────────────────────────────────────────────────── */}
      <section id="pendiente">
        <h2>Traducción en revisión</h2>
        <p>
          La versión en español de estos Términos se encuentra actualmente en
          revisión por un traductor legal certificado. Mientras tanto, la versión
          vigente y legalmente vinculante está disponible en{' '}
          <a href="/terms">inglés</a>.
        </p>
        <p>
          Si necesitas ayuda para entender estos Términos en español, escríbenos a{' '}
          <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> y con gusto
          te asistiremos.
        </p>
      </section>
    </LegalLayout>
  )
}
