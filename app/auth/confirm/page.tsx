export default function EmailConfirmedPage() {
  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#0f3f73",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        padding: "40px 32px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h1 style={{ color: "#0f3f73", fontSize: "22px", fontWeight: "900", margin: "0 0 12px" }}>
          Email confirmed!
        </h1>
        <p style={{ color: "#475569", fontSize: "15px", lineHeight: "1.6", margin: "0 0 8px" }}>
          Your Thankly account is now active.
        </p>
        <p style={{ color: "#475569", fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px" }}>
          Your account is ready. Tap below to open the Thankly app and sign in.
        </p>
        <a href="thanklymobile://auth" style={{ display: "inline-block" as const, backgroundColor: "#0f3f73", color: "#ffffff", padding: "14px 32px", borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "15px" }}>
          Open Thankly App
        </a>
      </div>
    </main>
  );
}