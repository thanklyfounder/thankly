import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { 
  exportTransactionsPdf,
  exportTransactionsCsv,
  exportTransactionsXlsx,
} from "@/utils/exportReports";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCurrentWorker,
  getWorkerTransactions,
} from "@/services/workerService";

type Worker = {
  id: string;
  full_name: string;
  bio?: string | null;
  bio_es?: string | null;
  tax_withholding_rate?: number | null;
  avatar_url?: string | null;
  created_at?: string | null;
};

type Transaction = {
  id: string;
  tip_amount: number;
  worker_receives: number;
  status: string;
  created_at: string;
};

const isAndroid = Platform.OS === "android";
function formatDollars(cents: number | null | undefined) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isToday(value: string) {
  return new Date(value).toDateString() === new Date().toDateString();
}

function getLast7DayEarnings(transactions: Transaction[]) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      label: date.toLocaleDateString([], { weekday: "short" }).charAt(0),
      dateKey: date.toDateString(),
      amount: 0,
    };
  });

  transactions.forEach((tx) => {
    const txDateKey = new Date(tx.created_at).toDateString();
    const day = days.find((item) => item.dateKey === txDateKey);

    if (day) {
      day.amount += tx.worker_receives ?? 0;
    }
  });

  const maxAmount = Math.max(...days.map((day) => day.amount), 1);

  return days.map((day) => ({
    ...day,
    height:
      day.amount <= 0
        ? 28
        : Math.max(28, Math.round((day.amount / maxAmount) * 100)),
  }));
}
function getTransactionsForRange(
  transactions: Transaction[],
  range: "7d" | "month" | "lastMonth" | "ytd" | "custom",
  customStartDate?: Date,
  customEndDate?: Date
) {
  const now = new Date();

  return transactions.filter((tx) => {
    const txDate = new Date(tx.created_at);

    if (range === "7d") {
      const start = new Date();
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return txDate >= start;
    }

    if (range === "month") {
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    }

    if (range === "lastMonth") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return (
        txDate.getMonth() === lastMonth.getMonth() &&
        txDate.getFullYear() === lastMonth.getFullYear()
      );
    }

    if (range === "ytd") {
      const start = new Date(now.getFullYear(), 0, 1);
      return txDate >= start;
    }
    if (
      range === "custom" &&
      customStartDate &&
      customEndDate
    ) {
      const start = new Date(customStartDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);

      return txDate >= start && txDate <= end;
    }
    return true;
  });
}

function getRangeLabel(
  range: "7d" | "month" | "lastMonth" | "ytd" | "custom",
  start: Date,
  end: Date,
  t: any
) {
  const now = new Date();
  
  function format(date: Date) {
    return date.toLocaleDateString();
  }

  if (range === "7d") {
    const startDate = new Date();
    startDate.setDate(now.getDate() - 6);
    return `${t.activity.last7Days} (${format(startDate)} - ${format(now)})`;
  }

  if (range === "month") {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    return `${t.activity.thisMonth} (${format(startDate)} - ${format(now)})`;
  }

  if (range === "lastMonth") {
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    return `${t.activity.lastMonthPeriod} (${format(startDate)} - ${format(endDate)})`;
  }

  if (range === "ytd") {
    const startDate = new Date(now.getFullYear(), 0, 1);
    return `${t.activity.yearToDate} (${format(startDate)} - ${format(now)})`;
  }

  return `${t.activity.rangeCustom} (${format(start)} - ${format(end)})`;
}

export default function ActivityScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportRange, setReportRange] = useState<
    "7d" | "month" | "lastMonth" | "ytd" | "custom"
  >("7d");

  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const workerCreatedAt = worker?.created_at
    ? new Date(worker.created_at)
    : new Date();
  const filteredTransactions = getTransactionsForRange(
    transactions,
    reportRange,
    customStartDate,
    customEndDate,
  );
  //filteredTransactions.forEach((tx) => {
    //const txDateKey = new Date(tx.created_at).toDateString();
    //const day = days.find((item) => item.dateKey === txDateKey);


    //if (day) {
      //day.amount += tx.worker_receives ?? 0;
    //}
  //});
  const reportPeriod = getRangeLabel(
    reportRange,
    customStartDate,
    customEndDate,
    t,
  );
  const weeklyData = getLast7DayEarnings(transactions);
  const animatedBars = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0))
  ).current;
  const rangeSummary = {
    grossTips: filteredTransactions.reduce(
      (sum, tx) => sum + (tx.tip_amount ?? 0),
      0
    ),
    netPayout: filteredTransactions.reduce(
      (sum, tx) => sum + (tx.worker_receives ?? 0),
      0
    ),
    taxPocket: filteredTransactions.reduce(
      (sum, tx) => sum + (tx.tax_reserve_amount ?? 0),
      0
    ),
    available: filteredTransactions.reduce(
      (sum, tx) => sum + (tx.available_amount ?? 0),
      0
    ),
  };

  useFocusEffect(
    React.useCallback(() => {
      async function loadActivityData() {
        if (!user?.id) return;

        try {
          setLoading(true);

          const currentWorker = await getCurrentWorker(user.id);
          setWorker(currentWorker);

          if (currentWorker?.id) {
            const txs = await getWorkerTransactions(currentWorker.id);
            setTransactions(txs);
          }
        } catch (error) {
          console.error("Activity load error:", error);
        } finally {
          setLoading(false);
        }
      }

      loadActivityData();
        Animated.stagger(
          80,
          animatedBars.map((bar, index) =>
            Animated.spring(bar, {
              toValue: weeklyData[index].height,
              useNativeDriver: false,
          })
        )
      ).start();
    }, [user?.id])
  );

  const todayTransactions = useMemo(
    () => transactions.filter((tx) => isToday(tx.created_at)),
    [transactions]
  );

  const grossToday = todayTransactions.reduce(
    (sum, tx) => sum + (tx.tip_amount ?? 0),
    0
  );

  const netToday = todayTransactions.reduce(
    (sum, tx) => sum + (tx.worker_receives ?? 0),
    0
  );

  const taxRate = 
    Number(worker?.tax_withholding_rate ?? 0.15) <= 1
      ? Number(worker?.tax_withholding_rate ?? 0.15) * 100
      : Number(worker?.tax_withholding_rate ?? 15);
  const estimatedTaxPocket = Math.round(netToday * taxRate);

  const workerName = worker?.full_name ?? "Activity";
  const workerInitial = workerName.charAt(0).toUpperCase();

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
          title={t.activity.title}
          subtitle={t.activity.subtitle}
        />

        <View style={styles.todayCard}>
          <Text style={styles.cardTitle}>{t.activity.todayPerformance}</Text>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>{t.activity.tipsReceived}</Text>
              <Text style={styles.statValue}>
                {formatDollars(grossToday)}
              </Text>
            </View>

            <View>
              <Text style={styles.statLabel}>{t.activity.transactions}</Text>
              <Text style={styles.statValue}>
                {todayTransactions.length}
              </Text>
            </View>

            <View>
              <Text style={styles.statLabel}>{t.activity.estimatedNet}</Text>
              <Text style={styles.statValue}>
                {formatDollars(netToday)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.weekCard}>
          <Text style={styles.weekTitle}>{t.activity.last7days}</Text>

          <View style={styles.chart}>
            {weeklyData.map((day, index) => (
              <View key={day.dateKey} style={styles.weekColumn}>
                <Animated.View
                  style={[
                    styles.bar,
                    { height: animatedBars[index] },
                  ]}
                />

                <Text style={styles.dayLabel}>
                  {day.label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.taxNote}>
            {t.activity.estPocket} {formatDollars(estimatedTaxPocket)}
          </Text>
          <Text style={styles.taxPocketRate}>
            {t.activity.taxPocketrate} {taxRate}% {t.activity.savingsRate}
          </Text>
        </View>
          <View style={styles.rangeSummaryCard}>
            <Text style={styles.rangeSummaryTitle}>{t.activity.rangeSummary}</Text>
              <View style={styles.rangeSelector}>
                {[
                  { key: "7d", label: t.activity.range7d },
                  { key: "month", label: t.activity.rangeMonth },
                  { key: "lastMonth", label: t.activity.rangeLastMonth },
                  { key: "ytd", label: t.activity.rangeYtd },
                  { key: "custom", label: t.activity.rangeCustom },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.rangeButton,
                      reportRange === item.key && styles.rangeButtonActive,
                    ]}
                    onPress={() =>
                      setReportRange(
                        item.key as "7d" | "month" | "lastMonth" | "ytd" | "custom"
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.rangeButtonText,
                        reportRange === item.key && styles.rangeButtonTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {reportRange === "custom" ? (
                <View style={styles.customDateCard}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowStartPicker(true)}
                  >
                    <Text style={styles.dateLabel}>{t.activity.start}</Text>
                    <Text style={styles.dateValue}>
                      {customStartDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndPicker(true)}
                  >
                    <Text style={styles.dateLabel}>{t.activity.end}</Text>
                    <Text style={styles.dateValue}>
                      {customEndDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {showStartPicker ? (
                <View style={styles.pickerCard}>
                  <DateTimePicker
                    value={customStartDate}
                    mode="date"
                    display="spinner"
                    textColor="#0f172a"
                    maximumDate={new Date()}
                    minimumDate={workerCreatedAt}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) setCustomStartDate(selectedDate);
                    }}
                  />
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setShowStartPicker(false)}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {showEndPicker ? (
                <View style={styles.pickerCard}>
                  <DateTimePicker
                    value={customEndDate}
                    mode="date"
                    display="spinner"
                    textColor="#0f172a"
                    maximumDate={new Date()}
                    minimumDate={workerCreatedAt}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) setCustomEndDate(selectedDate);
                    }}
                  />

                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setShowEndPicker(false)}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            <Text style={styles.rangeSummarySubtitle}>{reportPeriod}</Text>

            <View style={styles.rangeGrid}>
              <View style={styles.rangeMetricBox}>
                <Text style={styles.rangeMetricLabel}><Text>{t.activity.grossTips}</Text></Text>
                <Text style={styles.rangeMetricValue}>
                  {formatDollars(rangeSummary.grossTips)}
                </Text>
              </View>

              <View style={styles.rangeMetricBox}>
                <Text style={styles.rangeMetricLabel}><Text>{t.activity.netPayout}</Text></Text>
                <Text style={styles.rangeMetricValue}>
                  {formatDollars(rangeSummary.netPayout)}
                </Text>
              </View>

              <View style={styles.rangeMetricBox}>
                <Text style={styles.rangeMetricLabel}><Text>{t.activity.taxPocket}</Text></Text>
                <Text style={styles.rangeMetricValue}>
                  {formatDollars(rangeSummary.taxPocket)}
                </Text>
              </View>

              <View style={styles.rangeMetricBox}>
                <Text style={styles.rangeMetricLabel}><Text>{t.activity.available}</Text></Text>
                <Text style={styles.rangeMetricValue}>
                  {formatDollars(rangeSummary.available)}
                </Text>
              </View>
            </View>
          </View>

        <View style={styles.exportCard}>
          <Text style={styles.exportTitle}>{t.activity.exportsTitle}</Text>
          <Text style={styles.exportSubtitle}>{t.activity.exportsSubtitle}</Text>

          <View style={styles.exportRow}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={async () => {
                try {
                  await exportTransactionsPdf(
                    filteredTransactions,
                    worker?.full_name || "",
                    reportPeriod
                  );
                } catch (error) {
                  console.error("PDF export error:", error);
                  Alert.alert("Export failed", "Unable to generate PDF.");
                }
              }}
            >
              <Text style={styles.exportButtonText}>{t.activity.exportPdf}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={async () => {
                try {
                  await exportTransactionsXlsx(
                    filteredTransactions,
                    worker?.full_name || "Thankly Worker",
                    reportPeriod
                  );
                } catch (error) {
                  console.error("XLSX export error:", error);
                  Alert.alert("Export failed", "Unable to generate Excel file.");
                }
              }}
            >
              <Text style={styles.exportButtonText}>{t.activity.exportExcel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transactionsCard}>
          <Text style={styles.transactionsTitle}>
            {t.activity.history}
          </Text>

          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>
              {t.activity.Historysub}
            </Text>
          ) : (
            transactions.slice(0, 10).map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={styles.transactionRow}
                onPress={() =>
                  router.push({
                    pathname: "/transaction-detail",
                    params: { transactionId: tx.id },
                  })
                }
              >
                <View>
                  <Text style={styles.transactionTime}>
                    {formatTime(tx.created_at)}
                  </Text>

                  <Text style={styles.transactionStatus}>
                    {tx.status}
                  </Text>
                </View>

                <Text style={styles.transactionAmount}>
                  {formatDollars(tx.tip_amount)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#eef2f7",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#eef2f7",
  },

  content: { padding: 20, paddingBottom: 120 },
  header: {
    backgroundColor: "#0f4c8a",
    marginHorizontal: -20,
    paddingTop: 78,
    paddingBottom: 34,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    alignItems: "center",
  },

  logo: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 4,
  },

  avatar: {
    marginTop: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#67a6f2",
    borderWidth: 5,
    borderColor: "#b9d6ff",
    alignItems: "center",
    justifyContent: "center",
  },

  customDateCard: {
    marginHorizontal: 22,
    marginTop: 12,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },

  taxPocketRate: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  dateLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
  },

  dateValue: {
    marginTop: 4,
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900",
  },
  
  avatarText: {
    color: "white",
    fontSize: 42,
    fontWeight: "800",
  },

  name: {
    marginTop: 18,
    color: "white",
    fontSize: 42,
    fontWeight: "900",
  },

  title: {
    marginTop: 40,
    color: "#d7e8ff",
    fontSize: 18,
    paddingTop: 20,
  },
  subtitle: {
    marginTop: 30,
    color: "#d7e8ff",
    fontSize: 18,
  },

  pickerCard: {
    marginHorizontal: 22,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 12,
  },

  rangeSummaryCard: {
    marginTop: isAndroid? 5 : 7,
    backgroundColor: "white",
    borderRadius: 26,
    padding: 22,
    paddingTop: isAndroid? 15 : 17,
    paddingBottom: isAndroid? 15 : 17,
  },

  rangeSummaryTitle: {
    color: "#0f172a",
    fontSize: isAndroid ? 17 : 19,
    fontWeight: "700",
  },

rangeSummarySubtitle: {
  marginTop: 4,
  color: "#64748b",
  fontSize: 14,
  fontWeight: "700",
},

rangeGrid: {
  marginTop: 16,
  flexDirection: "row",
  flexWrap: "wrap",
  gap: isAndroid? 6 : 12,
},

  rangeMetricBox: {
    width: "48%",
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    padding: isAndroid? 2 : 14,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  rangeMetricLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: isAndroid? 4 : 6,
  },

  rangeMetricValue: {
    marginTop: 8,
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "800",
    paddingHorizontal: isAndroid? 4 : 6,
  },

  doneButton: {
    marginTop: 8,
    backgroundColor: "#0f4c81",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
  },

  doneButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "900",
  },
  
  todayCard: {
    marginTop: isAndroid? 5 : 7,
    backgroundColor: "white",
    borderRadius: 24,
    padding: isAndroid? 12 : 18,
    paddingBottom: isAndroid? 12 : 16,
  },

  weekCard: {
    marginTop: isAndroid? 5 : 7,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 14,
    paddingVertical: isAndroid? 10 : 14,
  },

  weekTitle: {
    color: "#0f172a",
    fontSize: isAndroid ? 17 : 19,
    fontWeight: "700",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: isAndroid? 17 : 19,
    fontWeight: "700",
    textAlign: "left",
    color: "#0f172a",
  },
  rangeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: isAndroid? 8 : 10,
    gap: 2,
    paddingBottom: 0,
    paddingHorizontal: isAndroid? -10 : -5,
    marginBottom: 8,
  },

  rangeButton: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: isAndroid? 5 : 10,
    paddingVertical: isAndroid? 5 : 10,
    borderRadius: 18,
  },

  rangeButtonActive: {
    backgroundColor: "#0f4c81",
  },

  rangeButtonText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 13,
  },

  rangeButtonTextActive: {
    color: "white",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: isAndroid? 2 : 4,
  },

  statLabel: {
    color: "#64748b",
    fontSize: 13,
    marginLeft: isAndroid? 5 : 5,
  },

  statValue: {
    marginTop: 6,
    fontSize: 28,
    marginLeft: isAndroid? 5 : 5,
    fontWeight: "800",
    color: "#0f172a",
  },

  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 80,
    marginTop: 8,
  },

  barSmall: {
    width: 28,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#c9e3ff",
  },

  bar: {
    width: 28,
    height: 75,
    borderRadius: 10,
    backgroundColor: "#9bc9ff",
  },

  barActive: {
    width: 28,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#5ea7ff",
  },
  dayLabels: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },

  dayLabel: {
    width: 24,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "800",
  },

  chartLabel: {
    marginTop: 12,
    textAlign: "center",
    color: "#64748b",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginTop: isAndroid? 8 : 10,
  },

  actionButton: {
    flex: 1,
    width: "48%",
    backgroundColor: "#eff6ff",
    borderWidth: 2,
    borderColor: "#bfdbfe",
    borderRadius: 26,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 5,
    gap: 14,
  },

  actionText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },

  taxNote: {
    marginTop: 18,
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
  },

  exportCard: {
    marginTop: isAndroid? 5 : 7,
    backgroundColor: "white",
    borderRadius: 26,
    paddingTop: isAndroid? 15 : 17,
    padding: 22,
    paddingBottom: isAndroid? 15 : 17,
  },

  exportTitle: {
    color: "#0f172a",
    fontSize: isAndroid ? 17 : 19,
    fontWeight: "700",
  },

  exportSubtitle: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },

  exportRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },

  exportButton: {
    flex: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  exportButtonText: {
    color: "#0f4c81",
    fontSize: 15,
    fontWeight: "900",
  },

  transactionsCard: {
    marginTop: isAndroid? 5 : 7,
    paddingBottom: isAndroid? 15 : 17,
    backgroundColor: "white",
    borderRadius: 26,
    paddingTop: isAndroid? 15 : 17,
    padding: 24,
  },

  transactionsTitle: {
    fontSize: isAndroid ? 17 : 19,
    fontWeight: "700",
    color: "#0f172a",
  },

  emptyText: {
    marginTop: isAndroid? 8 : 10,
    fontSize: 14,
    color: "#64748b",
  },

  weekColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  
  transactionRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 14,
  },

  transactionTime: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
  },

  transactionStatus: {
    marginTop: 4,
    color: "#64748b",
    textTransform: "capitalize",
  },

  transactionAmount: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
  },
});
