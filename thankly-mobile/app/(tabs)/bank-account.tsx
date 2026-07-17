import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useFocusEffect } from "expo-router";
import { Platform } from "react-native";
import SectionHeader from "@/components/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentWorker } from "@/services/workerService";
import { useLanguage } from "@/contexts/LanguageContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://getthankly.com";
const isAndroid = Platform.OS === "android";
type Worker = {
  id: string;
  full_name?: string | null;
  stripe_onboarded?: boolean | null;
  stripe_account_id?: string | null;
  payout_preference?: string | null;
};

export default function BankAccountScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [payoutPref, setPayoutPref] = useState<string>("daily");
  const [payoutSaving, setPayoutSaving] = useState<string | null>(null);

  const isStripeConnected =
    Boolean(worker?.stripe_account_id) && Boolean(worker?.stripe_onboarded);

  useFocusEffect(
    React.useCallback(() => {
      loadWorker();
    }, [user?.id])
  );

  async function loadWorker() {
    if (!user?.id) return;

    try {
      setLoading(true);
      const currentWorker = await getCurrentWorker(user.id);
      setWorker(currentWorker);
      setPayoutPref(currentWorker?.payout_preference ?? "daily");
    } catch (error) {
      console.error("Bank account load error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function choosePayout(pref: string) {
    if (!user?.id || pref === payoutPref || payoutSaving) return;
    try {
      setPayoutSaving(pref);
      const res = await fetch(`${API_BASE_URL}/api/mobile/update-payout-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authUserId: user.id, preference: pref, weeklyAnchor: "friday" }),
      });
      const data = await res.json();
      if (res.ok) {
        setPayoutPref(pref);
      }
    } catch (e) {
      console.error("Payout schedule update error:", e);
    } finally {
      setPayoutSaving(null);
    }
  }

  async function handleStripeOnboarding() {
    if (!user?.id || !user.email) {
      console.error("Missing user information for Stripe onboarding.");
      return;
    }

    try {
      setConnectingStripe(true);

      // Onboarded accounts open the Stripe Express dashboard to MANAGE their
      // account (login link). Only non-onboarded accounts get the onboarding
      // link — otherwise an already-connected account loops on "confirm".
      const endpoint = worker?.stripe_onboarded
        ? `${API_BASE_URL}/api/mobile/stripe-login-link`
        : `${API_BASE_URL}/api/mobile/create-account-link`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authUserId: user.id,
          email: user.email,
          fullName: user.email.split("@")[0],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        console.error("Stripe link error:", data);
        return;
      }

      await WebBrowser.openAuthSessionAsync(
        data.url,
        "thanklymobile://stripe-return"
      );

      await loadWorker();
    } catch (error) {
      console.error("Stripe onboarding failed:", error);
    } finally {
      setConnectingStripe(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title={t.managebank.bankAccount}
          subtitle={t.managebank.bankAccountSub}
          statusText={isStripeConnected ? t.managebank.stripeConnected : t.managebank.stripenotconnected}
          statusType={isStripeConnected ? "success" : "warning"}
        />

        <View style={styles.card}>
          <Text style={styles.title}>{t.managebank.stripeExpressTitle}</Text>

          <Text style={styles.text}>
            {t.managebank.stripeExpressDescription}
          </Text>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>{t.managebank.currentStatus}</Text>
            <Text
              style={[
                styles.statusValue,
                isStripeConnected ? styles.connected : styles.notConnected,
              ]}
            >
              {isStripeConnected ? t.managebank.connected : t.managebank.warning}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStripeOnboarding}
            disabled={connectingStripe}
          >
            <Text style={styles.primaryText}>
              {connectingStripe
                ? t.managebank.openingstripe
                : isStripeConnected
                  ? t.managebank.manageStripeAccount
                  : t.managebank.connectbankaccount}
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            {t.managebank.stripeDisclaimer}
          </Text>
        </View>

        {isStripeConnected && (
          <View style={styles.card}>
            <Text style={styles.title}>{t.managebank.payoutScheduleTitle}</Text>
            <Text style={styles.text}>
              {t.managebank.payoutScheduleSub}
            </Text>

            {[
              { key: "daily", title: t.managebank.payoutDailyTitle, desc: t.managebank.payoutDailyDesc },
              { key: "weekly", title: t.managebank.payoutWeeklyTitle, desc: t.managebank.payoutWeeklyDesc },
              { key: "manual", title: t.managebank.payoutManualTitle, desc: t.managebank.payoutManualDesc },
            ].map((opt) => {
              const active = payoutPref === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.payoutCard, active && styles.payoutCardActive]}
                  onPress={() => choosePayout(opt.key)}
                  disabled={!!payoutSaving}
                >
                  <View style={styles.payoutHeader}>
                    <Text style={[styles.payoutTitle, active && styles.payoutTitleActive]}>{opt.title}</Text>
                    {active ? (
                      <Text style={styles.payoutBadge}>{t.managebank.payoutCurrent}</Text>
                    ) : payoutSaving === opt.key ? (
                      <ActivityIndicator size="small" color="#0f3f73" />
                    ) : null}
                  </View>
                  <Text style={styles.payoutDesc}>{opt.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  payoutCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  payoutCardActive: { borderColor: "#00B4D8", backgroundColor: "#f0f9ff" },
  payoutHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  payoutTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  payoutTitleActive: { color: "#0f3f73" },
  payoutDesc: { fontSize: 13, color: "#64748b", lineHeight: 18 },
  payoutBadge: {
    backgroundColor: "#00B4D8", color: "#fff", fontSize: 11, fontWeight: "700",
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  container: { flex: 1, backgroundColor: "#f1f5f9" },

  content: { padding: 20, paddingBottom: 120 },

  card: {
    marginTop: 18,
    backgroundColor: "white",
    borderRadius: 28,
    padding: 22,
  },

  statusText: {
    fontSize: isAndroid? 16 : 18,
  },
  
  title: {
    color: "#0f172a",
    fontSize: isAndroid? 17 : 18,
    fontWeight: "800",
  },

  text: {
    marginTop: 10,
    color: "#64748b",
    fontSize: isAndroid ? 13 : 14,
    lineHeight: 21,
  },

  statusBox: {
    marginTop: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  statusLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },

  statusValue: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "800",
  },

  connected: { color: "#166534" },

  notConnected: { color: "#92400e" },

  primaryButton: {
    marginTop: isAndroid ? 8 : 10,
    backgroundColor: "#0f4c81",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  primaryText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },

  note: {
    marginTop: 16,
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 19,
  },
});
