import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/contexts/AuthContext";

// Re-lock only if the app was backgrounded longer than this (fintech-standard;
// avoids re-prompting on quick app-switches).
const LOCK_GRACE_MS = 30_000;

export default function BiometricLock({ children }: { children: React.ReactNode }) {
  const { session, loading, signOut } = useAuth();
  const [locked, setLocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const backgroundedAt = useRef<number | null>(null);

  async function shouldLock(): Promise<boolean> {
    // Only lock an authenticated session with the preference enabled.
    if (!session) return false;
    const pref = await SecureStore.getItemAsync("thankly_biometric_lock");
    if (pref !== "true") return false;

    // Safety valve: if hardware/enrollment is gone, do NOT trap the user.
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && enrolled;
  }

  async function attemptUnlock() {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock Thankly",
      fallbackLabel: "Use Passcode",
    });
    if (result.success) setLocked(false);
  }

  // Decide whether to lock — but only after auth has finished restoring the
  // session on cold start. Checking before `loading` clears would see a null
  // session and wrongly conclude "no lock", skipping Face ID on launch.
  useEffect(() => {
    if (loading) return; // wait for session restore to complete

    let cancelled = false;
    (async () => {
      const lock = await shouldLock();
      if (cancelled) return;
      setLocked(lock);
      setChecking(false);
      if (lock) attemptUnlock();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, loading]);

  // Background/foreground handling with grace timeout.
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (next: AppStateStatus) => {
      if (next === "background" || next === "inactive") {
        backgroundedAt.current = Date.now();
      } else if (next === "active") {
        const since = backgroundedAt.current;
        backgroundedAt.current = null;
        if (since && Date.now() - since > LOCK_GRACE_MS) {
          const lock = await shouldLock();
          if (lock) {
            setLocked(true);
            attemptUnlock();
          }
        }
      }
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (loading || checking) return null; // wait for auth restore; splash already showed

  if (locked) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thankly is locked</Text>
        <Text style={styles.subtitle}>Unlock with Face ID to continue.</Text>
        <TouchableOpacity style={styles.button} onPress={attemptUnlock}>
          <Text style={styles.buttonText}>Unlock with Face ID</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={async () => { setLocked(false); await signOut(); }}
        >
          <Text style={styles.secondaryText}>Sign out instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0f3f73", padding: 24 },
  title: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 14, marginBottom: 24, textAlign: "center" },
  button: { backgroundColor: "#fff", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32 },
  buttonText: { color: "#0f3f73", fontWeight: "700", fontSize: 15 },
  secondaryButton: { marginTop: 16, paddingVertical: 10 },
  secondaryText: { color: "rgba(255,255,255,0.7)", fontWeight: "600", fontSize: 14 },
});