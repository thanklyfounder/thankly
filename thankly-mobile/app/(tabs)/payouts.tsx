// thankly-mobile/app/(tabs)/payouts.tsx
// Full replacement — adds payout method selection and working Initiate Payout handler

import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCurrentWorker,
  getWorkerTransactions,
} from "@/services/workerService";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://getthankly.com";
const isAndroid = Platform.OS === "android";

type PayoutMethod = "standard" | "instant";

type Worker = {
  id: string;
  full_name?: string | null;
  stripe_onboarded?: boolean | null;
  stripe_account_id?: string | null;
  avatar_url?: string | null;
};

type Transaction = {
  id: string;
  worker_receives: number;
  status: string;
  created_at: string;
};

function formatDollars(cents: number | null | undefined) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default function PayoutsScreen() {
  const { user } = useAuth();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [initiatingPayout, setInitiatingPayout] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);

  // Track which payout method the user has selected
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod>("standard");

  const { t } = useLanguage();

  async function loadStripeBalance() {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/mobile/get-stripe-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authUserId: user.id }),
      });

      if (!response.ok) {
        console.log("Stripe balance not available yet.");
        return;
      }

      const data = await response.json();
      setAvailableBalance(data.available?.[0]?.amount ?? 0);
      setPendingBalance(data.pending?.[0]?.amount ?? 0);
    } catch (error) {
      console.error("Stripe balance load error:", error);
    }
  }

  async function refreshPayoutData() {
    if (!user?.id) return;

    const currentWorker = await getCurrentWorker(user.id);
    setWorker(currentWorker);

    if (currentWorker?.id) {
      const txs = await getWorkerTransactions(currentWorker.id);
      setTransactions(txs);
    }

    await loadStripeBalance();
  }

  useFocusEffect(
    React.useCallback(() => {
      async function loadPayoutData() {
        if (!user?.id) return;
        try {
          setLoading(true);
          // Fetch worker + Stripe balance in parallel instead of sequentially
          const [currentWorker] = await Promise.all([
            getCurrentWorker(user.id),
            loadStripeBalance(),
          ]);
          setWorker(currentWorker);
          if (currentWorker?.id) {
            const txs = await getWorkerTransactions(currentWorker.id);
            setTransactions(txs);
          }
        } catch (error) {
          console.error("Payout load error:", error);
        } finally {
          setLoading(false);
        }
      }
      loadPayoutData();
    }, [user?.id])
  );

  async function handleStripeOnboarding() {
    if (!user?.id || !user.email) {
      console.error("Missing user information for Stripe onboarding.");
      return;
    }

    try {
      setConnectingStripe(true);

      const response = await fetch(`${API_BASE_URL}/api/mobile/create-account-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: user.id,
          email: user.email,
          fullName: user.email.split("@")[0],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        console.error("Stripe onboarding error:", data);
        return;
      }

      await WebBrowser.openAuthSessionAsync(data.url, "thanklymobile://stripe-return");
      await refreshPayoutData();
    } catch (error) {
      console.error("Stripe onboarding failed:", error);
    } finally {
      setConnectingStripe(false);
    }
  }

  async function handleInitiatePayout() {
    if (!user?.id) return;

    if (availableBalance <= 0) {
      Alert.alert("No Balance", "You have no available balance to pay out.");
      return;
    }

    Alert.alert(
      "Confirm Payout",
      `Initiate a ${selectedMethod} payout of ${formatDollars(availableBalance)}?\n\n${
        selectedMethod === "instant"
          ? "Arrives in minutes."
          : "Arrives in 1–2 business days."
      }`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setInitiatingPayout(true);

              const response = await fetch(`${API_BASE_URL}/api/mobile/initiate-payout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  authUserId: user.id,
                  method: selectedMethod,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                Alert.alert("Payout Failed", data.error ?? "Something went wrong.");
                return;
              }

              Alert.alert(
                "Payout Initiated",
                `${formatDollars(data.amount)} is on its way.\n\nEstimated arrival: ${
                  selectedMethod === "instant"
                    ? "Within minutes"
                    : "1–2 business days"
                }`
              );

              // Refresh balance after payout
              await refreshPayoutData();
            } catch (error) {
              console.error("Initiate payout error:", error);
              Alert.alert("Error", "Could not connect to server. Please try again.");
            } finally {
              setInitiatingPayout(false);
            }
          },
        },
      ]
    );
  }

  const completedTransactions = useMemo(
    () => transactions.filter((tx) => tx.status === "completed"),
    [transactions]
  );

  const recentPayoutRows = completedTransactions.slice(0, 5);

  const isStripeConnected =
    Boolean(worker?.stripe_account_id) && Boolean(worker?.stripe_onboarded);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title={t.payouts.title}
          subtitle={t.payouts.subtitle}
          statusText={isStripeConnected ? t.payouts.connected : t.payouts.notConnected}
          statusType={isStripeConnected ? "success" : "warning"}
        />

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t.payouts.available}</Text>
          <Text style={styles.balanceValue}>{formatDollars(availableBalance)}</Text>
          <Text style={styles.balanceSubtext}>{t.payouts.pullStripe}</Text>
          <Text style={styles.pendingBalance}>
            {t.payouts.pending}: {formatDollars(pendingBalance)}
          </Text>
        </View>

        {/* Payout Method Selection — now functional */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedMethod === "instant" && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedMethod("instant")}
          >
            <Text
              style={[
                styles.optionTitle,
                selectedMethod === "instant" && styles.optionTitleSelected,
              ]}
            >
              {t.payouts.instant} ›
            </Text>
            <Text style={styles.optionSubtitle}>{t.payouts.instantsub}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedMethod === "standard" && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedMethod("standard")}
          >
            <Text
              style={[
                styles.optionTitle,
                selectedMethod === "standard" && styles.optionTitleSelected,
              ]}
            >
              {t.payouts.standard} ›
            </Text>
            <Text style={styles.optionSubtitle}>{t.payouts.standardsub}</Text>
          </TouchableOpacity>
        </View>

        {/* Connected Account Status */}
        <View style={styles.bankCard}>
          <Text style={styles.cardTitle}>{t.payouts.connectedAct}</Text>
          <View style={styles.bankRow}>
            <View>
              <Text style={styles.bankName}>
                {isStripeConnected ? "Stripe Express" : t.payouts.setupreq}
              </Text>
              <Text style={styles.bankDetail}>
                {isStripeConnected ? t.payouts.bankaccverified : t.payouts.stripeconnect}
              </Text>
            </View>
            <View style={isStripeConnected ? styles.verifiedBadge : styles.pendingBadge}>
              <Text style={isStripeConnected ? styles.verifiedText : styles.pendingText}>
                {isStripeConnected ? t.payouts.verified : t.payouts.pending}
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Action Button — now correctly wired */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (connectingStripe || initiatingPayout) && styles.disabledButton,
          ]}
          onPress={isStripeConnected ? handleInitiatePayout : handleStripeOnboarding}
          disabled={connectingStripe || initiatingPayout}
        >
          <Text style={styles.primaryText}>
            {connectingStripe
              ? "Opening Stripe..."
              : initiatingPayout
              ? "Processing..."
              : isStripeConnected
              ? t.payouts.initiate
              : t.payouts.connectfirst}
          </Text>
        </TouchableOpacity>

        {/* Recent Payout-Eligible Tips */}
        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>{t.payouts.recentpayout}</Text>

          {recentPayoutRows.length === 0 ? (
            <Text style={styles.emptyText}>
              {t.payouts.recentsub}
            </Text>
          ) : (
            recentPayoutRows.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <View>
                  <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
                  <Text style={styles.historyStatus}>{item.status}</Text>
                </View>
                <Text style={styles.historyAmount}>
                  {formatDollars(item.worker_receives)}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footerNote}>
          {t.payouts.payoutactivity}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  content: { padding: 20, paddingBottom: 120 },
  header: {
    backgroundColor: "#0f4c81",
    marginHorizontal: -20,
    marginTop: -20,
    paddingTop: 78,
    paddingBottom: 34,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    alignItems: "center",
  },
  title: {
    marginTop: 0,
    color: "white",
    fontSize: 36,
    fontWeight: "900",
  },
  chevron: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "700",
  },
  statusBadge: {
    marginTop: 12,
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusText: { color: "#166534", fontSize: 12, fontWeight: "900" },
  warningBadge: {
    marginTop: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  warningText: { color: "#92400e", fontSize: 12, fontWeight: "900" },
  subtitle: {
    marginTop: 12,
    color: "#dbeafe",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  balanceCard: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 26,
    padding: isAndroid ? 16 : 18,
    alignItems: "center",
  },
  balanceLabel: { color: "#64748b", fontSize: 14, fontWeight: "800" },
  balanceValue: {
    marginTop: 10,
    color: "#0f172a",
    fontSize: 40,
    fontWeight: "700",
  },
  balanceSubtext: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 13,
  },
  pendingBalance: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 14,
    fontWeight: "700",
  },
  optionsRow: { marginTop: isAndroid ? 8 : 10, flexDirection: "row", gap: 14 },
  optionCard: {
    flex: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 26,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    paddingVertical: isAndroid ? 12 : 14,
    paddingHorizontal: isAndroid ? 12 : 14,
    minHeight: 0,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  // NEW: selected state only — added for method selection
  optionCardSelected: {
    borderColor: "#0284c7",
    borderWidth: 2,
    backgroundColor: "#dbeafe",
  },
  optionTitle: { color: "#0f172a", fontSize: isAndroid ? 18 : 18, fontWeight: "700" },
  // NEW: selected state only — added for method selection
  optionTitleSelected: {
    color: "#0284c7",
  },
  optionSubtitle: {
    marginTop: 0,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
  },
  bankCard: {
    marginTop: isAndroid ? 6 : 8,
    backgroundColor: "white",
    borderRadius: 26,
    padding: isAndroid ? 14 : 16,
  },
  cardTitle: { color: "#0f172a", fontSize: 18, fontWeight: "700" },
  bankRow: {
    marginTop: isAndroid ? 8 : 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankName: { color: "#0f172a", fontSize: 16, fontWeight: "700" },
  bankDetail: { marginTop: 4, color: "#64748b", fontSize: 13 },
  verifiedBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  verifiedText: { color: "#166534", fontSize: 12, fontWeight: "800" },
  pendingBadge: {
    backgroundColor: "#fef3c7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pendingText: { color: "#92400e", fontSize: 12, fontWeight: "800" },
  primaryButton: {
    marginTop: isAndroid ? 8 : 10,
    backgroundColor: "#0284c7",
    borderRadius: 24,
    padding: isAndroid? 14 : 16,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#94a3b8" },
  primaryText: { color: "white", fontSize: 17, fontWeight: "700" },
  historyCard: {
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 26,
    padding: 14,
  },
  historyRow: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyDate: { color: "#0f172a", fontSize: 16, fontWeight: "800" },
  historyStatus: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13,
    textTransform: "capitalize",
  },
  historyAmount: { color: "#0f172a", fontSize: 18, fontWeight: "700" },
  emptyText: { marginTop: 8, color: "#64748b", fontSize: 14 },
  footerNote: {
    marginTop: 14,
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },
});
