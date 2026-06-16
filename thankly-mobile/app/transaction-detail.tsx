import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/lib/supabase";

type Transaction = {
  id: string;
  tip_amount: number;
  fee_amount?: number | null;
  stripe_fee?: number | null;
  worker_receives: number;
  tax_reserve_amount?: number | null;
  available_amount?: number | null;
  status: string;
  stripe_payment_id?: string | null;
  created_at: string;
};

type Feedback = {
  id: string;
  rating: number;
  note?: string | null;
  created_at: string;
};

function formatDollars(cents: number | null | undefined) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TransactionDetailScreen() {
  const { transactionId } = useLocalSearchParams<{
    transactionId?: string;
  }>();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransaction() {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        const { data: tx, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("id", transactionId)
          .single();

        if (txError) {
          throw txError;
        }

        setTransaction(tx);

        if (tx?.stripe_payment_id) {
          const { data: feedbackRow, error: feedbackError } = await supabase
            .from("worker_feedback")
            .select("*")
            .eq("stripe_payment_id", tx.stripe_payment_id)
            .maybeSingle();

          if (!feedbackError) {
            setFeedback(feedbackRow);
          }
        }
      } catch (error) {
        console.error("Transaction detail load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTransaction();
  }, [transactionId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Transaction not found</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const thanklyFee = transaction.fee_amount ?? 0;
  const stripeFee = transaction.stripe_fee ?? 0;
  const taxPocket = transaction.tax_reserve_amount ?? 0;
  const safeToSpend = transaction.available_amount ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>Thankly</Text>
          <Text style={styles.title}>
            {formatDollars(transaction.tip_amount)}
          </Text>

          <Text style={styles.subtitle}>
            earned on {formatDate(transaction.created_at)}
          </Text>

          <View style={styles.impactBadge}>
            <Text style={styles.impactBadgeText}>
              Hospitality Moment Completed
            </Text>
          </View>

        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Gross Tip</Text>
          <Text style={styles.amountValue}>
            {formatDollars(transaction.tip_amount)}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{transaction.status}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Financial Breakdown</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Gross tip</Text>
            <Text style={styles.rowValue}>{formatDollars(transaction.tip_amount)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Stripe fee</Text>
            <Text style={styles.rowValue}>{formatDollars(stripeFee)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Thankly fee</Text>
            <Text style={styles.rowValue}>{formatDollars(thanklyFee)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.strongLabel}>Worker receives</Text>
            <Text style={styles.strongValue}>
              {formatDollars(transaction.worker_receives)}
            </Text>
          </View>
        </View>

        <View style={styles.greenCard}>
          <Text style={styles.cardTitle}>Financial Organization</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Estimated Tax Pocket</Text>
            <Text style={styles.rowValue}>{formatDollars(taxPocket)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.strongLabel}>Safe-to-Spend</Text>
            <Text style={styles.strongValue}>{formatDollars(safeToSpend)}</Text>
          </View>

          <Text style={styles.helperText}>
            Thankly provides estimates to help organize your finances. You remain
            responsible for saving and paying your own taxes.
          </Text>
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.cardTitle}>Customer Praise</Text>

          {feedback ? (
            <>
              <Text style={styles.feedbackLabel}>Customer rating</Text>
              <Text style={styles.rating}>{"⭐".repeat(feedback.rating)}</Text>

              {feedback.note ? (
                <View style={styles.noteBox}>
                  <Text style={styles.note}>“{feedback.note}”</Text>
                </View>
              ) : (
                <Text style={styles.helperText}>
                  Customer left a rating without a note.
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.helperText}>
              No customer feedback attached to this transaction yet.
            </Text>
          )}
        </View>


        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryText}>Back to Activity</Text>
        </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    backgroundColor: "#0f4c81",
    borderRadius: 34,
    padding: 28,
    alignItems: "center",
  },
  brand: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
  },
  title: {
    marginTop: 14,
    color: "white",
    fontSize: 36,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 8,
    color: "#dbeafe",
    textAlign: "center",
    fontSize: 15,
  },
  amountCard: {
    marginTop: 18,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 26,
    alignItems: "center",
  },
  feedbackCard: {
    marginTop: 16,
    backgroundColor: "#eff6ff",
    borderRadius: 26,
    padding: 22,
  },

  feedbackLabel: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  noteBox: {
    marginTop: 14,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
  },

  amountLabel: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "800",
  },
  amountValue: {
    marginTop: 10,
    color: "#0f172a",
    fontSize: 52,
    fontWeight: "900",
  },
  statusBadge: {
    marginTop: 12,
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  impactBadge: {
    marginTop: 16,
    backgroundColor: "#dbeafe",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  impactBadgeText: {
    color: "#0f4c81",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  card: {
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 26,
    padding: 22,
  },
  greenCard: {
    marginTop: 16,
    backgroundColor: "#dcfce7",
    borderRadius: 26,
    padding: 22,
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  row: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  rowLabel: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "700",
  },
  rowValue: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
  },
  strongLabel: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
  },
  strongValue: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 10,
  },
  helperText: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 19,
  },
  rating: {
    fontSize: 28,
    marginTop: 6,
  },
  note: {
    marginTop: 12,
    color: "#334155",
    fontSize: 16,
    lineHeight: 22,
    fontStyle: "italic",
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: "#0284c7",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
  },
  primaryText: {
    color: "white",
    fontSize: 17,
    fontWeight: "900",
  },
  secondaryButton: {
    marginTop: 18,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
  },
  secondaryText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
  },
  emptyCard: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
  },
});
