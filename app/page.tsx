'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Lang = 'en' | 'es'

const copy = {
  en: {
    banner: { flag: '🇪🇸', question: '¿Prefieres español?', action: 'Ver en Español' },
    nav: {
      links: [
        { href: '#how-it-works', label: 'How it works' },
        { href: '#features', label: 'Features' },
        { href: '/founding500', label: 'Founding 500' },
        { href: '#business', label: 'For Business' },
      ],
      signin: 'Sign in',
      signup: 'Sign up',
    },
    hero: {
      badge: 'Now accepting Founding 500 members',
      h1a: 'Your tips.',
      h1b: 'Your money.',
      h1c: 'Your future.',
      sub: 'Thankly is the bilingual financial platform built for service workers. Collect digital tips, track every dollar, and build your financial future — all in one place.',
      tagline: 'Scan. Tip. Done.',
      cta1: 'Join Founding 500 — Free',
      cta2: 'See how it works',
      stats: [
        { value: '100%', label: 'of your tip, yours' },
        { value: '$0', label: 'to get started' },
        { value: 'EN/ES', label: 'fully bilingual' },
      ],
    },
    phone: {
      newTip: 'New tip received',
      keep100: '✓ You keep 100%',
      payoutSent: 'Payout sent',
      thisWeek: 'this week',
      greeting: 'Good evening, Maria 👋',
      performance: "Today's Performance",
      metrics: [
        { label: 'Tips', value: '$142' },
        { label: 'Txns', value: '8' },
        { label: 'Net', value: '$136' },
      ],
      viewQr: '📱 View QR',
      payout: '💸 Payout',
    },
    how: {
      eyebrow: 'How it works',
      h2: 'Up and earning in minutes',
      sub: 'No cash register needed. No hardware to buy. Just your phone and your Thankly QR code.',
      steps: [
        { title: 'Create your profile', desc: 'Sign up free, add your photo, workplace, and personalized bio. Your public tip page is live in minutes.' },
        { title: 'Connect your bank', desc: 'Securely link your bank account through Stripe Express. Bank-level security, zero hassle.' },
        { title: 'Share your QR code', desc: 'Display your QR at your table, station, or workspace. Customers scan and tip in seconds.' },
        { title: 'Get paid your way', desc: 'Tips land in your balance and pay out on your schedule — daily, weekly, or on demand. Eligible accounts can cash out in minutes.' },
      ],
    },
    features: {
      eyebrow: 'Built for workers',
      h2a: 'Everything you need.',
      h2b: "Nothing you don't.",
      cards: [
        { icon: '📱', title: 'Your personal tip page', desc: 'A beautiful public profile at getthankly.com/yourname. Customers scan your QR, see your face, and tip you directly.' },
        { icon: '💰', title: 'Keep 100% of your tip', desc: 'When customers cover the processing fee, you receive every dollar they intended for you. Zero deductions from your tip.' },
        { icon: '📊', title: 'Real-time earnings dashboard', desc: 'Track tips by day, week, or month. See trends, top days, and your full transaction history — always current.' },
        { icon: '🏦', title: 'Instant or standard payouts', desc: 'Need money now? Instant payout in minutes. Or let it accumulate and transfer on your schedule.' },
        { icon: '🧾', title: 'Estimated Tax Pocket', desc: 'Set your estimated tax rate and Thankly tracks how much to set aside automatically. No surprises at tax time.' },
        { icon: '📄', title: 'Accounting-grade exports', desc: 'Download professional PDF or Excel reports for any date range. Perfect for tax prep, loan applications, or your own records.' },
      ],
    },
    bilingual: {
      eyebrow: 'Fully bilingual',
      h2a: 'Built for the community',
      h2b: 'that runs hospitality.',
      sub: 'Thankly is built in English and Spanish from the ground up — not translated, conversion-optimized. Every screen, every notification, every dollar.',
      cta: 'Join Free — Únete gratis',
      cards: [
        { flag: '🇺🇸', lang: 'English', text: '"You just made Maria\'s day!"', sub: 'She received your full $20. Zero fees deducted.' },
        { flag: '🌎', lang: 'Español', text: '"¡Acabas de alegrarle el día a María!"', sub: 'Recibió tu apoyo completo de $20. Sin deducciones.' },
        { flag: '💳', lang: 'Tip page copy', text: '"Apoya a María" not just "Leave a tip"', sub: 'Warm, conversion-optimized Spanish throughout' },
      ],
    },
    founding: {
      eyebrow: 'Founding 500',
      h2a: 'Be one of the first.',
      h2b: 'Lock your rate forever.',
      sub: 'The first 500 workers to join Thankly become Founding Members — with permanent benefits that standard members never get.',
      perks: [
        { bold: '2% platform fee for life', rest: ' — locked permanently vs. 4% standard rate' },
        { bold: 'Founding Member badge', rest: ' on your public profile — permanent' },
        { bold: 'Monthly referral contest', rest: ' — $200 / $100 / $50 cash prizes' },
        { bold: 'Premium QR card', rest: ' — physical status card for your workspace' },
        { bold: 'Early access', rest: ' to every new feature before public release' },
      ],
      cta: "Claim your spot — It's free",
      spotsTitle: 'Founding Member Spots',
      spotsSub: 'Limited. First come, first served.',
    },
    business: {
      eyebrow: 'For businesses',
      h2a: 'Give your team a',
      h2b: 'financial edge.',
      sub: 'Deploy Thankly across your entire staff in minutes. No hardware. No integration. Workers are live the same day.',
      features: [
        { icon: '👥', title: 'Team dashboard', desc: 'See all workers, combined tip volume, and team performance in one view.' },
        { icon: '📊', title: 'Combined reports', desc: 'Export PDF or Excel reports for your entire team by date range — ready for accounting.' },
        { icon: '🔗', title: 'Instant team invites', desc: 'Share one invite link or QR code — workers scan, join your team, and can receive tips the same shift.' },
      ],
      pricing: 'Free for your business — no hardware, no contracts, no per-seat fees. Workers keep their standard Thankly rate.',
      cta1: 'Create a business account',
      cta2: 'Talk to us',
      report: {
        title: 'Team Report — June 2026',
        badge: 'PDF Ready',
        rows: [
          { label: 'Total tips collected', value: '$12,847.50' },
          { label: 'Active workers', value: '23' },
          { label: 'Total transactions', value: '1,204' },
          { label: 'Avg tip per transaction', value: '$10.67' },
          { label: 'Workers paid out', value: '23 / 23', green: true },
        ],
        exportPdf: '⬇ Export PDF',
        exportExcel: '⬇ Export Excel',
      },
    },
    cta: {
      h2a: 'Ready to take control',
      h2b: 'of your tips?',
      sub: 'Join Thankly free. No monthly fees. No hardware. Just your money — organized, tracked, and paid out on your terms.',
      cta1: 'Get started free',
      cta2: 'Sign in',
    },
    faq: {
      eyebrow: 'FAQ',
      h2: 'Questions, answered.',
      items: [
        { q: 'How much does Thankly cost?', a: 'Free to join, no monthly fees. Thankly takes a small platform fee per tip — Founding 500 members lock in 2% for life vs. the 4% standard rate. Customers can choose to cover processing fees so you keep 100% of your tip.' },
        { q: 'How fast do I get my money?', a: 'Tips appear in your balance as they come in. You choose your payout schedule — daily, weekly, or manual. Standard payouts arrive in 1–2 business days at no cost, and eligible accounts can use a fast payout to get funds in minutes.' },
        { q: 'Do I need special hardware?', a: 'No. Your QR code works from your phone screen, a printed card, or a sticker at your station. Customers scan with their phone camera — they don\'t need to download anything to tip you.' },
        { q: 'Does Thankly withhold my taxes?', a: 'No — the Tax Pocket is an estimation tool, not withholding. Set your estimated rate and Thankly tracks how much of each tip to set aside, plus gives you professional reports for tax season. Thankly doesn\'t provide tax advice.' },
        { q: 'Is Thankly really bilingual?', a: 'Yes — English and Spanish are built in from the ground up: your dashboard, your public tip page, notifications, everything.' },
        { q: 'I run a business — can my whole team use it?', a: 'Yes. Create a free business account, share one invite link or QR code, and your team can be live the same shift — with a combined dashboard and exportable team reports.' },
      ],
    },
    footer: {
      tagline: 'The bilingual financial platform for tipped hospitality workers. Your tips. Your records. Your money under your control.',
      columns: [
        {
          title: 'Product',
          links: [
            { href: '#how-it-works', label: 'How it works' },
            { href: '#features', label: 'Features' },
            { href: '/founding500', label: 'Founding 500' },
            { href: '#business', label: 'For Business' },
          ],
        },
        {
          title: 'Support',
          links: [
            { href: 'mailto:hello@getthankly.com', label: 'Contact us' },
            { href: 'mailto:support@getthankly.com', label: 'support@getthankly.com' },
            { href: 'mailto:legal@getthankly.com', label: 'legal@getthankly.com' },
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
      ],
      copyright: '© 2026 Thankly LLC. All rights reserved. Orlando, Florida.',
      legalLinks: [
        { href: '/privacy', label: 'Privacy' },
        { href: '/terms', label: 'Terms' },
        { href: '/disclosures', label: 'Disclosures' },
      ],
    },
  },
  es: {
    banner: { flag: '🇺🇸', question: 'Prefer English?', action: 'View in English' },
    nav: {
      links: [
        { href: '#how-it-works', label: 'Cómo funciona' },
        { href: '#features', label: 'Funciones' },
        { href: '/founding500', label: 'Founding 500' },
        { href: '#business', label: 'Para negocios' },
      ],
      signin: 'Inicia sesión',
      signup: 'Regístrate',
    },
    hero: {
      badge: 'Aceptando miembros del Founding 500',
      h1a: 'Tus propinas.',
      h1b: 'Tu dinero.',
      h1c: 'Tu futuro.',
      tagline: 'Escanea. Propina. Listo.',
      sub: 'Thankly es la plataforma financiera bilingüe creada para trabajadores de servicio. Recibe propinas digitales, controla cada dólar y construye tu futuro financiero — todo en un solo lugar.',
      cta1: 'Únete al Founding 500 — Gratis',
      cta2: 'Mira cómo funciona',
      stats: [
        { value: '100%', label: 'de tu propina, tuya' },
        { value: '$0', label: 'para empezar' },
        { value: 'EN/ES', label: 'totalmente bilingüe' },
      ],
    },
    phone: {
      newTip: 'Nueva propina recibida',
      keep100: '✓ Te quedas con el 100%',
      payoutSent: 'Pago enviado',
      thisWeek: 'esta semana',
      greeting: 'Buenas noches, María 👋',
      performance: 'Rendimiento de hoy',
      metrics: [
        { label: 'Propinas', value: '$142' },
        { label: 'Trans.', value: '8' },
        { label: 'Neto', value: '$136' },
      ],
      viewQr: '📱 Ver QR',
      payout: '💸 Retiro',
    },
    how: {
      eyebrow: 'Cómo funciona',
      h2: 'Empieza a ganar en minutos',
      sub: 'No necesitas caja registradora ni comprar equipo. Solo tu teléfono y tu código QR de Thankly.',
      steps: [
        { title: 'Crea tu perfil', desc: 'Regístrate gratis, agrega tu foto, tu lugar de trabajo y tu bio personalizada. Tu página pública de propinas queda lista en minutos.' },
        { title: 'Conecta tu banco', desc: 'Vincula tu cuenta bancaria de forma segura con Stripe Express. Seguridad de nivel bancario, sin complicaciones.' },
        { title: 'Comparte tu código QR', desc: 'Muestra tu QR en tu mesa, estación o lugar de trabajo. Tus clientes escanean y te dan propina en segundos.' },
        { title: 'Recibe tu dinero a tu manera', desc: 'Las propinas llegan a tu saldo y se pagan según tu frecuencia — diaria, semanal o cuando tú quieras. Las cuentas elegibles pueden retirar en minutos.' },
      ],
    },
    features: {
      eyebrow: 'Hecho para trabajadores',
      h2a: 'Todo lo que necesitas.',
      h2b: 'Nada de lo que no.',
      cards: [
        { icon: '📱', title: 'Tu página personal de propinas', desc: 'Un perfil público en getthankly.com/tunombre. Tus clientes escanean tu QR, ven tu cara y te dan propina directamente.' },
        { icon: '💰', title: 'Quédate con el 100% de tu propina', desc: 'Cuando el cliente cubre la tarifa de procesamiento, recibes cada dólar que quiso darte. Cero deducciones de tu propina.' },
        { icon: '📊', title: 'Panel de ganancias en tiempo real', desc: 'Sigue tus propinas por día, semana o mes. Mira tendencias, tus mejores días y todo tu historial de transacciones — siempre al día.' },
        { icon: '🏦', title: 'Retiros rápidos o estándar', desc: '¿Necesitas dinero ya? Retiro rápido en minutos si eres elegible. O acumula y transfiere cuando tú quieras.' },
        { icon: '🧾', title: 'Tax Pocket estimado', desc: 'Define tu tasa estimada de impuestos y Thankly calcula cuánto apartar automáticamente. Sin sorpresas en la temporada de impuestos.' },
        { icon: '📄', title: 'Reportes nivel contabilidad', desc: 'Descarga reportes profesionales en PDF o Excel para cualquier rango de fechas. Perfectos para tus impuestos, solicitudes de préstamo o tus propios registros.' },
      ],
    },
    bilingual: {
      eyebrow: 'Totalmente bilingüe',
      h2a: 'Creado para la comunidad',
      h2b: 'que mueve la hospitalidad.',
      sub: 'Thankly está hecho en inglés y español desde cero — no traducido, optimizado para conversión. Cada pantalla, cada notificación, cada dólar.',
      cta: 'Únete gratis — Join Free',
      cards: [
        { flag: '🇺🇸', lang: 'English', text: '"You just made Maria\'s day!"', sub: 'She received your full $20. Zero fees deducted.' },
        { flag: '🌎', lang: 'Español', text: '"¡Acabas de alegrarle el día a María!"', sub: 'Recibió tu apoyo completo de $20. Sin deducciones.' },
        { flag: '💳', lang: 'Texto de tu página', text: '"Apoya a María", no solo "Leave a tip"', sub: 'Español cálido y natural en toda la plataforma' },
      ],
    },
    founding: {
      eyebrow: 'Founding 500',
      h2a: 'Sé de los primeros.',
      h2b: 'Asegura tu tarifa para siempre.',
      sub: 'Los primeros 500 trabajadores en unirse a Thankly se convierten en Miembros Fundadores — con beneficios permanentes que los miembros estándar nunca tendrán.',
      perks: [
        { bold: 'Tarifa de plataforma del 2% de por vida', rest: ' — asegurada permanentemente vs. la tarifa estándar del 4%' },
        { bold: 'Insignia de Miembro Fundador', rest: ' en tu perfil público — permanente' },
        { bold: 'Concurso mensual de referidos', rest: ' — premios en efectivo de $200 / $100 / $50' },
        { bold: 'Tarjeta QR premium', rest: ' — tarjeta física para tu lugar de trabajo' },
        { bold: 'Acceso anticipado', rest: ' a cada nueva función antes del lanzamiento público' },
      ],
      cta: 'Reclama tu lugar — Es gratis',
      spotsTitle: 'Lugares de Miembro Fundador',
      spotsSub: 'Limitados. Por orden de llegada.',
    },
    business: {
      eyebrow: 'Para negocios',
      h2a: 'Dale a tu equipo una',
      h2b: 'ventaja financiera.',
      sub: 'Implementa Thankly con todo tu personal en minutos. Sin equipo especial. Sin integraciones. Tus trabajadores quedan activos el mismo día.',
      features: [
        { icon: '👥', title: 'Panel de equipo', desc: 'Mira a todos tus trabajadores, el volumen combinado de propinas y el rendimiento del equipo en una sola vista.' },
        { icon: '📊', title: 'Reportes combinados', desc: 'Exporta reportes en PDF o Excel de todo tu equipo por rango de fechas — listos para contabilidad.' },
        { icon: '🔗', title: 'Invitaciones instantáneas', desc: 'Comparte un enlace o código QR de invitación — tus trabajadores escanean, se unen a tu equipo y pueden recibir propinas el mismo turno.' },
      ],
      pricing: 'Gratis para tu negocio — sin equipo especial, sin contratos, sin costo por persona. Tus trabajadores mantienen su tarifa estándar de Thankly.',
      cta1: 'Crea una cuenta de negocio',
      cta2: 'Escríbenos',
      report: {
        title: 'Reporte de equipo — Junio 2026',
        badge: 'PDF listo',
        rows: [
          { label: 'Propinas totales', value: '$12,847.50' },
          { label: 'Trabajadores activos', value: '23' },
          { label: 'Transacciones totales', value: '1,204' },
          { label: 'Propina promedio', value: '$10.67' },
          { label: 'Trabajadores pagados', value: '23 / 23', green: true },
        ],
        exportPdf: '⬇ Exportar PDF',
        exportExcel: '⬇ Exportar Excel',
      },
    },
    cta: {
      h2a: '¿Listo para tomar el control',
      h2b: 'de tus propinas?',
      sub: 'Únete a Thankly gratis. Sin mensualidades. Sin equipo especial. Solo tu dinero — organizado, registrado y pagado en tus términos.',
      cta1: 'Empieza gratis',
      cta2: 'Inicia sesión',
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      h2: 'Tus dudas, resueltas.',
      items: [
        { q: '¿Cuánto cuesta Thankly?', a: 'Unirte es gratis y no hay mensualidades. Thankly cobra una pequeña tarifa de plataforma por propina — los miembros del Founding 500 aseguran el 2% de por vida vs. la tarifa estándar del 4%. Tus clientes pueden cubrir la tarifa de procesamiento para que recibas el 100% de tu propina.' },
        { q: '¿Qué tan rápido recibo mi dinero?', a: 'Las propinas aparecen en tu saldo a medida que llegan. Tú eliges tu frecuencia de pago — diaria, semanal o manual. Los retiros estándar llegan en 1–2 días hábiles sin costo, y las cuentas elegibles pueden usar un retiro rápido para recibir fondos en minutos.' },
        { q: '¿Necesito equipo especial?', a: 'No. Tu código QR funciona desde la pantalla de tu teléfono, una tarjeta impresa o una calcomanía en tu estación. Tus clientes escanean con la cámara de su teléfono — no necesitan descargar nada para darte propina.' },
        { q: '¿Thankly retiene mis impuestos?', a: 'No — el Tax Pocket es una herramienta de estimación, no una retención. Define tu tasa estimada y Thankly calcula cuánto apartar de cada propina, además de darte reportes profesionales para la temporada de impuestos. Thankly no ofrece asesoría fiscal.' },
        { q: '¿Thankly es realmente bilingüe?', a: 'Sí — inglés y español están integrados desde cero: tu panel, tu página pública de propinas, tus notificaciones, todo.' },
        { q: 'Tengo un negocio — ¿puede usarlo todo mi equipo?', a: 'Sí. Crea una cuenta de negocio gratis, comparte un enlace o código QR de invitación, y tu equipo puede estar activo el mismo turno — con panel combinado y reportes de equipo exportables.' },
      ],
    },
    footer: {
      tagline: 'La plataforma financiera bilingüe para trabajadores de hospitalidad que reciben propinas. Tus propinas. Tus registros. Tu dinero bajo tu control.',
      columns: [
        {
          title: 'Producto',
          links: [
            { href: '#how-it-works', label: 'Cómo funciona' },
            { href: '#features', label: 'Funciones' },
            { href: '/founding500', label: 'Founding 500' },
            { href: '#business', label: 'Para negocios' },
          ],
        },
        {
          title: 'Soporte',
          links: [
            { href: 'mailto:hello@getthankly.com', label: 'Contáctanos' },
            { href: 'mailto:support@getthankly.com', label: 'support@getthankly.com' },
            { href: 'mailto:legal@getthankly.com', label: 'legal@getthankly.com' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { href: '/privacy', label: 'Política de privacidad' },
            { href: '/terms', label: 'Términos de servicio' },
            { href: '/disclosures', label: 'Divulgaciones' },
          ],
        },
      ],
      copyright: '© 2026 Thankly LLC. Todos los derechos reservados. Orlando, Florida.',
      legalLinks: [
        { href: '/privacy', label: 'Privacidad' },
        { href: '/terms', label: 'Términos' },
        { href: '/disclosures', label: 'Divulgaciones' },
      ],
    },
  },
} as const

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en')
  const c = copy[lang]
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/founding-counter')
      .then(r => r.json())
      .then(d => { if (!cancelled && typeof d?.remaining === 'number') setSpotsLeft(d.remaining) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

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
  }, [lang])

  return (
    <div className="overflow-x-hidden">

      {/* LANGUAGE BANNER — toggles the whole page */}
      <div className="bg-[#00B4D8]/10 border-b border-[#00B4D8]/20 py-2 px-[5%] text-center text-sm text-[#4A5568]">
        {c.banner.flag} {c.banner.question}{' '}
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
          className="text-[#1B3A6B] font-bold underline-offset-2 hover:underline"
        >
          {c.banner.action}
        </button>
      </div>

      {/* NAV */}
      <nav className="fixed top-[40px] left-0 right-0 z-50 bg-[#1B3A6B]/97 backdrop-blur-md h-16 flex items-center justify-between px-[5%]">
        <Link href="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
          <Image src="/images/thanklyappicon.png" alt="Thankly" width={36} height={36} className="rounded-lg" />
          Thankly
        </Link>
        <ul className="flex items-center gap-4 md:gap-8 list-none">
          {c.nav.links.map((link) => (
            <li key={link.href} className="hidden md:block">
              <a href={link.href} className="text-white/80 text-sm font-medium hover:text-white transition-colors">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/auth/signin"
              className="text-white/80 text-sm font-medium hover:text-white transition-colors"
            >
              {c.nav.signin}
            </a>
          </li>
          <li>
            <a
              href="/auth"
              className="bg-[#00B4D8] text-[#0F2347] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#90E0EF] transition-colors"
            >
              {c.nav.signup}
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
              {c.hero.badge}
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
              {c.hero.h1a}<br />
              <span className="text-[#00B4D8]">{c.hero.h1b}</span><br />
              {c.hero.h1c}
            </h1>

            <p className="text-xl font-black text-[#00B4D8] tracking-tight mb-5">
              {c.hero.tagline}
            </p>

            <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-[480px]">
              {c.hero.sub}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/auth"
                className="inline-flex items-center gap-2 bg-[#00B4D8] text-[#0F2347] font-extrabold text-base px-8 py-4 rounded-full hover:bg-[#90E0EF] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,180,216,0.35)] transition-all"
              >
                {c.hero.cta1}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-transparent text-white font-bold text-base px-8 py-4 rounded-full border-2 border-white/30 hover:border-white/70 hover:bg-white/8 transition-all"
              >
                {c.hero.cta2}
              </a>
            </div>

            <div className="flex gap-8 mt-12 pt-10 border-t border-white/10">
              {c.hero.stats.map((stat, i) => (
                <div key={i}>
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
                  {c.phone.newTip}
                </div>
                <div className="text-2xl font-black text-[#1B3A6B]">$25.00</div>
                <div className="text-xs text-green-600 font-semibold">{c.phone.keep100}</div>
              </div>

              {/* Payout badge */}
              <div className="absolute bottom-24 -left-16 bg-[#1B3A6B] text-white rounded-xl px-4 py-2.5 shadow-2xl text-xs font-bold animate-[float_3s_ease-in-out_1.5s_infinite] z-10 whitespace-nowrap">
                {c.phone.payoutSent}
                <span className="text-[#00B4D8] text-base font-black block">$847.50</span>
                {c.phone.thisWeek}
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

                  <p className="text-white font-bold text-sm text-center mb-0.5">{c.phone.greeting}</p>
                  <p className="text-white/70 text-xs text-center mb-2">Cviche 305 📍</p>

                  {/* Card */}
                  <div className="bg-white rounded-2xl p-3 shadow-lg">
                    <p className="text-xs font-black text-center text-[#0D1B2A] mb-2">{c.phone.performance}</p>
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {c.phone.metrics.map((m, i) => (
                        <div key={i} className="text-center">
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
                    <div className="bg-[#e8f0fe] rounded-xl py-2 text-center text-[10px] font-bold text-[#1B3A6B]">{c.phone.viewQr}</div>
                    <div className="bg-[#e8f0fe] rounded-xl py-2 text-center text-[10px] font-bold text-[#1B3A6B]">{c.phone.payout}</div>
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
            <p className="text-[#00B4D8] text-sm md:text-base font-bold tracking-widest uppercase mb-3">{c.how.eyebrow}</p>
            <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tight mb-4">{c.how.h2}</h2>
            <p className="text-[#4A5568] text-lg leading-relaxed max-w-xl mx-auto">{c.how.sub}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {c.how.steps.map((step, i) => {
              const bgs = ['bg-[#1B3A6B]', 'bg-gradient-to-br from-[#1B3A6B] to-[#00B4D8]', 'bg-gradient-to-br from-[#00B4D8] to-[#254d8f]', 'bg-[#00B4D8]']
              return (
                <div key={i} className="text-center fade-up opacity-0 translate-y-6 transition-all duration-700" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className={`w-16 h-16 rounded-full ${bgs[i]} text-white text-xl font-black flex items-center justify-center mx-auto mb-5`}>
                    {i + 1}
                  </div>
                  <h3 className="font-extrabold text-[#0D1B2A] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-[5%]" id="features">
        <div className="max-w-[1200px] mx-auto">
          <div className="fade-up opacity-0 translate-y-6 transition-all duration-700 mb-14">
            <p className="text-[#00B4D8] text-sm md:text-base font-bold tracking-widest uppercase mb-3">{c.features.eyebrow}</p>
            <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tight">{c.features.h2a}<br />{c.features.h2b}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {c.features.cards.map((f, i) => (
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
            <p className="text-[#00B4D8] text-sm md:text-base font-bold tracking-widest uppercase mb-3">{c.bilingual.eyebrow}</p>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-6">{c.bilingual.h2a}<br />{c.bilingual.h2b}</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              {c.bilingual.sub}
            </p>
            <a href="#founding" className="inline-flex items-center gap-2 bg-[#00B4D8] text-[#0F2347] font-extrabold px-8 py-4 rounded-full hover:bg-[#90E0EF] transition-colors">
              {c.bilingual.cta}
            </a>
          </div>

          <div className="flex flex-col gap-4 fade-up opacity-0 translate-y-6 transition-all duration-700">
            {c.bilingual.cards.map((card, i) => (
              <div key={i} className="bg-white/8 border border-white/12 rounded-2xl px-6 py-5 flex items-start gap-4">
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
            <p className="text-[#00B4D8] text-sm md:text-base font-bold tracking-widest uppercase mb-3">{c.founding.eyebrow}</p>
            <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tight leading-tight mb-6">{c.founding.h2a}<br />{c.founding.h2b}</h2>
            <p className="text-[#4A5568] text-lg leading-relaxed mb-8">{c.founding.sub}</p>

            <ul className="flex flex-col gap-4 mb-8">
              {c.founding.perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00B4D8]/15 border border-[#00B4D8] flex items-center justify-center flex-shrink-0 mt-0.5 text-[#00B4D8] text-xs font-bold">✓</div>
                  <span className="text-[#0D1B2A] text-[0.95rem]"><strong>{perk.bold}</strong>{perk.rest}</span>
                </li>
              ))}
            </ul>

            <a href="/auth" className="inline-flex items-center gap-2 bg-[#00B4D8] text-[#0F2347] font-extrabold px-8 py-4 rounded-full hover:bg-[#90E0EF] hover:-translate-y-0.5 transition-all">
              {c.founding.cta}
            </a>
          </div>

          <div className="flex justify-center fade-up opacity-0 translate-y-6 transition-all duration-700">
            <div className="bg-[#1B3A6B] rounded-3xl px-10 py-12 text-center max-w-sm w-full relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00B4D8]/20 rounded-full blur-2xl" />
              <div className="text-8xl font-black text-[#00B4D8] leading-none tracking-tight">500</div>
              <div className="text-white font-bold mt-2">{c.founding.spotsTitle}</div>
              <div className="text-white/50 text-sm mb-6">{c.founding.spotsSub}</div>
              <div className="bg-white/10 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] rounded-full transition-all duration-500"
                  style={{ width: `${spotsLeft === null ? 0 : Math.round(((500 - spotsLeft) / 500) * 100)}%` }}
                />
              </div>
              <div className="text-white/50 text-xs text-right">
                {spotsLeft === null
                  ? '—'
                  : lang === 'es'
                    ? `Quedan ${spotsLeft} lugares`
                    : `${spotsLeft} spots remaining`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS */}
      <section className="py-24 px-[5%]" id="business">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="fade-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[#00B4D8] text-sm md:text-base font-bold tracking-widest uppercase mb-3">{c.business.eyebrow}</p>
            <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tight leading-tight mb-4">{c.business.h2a}<br />{c.business.h2b}</h2>
            <p className="text-[#4A5568] text-lg leading-relaxed mb-8">{c.business.sub}</p>

            <div className="flex flex-col gap-6">
              {c.business.features.map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-[#F0F6FF] flex items-center justify-center text-xl flex-shrink-0">{f.icon}</div>
                  <div>
                    <h3 className="font-bold text-[#0D1B2A] mb-1">{f.title}</h3>
                    <p className="text-sm text-[#4A5568] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm font-semibold text-[#0D1B2A] bg-[#F0F6FF] border border-[#00B4D8]/25 rounded-2xl px-5 py-4">
              {c.business.pricing}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="/auth?role=business"
                className="inline-flex items-center gap-2 bg-[#1B3A6B] text-white font-extrabold px-8 py-4 rounded-full hover:bg-[#0F2347] hover:-translate-y-0.5 transition-all"
              >
                {c.business.cta1}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </a>
              <a
                href="mailto:hello@getthankly.com"
                className="inline-flex items-center gap-2 bg-transparent text-[#1B3A6B] font-bold px-8 py-4 rounded-full border-2 border-[#1B3A6B]/30 hover:border-[#1B3A6B]/70 transition-all"
              >
                {c.business.cta2}
              </a>
            </div>
          </div>

          {/* Report preview */}
          <div className="bg-[#F0F6FF] rounded-2xl p-7 border border-slate-200 fade-up opacity-0 translate-y-6 transition-all duration-700">
            <div className="flex items-center justify-between mb-5">
              <span className="font-extrabold text-[#0D1B2A]">{c.business.report.title}</span>
              <span className="bg-[#1B3A6B] text-white text-xs font-bold px-3 py-1 rounded-full">{c.business.report.badge}</span>
            </div>
            {c.business.report.rows.map((row, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-200 last:border-0">
                <span className="text-sm text-[#4A5568]">{row.label}</span>
                <span className={`text-sm font-bold ${'green' in row && row.green ? 'text-green-600' : 'text-[#0D1B2A]'}`}>{row.value}</span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-[#1B3A6B] text-white text-center py-2.5 rounded-xl text-xs font-bold">{c.business.report.exportPdf}</div>
              <div className="border border-[#1B3A6B] text-[#1B3A6B] text-center py-2.5 rounded-xl text-xs font-bold">{c.business.report.exportExcel}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F0F6FF] py-24 px-[5%]" id="faq">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-12 fade-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[#00B4D8] text-sm md:text-base font-bold tracking-widest uppercase mb-3">{c.faq.eyebrow}</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#0D1B2A] tracking-tight">{c.faq.h2}</h2>
          </div>
          <div className="flex flex-col gap-3">
            {c.faq.items.map((item, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-2xl px-6 py-5 open:border-[#00B4D8] transition-colors fade-up opacity-0 translate-y-6 duration-700">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-[#0D1B2A] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="text-[#00B4D8] text-2xl font-light leading-none group-open:rotate-45 transition-transform flex-shrink-0 ml-4">+</span>
                </summary>
                <p className="text-sm text-[#4A5568] leading-relaxed mt-3 pr-8">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] py-24 px-[5%] text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-[#00B4D8]/12 rounded-full blur-3xl" />
        </div>
        <div className="max-w-[860px] mx-auto relative z-10 fade-up opacity-0 translate-y-6 transition-all duration-700">
          <h2 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">{c.cta.h2a}<br />{c.cta.h2b}</h2>
          <p className="text-white/70 text-xl mb-10">{c.cta.sub}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/auth" className="inline-flex items-center gap-2 bg-[#00B4D8] text-[#0F2347] font-extrabold px-8 py-4 rounded-full hover:bg-[#90E0EF] hover:-translate-y-0.5 transition-all">
              {c.cta.cta1}
            </a>
            <a href="/auth/signin" className="inline-flex items-center gap-2 bg-transparent text-white font-bold px-8 py-4 rounded-full border-2 border-white/30 hover:border-white/70 transition-all">
              {c.cta.cta2}
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
                {c.footer.tagline}
              </p>
            </div>

            {c.footer.columns.map((col, i) => (
              <div key={i}>
                <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
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
            <p className="text-white/40 text-xs">{c.footer.copyright}</p>
            <div className="flex gap-5 flex-wrap">
              {c.footer.legalLinks.map((link, i) => (
                <Link key={i} href={link.href} className="text-white/40 text-xs hover:text-white/80 transition-colors">
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
