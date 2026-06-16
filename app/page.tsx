import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <Image
          src="/images/thankly-logo-primary.png"
          alt="Thankly"
          width={150}
          height={150}
          style={styles.logo}
          priority
        />

        <div style={styles.navLinks}>
          <Link href="/auth" style={styles.navLink}>Sign in</Link>
          <Link href="/create" style={styles.navButton}>Create your page</Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.badge}>Built for hospitality professionals</p>

          <h1 style={styles.title}>Make a Day in Seconds™</h1>

          <p style={styles.subtitle}>
            Thankly helps service workers receive digital tips through personalized
            QR codes and shareable tip pages — no cash required.
          </p>

          <div style={styles.buttons}>
            <Link href="/create" style={styles.primaryButton}>
              Create your page
            </Link>
            <Link href="/maria" style={styles.secondaryButton}>
              View example
            </Link>
          </div>

          <p style={styles.smallNote}>
            Secure payments powered by Stripe. Customers do not need an app.
          </p>
        </div>

        <div style={styles.heroCard}>
          <Image
            src="/images/thankly-splash.png"
            alt="Thankly icon"
            width={220}
            height={220}
            style={styles.heroIcon}
            priority
          />

          <div style={styles.cardBox}>
            <p style={styles.cardTitle}>How it works</p>
            <ol style={styles.steps}>
              <li>Create your Thankly profile</li>
              <li>Share your QR code or personal link</li>
              <li>Receive digital tips in seconds</li>
            </ol>
          </div>
        </div>
      </section>

      <section style={styles.trustBar}>
        <span>Stripe payments</span>
        <span>Personal QR codes</span>
        <span>Mobile-first tipping</span>
        <span>Earnings tools</span>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Digital tipping made simple.</h2>
        <p style={styles.sectionText}>
          Thankly is designed for the people who make hospitality work — servers,
          bartenders, valets, housekeepers, stylists, barbers, and service workers.
        </p>

        <div style={styles.grid}>
          {[
            ["Create your profile", "Set up your personalized Thankly page in minutes."],
            ["Share your QR", "Display your QR code or send your custom link."],
            ["Get tipped", "Customers scan, tip, and support you directly."],
            ["Track earnings", "View your tips and organize your income history."],
          ].map(([title, text]) => (
            <div key={title} style={styles.featureCard}>
              <h3 style={styles.featureTitle}>{title}</h3>
              <p style={styles.featureText}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.darkSection}>
        <h2 style={styles.darkTitle}>Who uses Thankly?</h2>

        <div style={styles.industryGrid}>
          {[
            "Restaurants",
            "Valet",
            "Hospitality",
            "Housekeeping",
            "Salons",
            "Service workers",
          ].map((item) => (
            <div key={item} style={styles.industryCard}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Frequently asked questions</h2>

        <div style={styles.faq}>
          {[
            [
              "Do customers need the app?",
              "No. Customers can tip directly from their phone browser.",
            ],
            [
              "How are payments processed?",
              "Payments are securely processed through Stripe.",
            ],
            [
              "Can workers use QR codes?",
              "Yes. Every worker can receive a personalized QR code and tip page.",
            ],
            [
              "Is Thankly only for restaurants?",
              "No. Thankly is built for restaurants, valet, hospitality, salons, housekeeping, and other service roles.",
            ],
          ].map(([q, a]) => (
            <div key={q} style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>{q}</h3>
              <p style={styles.faqAnswer}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <div>
          <Image
            src="/images/app-iconfade.png"
            alt="Thankly icon"
            width={56}
            height={56}
            style={styles.footerIcon}
          />
          <p style={styles.footerBrand}>Thankly LLC</p>
          <p style={styles.footerText}>Make a Day in Seconds™</p>
        </div>

        <div style={styles.footerLinks}>
          <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          <Link href="/terms" style={styles.footerLink}>Terms of Service</Link>
          <Link href="/contact" style={styles.footerLink}>Contact</Link>
          <Link href="/support" style={styles.footerLink}>Support</Link>
        </div>

        <p style={styles.copyright}>© 2026 Thankly LLC. All rights reserved.</p>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f6fbff 0%, #ffffff 45%, #eef8ff 100%)",
    color: "#0f172a",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  nav: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: "auto",
    objectFit: "contain",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  navLink: {
    color: "#0f172a",
    textDecoration: "none",
    fontWeight: 700,
  },
  navButton: {
    background: "#0077c8",
    color: "white",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 800,
  },
  hero: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "48px 24px 72px",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 40,
    alignItems: "center",
  },
  heroText: {
    maxWidth: 620,
  },
  badge: {
    display: "inline-block",
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "8px 14px",
    borderRadius: 999,
    fontWeight: 800,
    marginBottom: 18,
  },
  title: {
    fontSize: "clamp(44px, 7vw, 78px)",
    lineHeight: 0.95,
    margin: "0 0 20px",
    letterSpacing: "-0.05em",
    color: "#082f49",
  },
  subtitle: {
    fontSize: 21,
    lineHeight: 1.55,
    color: "#334155",
    marginBottom: 28,
  },
  buttons: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 16,
  },
  primaryButton: {
    background: "linear-gradient(135deg, #00aeef, #0046b8)",
    color: "white",
    textDecoration: "none",
    padding: "16px 24px",
    borderRadius: 16,
    fontWeight: 900,
    boxShadow: "0 14px 30px rgba(0, 119, 200, 0.25)",
  },
  secondaryButton: {
    background: "white",
    color: "#075985",
    textDecoration: "none",
    padding: "16px 24px",
    borderRadius: 16,
    fontWeight: 900,
    border: "1px solid #bae6fd",
  },
  smallNote: {
    color: "#64748b",
    fontSize: 14,
  },
  heroCard: {
    background: "linear-gradient(180deg, #062f6f, #0098d8)",
    borderRadius: 32,
    padding: 28,
    boxShadow: "0 30px 70px rgba(2, 132, 199, 0.25)",
    textAlign: "center",
  },
  heroIcon: {
    width: 220,
    height: 220,
    objectFit: "contain",
  },
  cardBox: {
    background: "rgba(255,255,255,0.94)",
    borderRadius: 24,
    padding: 22,
    textAlign: "left",
  },
  cardTitle: {
    fontWeight: 900,
    color: "#082f49",
    marginBottom: 12,
  },
  steps: {
    margin: 0,
    paddingLeft: 22,
    color: "#334155",
    lineHeight: 2,
    fontWeight: 700,
  },
  trustBar: {
    maxWidth: 1120,
    margin: "0 auto 48px",
    padding: "18px 24px",
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "center",
    color: "#075985",
    fontWeight: 800,
  },
  section: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "64px 24px",
  },
  sectionTitle: {
    fontSize: "clamp(32px, 5vw, 52px)",
    lineHeight: 1.05,
    color: "#082f49",
    marginBottom: 16,
    letterSpacing: "-0.04em",
  },
  sectionText: {
    fontSize: 19,
    lineHeight: 1.6,
    color: "#475569",
    maxWidth: 760,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 18,
    marginTop: 34,
  },
  featureCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
  },
  featureTitle: {
    color: "#075985",
    marginBottom: 10,
    fontSize: 20,
  },
  featureText: {
    color: "#475569",
    lineHeight: 1.55,
  },
  darkSection: {
    background: "linear-gradient(135deg, #082f49, #075985)",
    color: "white",
    padding: "72px 24px",
    textAlign: "center",
  },
  darkTitle: {
    fontSize: "clamp(32px, 5vw, 52px)",
    marginBottom: 30,
  },
  industryGrid: {
    maxWidth: 900,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
  },
  industryCard: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: 18,
    padding: 18,
    fontWeight: 900,
  },
  faq: {
    display: "grid",
    gap: 14,
    marginTop: 28,
  },
  faqItem: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 22,
  },
  faqQuestion: {
    color: "#082f49",
    marginBottom: 8,
  },
  faqAnswer: {
    color: "#475569",
    lineHeight: 1.55,
  },
  footer: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "48px 24px",
    borderTop: "1px solid #dbeafe",
    display: "grid",
    gap: 20,
  },
  footerIcon: {
    objectFit: "contain",
  },
  footerBrand: {
    fontWeight: 900,
    color: "#082f49",
    margin: "8px 0 4px",
  },
  footerText: {
    color: "#64748b",
  },
  footerLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
  },
  footerLink: {
    color: "#075985",
    textDecoration: "none",
    fontWeight: 800,
  },
  copyright: {
    color: "#64748b",
    fontSize: 14,
  },
};