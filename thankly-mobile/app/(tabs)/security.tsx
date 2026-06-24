import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

import SectionHeader from "@/components/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";

const isAndroid = Platform.OS === "android";
export default function SecurityScreen() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  async function checkBiometrics() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    setBiometricsAvailable(hasHardware && enrolled);
  }

  async function toggleBiometrics(value: boolean) {
    if (!value) {
      setBiometricsEnabled(false);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Enable Face ID / Touch ID for Thankly",
      fallbackLabel: "Use Passcode",
    });

    if (!result.success) {
      Alert.alert("Not enabled", "Biometric authentication was not enabled.");
      return;
    }

    setBiometricsEnabled(true);

    Alert.alert(
      "Enabled",
      "Face ID / Touch ID is now enabled for this device."
    );
  }

  async function sendPasswordReset() {
    if (!user?.email) {
      Alert.alert("Error", "No email found for this account.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: "thanklymobile://reset-password",
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert(
      "Password Reset Sent",
      "Check your email for reset instructions."
    );
  }

  async function handleSignOut() {
    await signOut();
    Alert.alert("Signed out", "You have been signed out.");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title={t.security.security}
          subtitle={t.security.securitySub}
        />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t.security.account}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>{t.security.email}</Text>
            <Text style={styles.value}>{user?.email ?? "Not available"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>{t.security.accountStatus}</Text>
            <Text style={styles.verified}>{t.security.active}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t.security.faceIdTouchId}</Text>

          <View style={styles.switchRow}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitlebio}>{t.security.useBiometrics}</Text>
              <Text style={styles.rowSubtitle}>
                {t.security.biometricsSub}
              </Text>
            </View>

            <Switch
              value={biometricsEnabled}
              disabled={!biometricsAvailable}
              onValueChange={toggleBiometrics}
            />
          </View>

          {!biometricsAvailable ? (
            <Text style={styles.warningText}>
              Biometrics are not available or not enrolled on this device.
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t.security.password}</Text>

          <TouchableOpacity style={styles.actionRow} onPress={sendPasswordReset}>
            <View>
              <Text style={styles.rowTitle}>{t.security.resetPassword}</Text>
              <Text style={styles.rowSubtitle}>
                {t.security.resetPasswordSub}
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t.security.accountProtection}</Text>

          <SecurityItem text={t.security.protection1} />
          <SecurityItem text={t.security.protection2} />
          <SecurityItem text={t.security.protection3} />
          <SecurityItem text={t.security.protection4} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t.security.advancedSecurity}</Text>

          <LockedItem title={t.security.loginHistory} subtitle={t.security.loginHistorySub} badge={t.security.soon}/>
          <LockedItem title={t.security.activeSessions} subtitle={t.security.activeSessionsSub} badge={t.security.soon}/>
          <LockedItem title={t.security.deviceManagement} subtitle={t.security.deviceManagementSub} badge={t.security.soon}/>
          <LockedItem title={t.security.suspiciousAlerts} subtitle={t.security.suspiciousAlertsSub} badge={t.security.soon}/>
        </View>

        <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
          <Text style={styles.dangerText}>{t.security.signOut}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SecurityItem({ text }: { text: string }) {
  return (
    <View style={styles.securityItem}>
      <Text style={styles.check}>✓</Text>
      <Text style={styles.securityText}>{text}</Text>
    </View>
  );
}

function LockedItem({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <View style={styles.lockedRow}>
      <View>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.lockedBadge}>
        {badge}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  content: { padding: 20, paddingBottom: 120 },

  card: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 28,
    paddingHorizontal: isAndroid ? 14 : 16,
    paddingTop: 10,
    paddingBottom: 8,
  },

  sectionTitle: {
    color: "#0f172a",
    fontSize: isAndroid? 15 : 16,
    fontWeight: "700",
    marginBottom: -3,
  },

  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  label: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
  },

  value: {
    marginTop: 3,
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800",
  },

  verified: {
    marginTop: 3,
    color: "#166534",
    fontSize: 14,
    fontWeight: "900",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  rowText: { flex: 1 },

  rowTitle: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
    paddingTop: 0,
  },
  rowTitlebio: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
    paddingTop: 10,
    paddingBottom: 6
  },

  rowSubtitle: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
  },

  warningText: {
    marginTop: 14,
    color: "#92400e",
    fontSize: 13,
    fontWeight: "800",
  },

  actionRow: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chevron: {
    color: "#94a3b8",
    fontSize: 34,
    fontWeight: "300",
  },

  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 10,
  },

  check: {
    color: "#166534",
    fontSize: 18,
    fontWeight: "900",
  },

  securityText: {
    flex: 1,
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
  },

  lockedRow: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 0,
  },

  lockedBadge: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
  },

  dangerButton: {
    marginTop: 12,
    backgroundColor: "#fee2e2",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  dangerText: {
    color: "#b91c1c",
    fontSize: 17,
    fontWeight: "700",
  },
});
