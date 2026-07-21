import LegalLayout from '@/components/LegalLayout'

export const metadata = {
  title: 'Política de Privacidad | Thankly',
  description: 'Política de Privacidad de Thankly LLC en español.',
}

const sections = [
  { id: 'generalidades', label: 'Generalidades' },
  { id: 'recopilamos', label: 'Qué información recopilamos' },
  { id: 'uso', label: 'Cómo la utilizamos' },
  { id: 'compartimos', label: 'Cómo la compartimos' },
  { id: 'derechos', label: 'Derechos según el estado' },
  { id: 'conservacion', label: 'Conservación de datos' },
  { id: 'eliminacion', label: 'Eliminación de la cuenta' },
  { id: 'seguridad', label: 'Seguridad y contacto' },
]

export default function PrivacyEsPage() {
  return (
    <LegalLayout
      docNumber="01"
      audience="Todos los usuarios"
      title="Privacidad y cómo manejamos tus datos"
      effectiveDate="24 de junio de 2026"
      version="1.6"
      lang="es"
      altLangHref="/privacy"
      summary="Traducción al español proporcionada únicamente para comodidad del usuario. La versión en inglés es el texto legalmente vinculante."
      sections={sections}
    >
      <section id="idioma-aviso">
        <div className="warning-box">
          <strong>Aviso sobre el idioma.</strong> Esta Política de Privacidad fue
          redactada en inglés. Las versiones traducidas se ofrecen únicamente para
          comodidad del usuario. En caso de cualquier conflicto, la versión en inglés
          prevalece y constituye el único texto legalmente vinculante. La versión en
          inglés está disponible en <a href="/privacy">getthankly.com/privacy</a>.
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CONTENT PENDING CERTIFIED TRANSLATION REVIEW

          Source draft (side-by-side EN/ES, awaiting legal verification):
            · thankly-privacy-es.md — complete, single document

          HIGHEST-PRIORITY REVIEWER FLAGS FOR THIS PAGE:
            · Flag A — Biometric data / BIPA (private right of action,
              statutory damages per violation; among the most litigated
              US privacy statutes)
            · Flag D — SMS non-sharing clause. THIS is the page Twilio
              30908 reviewers check.
            · Flag C — CPRA Sensitive Personal Information exemption
              (asserts a statutory exemption, not a description)

          ⚠️ DO NOT PUBLISH the SMS non-sharing clause in Spanish until
          Twilio confirms the verbatim requirement. Must be word-for-word
          identical across /privacy, /terms, and /disclosures.
          ───────────────────────────────────────────────────────────── */}
      <section id="pendiente">
        <h2>Traducción en revisión</h2>
        <p>
          La versión en español de esta Política de Privacidad se encuentra
          actualmente en revisión por un traductor legal certificado. Mientras tanto,
          la versión vigente y legalmente vinculante está disponible en{' '}
          <a href="/privacy">inglés</a>.
        </p>
        <p>
          Si necesitas ayuda para entender esta política en español, escríbenos a{' '}
          <a href="mailto:hello@getthankly.com">hello@getthankly.com</a> y con gusto te
          asistiremos.
        </p>
      </section>
    </LegalLayout>
  )
}
