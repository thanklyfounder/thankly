import { useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import React from "react";
import { Image } from "react-native";
import qrTabIcon from "../../assets/images/thankly-qr-tab-icon.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { isSmallScreen, rs, clamp } from "@/utils/responsive";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCurrentWorker,
  getWorkerFeedback,
  getWorkerTransactions,
} from "@/services/workerService";

type Worker = {
  id: string;
  full_name: string;
  bio?: string | null;
  bio_es?: string | null;
  tax_withholding_rate?: number | null;
  avatar_url?: string | null;
};

type Transaction = {
  id: string;
  tip_amount: number;
  worker_receives: number;
  status: string;
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
        : Math.max(
            28,
            Math.round((day.amount / maxAmount) * 100)
        ),
  }));
}

export default function HomeScreen() {
  const { user } = useAuth();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { t, language } = useLanguage();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const weeklyData = getLast7DayEarnings(transactions);
  const [businessLinks, setBusinessLinks] = useState<{ business_id: string; businesses: { name: string } | null }[]>([]);
  const [activeShift, setActiveShift] = useState<{ id: string; business_id: string | null; is_personal: boolean; businesses?: { name: string } | null } | null>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);


  const animatedBars = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0))
  ).current;

  useFocusEffect(
    
    React.useCallback(() => {
      async function loadHomeData() {
        if (!user?.id) return;

        try {
          setLoading(true);

          const currentWorker = await getCurrentWorker(user.id);
          setWorker(currentWorker);

          if (currentWorker?.id) {
            const txs = await getWorkerTransactions(currentWorker.id);
            setTransactions(txs);

            const feedbackRows = await getWorkerFeedback(currentWorker.id);
            setFeedback(feedbackRows);

              // Load business links
            const { data: links } = await supabase
              .from("business_workers")
              .select("business_id, businesses(name)")
              .eq("worker_id", currentWorker.id)
              .eq("status", "active");
            setBusinessLinks((links as any) ?? []);

            // Load active shift
            const shiftRes = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/api/mobile/shift/active?authUserId=${user.id}`
            );
            if (shiftRes.ok) {
              const shiftData = await shiftRes.json();
              setActiveShift(shiftData.shift ?? null);
            }
          }
          
        } catch (error) {
          console.error("Home load error:", error);
        } finally {
          setLoading(false);
        }
      }
      //loadWorkerData();
      loadHomeData();
    }, [user?.id, language])

  );
  React.useEffect(() => {
    animatedBars.forEach((bar) => bar.setValue(0));

    Animated.stagger(
      80,
      animatedBars.map((bar, index) =>
        Animated.spring(bar, {
          toValue: weeklyData[index].height,
          useNativeDriver: false,
        })
      )
    ).start();
  }, [transactions]);

  const todayTransactions = useMemo(
    () => transactions.filter((tx) => isToday(tx.created_at)),
    [transactions]
  );

  const tipsToday = todayTransactions.reduce(
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
  const safeToSpend = netToday - estimatedTaxPocket;

  const recentTransactions = transactions.slice(0, 3);

  const averageRating =
    feedback.length > 0
      ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
      : null;

  const latestNote = feedback.find((item) => item.note)?.note;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }

  const workerName = worker?.full_name ?? "";
  const workerInitial = workerName.charAt(0).toUpperCase();

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? t.home.goodMorning
      : currentHour < 18
        ? t.home.goodAfternoon
        : t.home.goodEvening;

  const tagline =
    language === "es"
    ? worker?.bio_es || worker?.bio || t.home.defaultBio
    : worker?.bio || t.home.defaultBio;

  const workplace = worker?.workplace ?? "";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#1b5a96", "#0f3f73"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.homeCanopy}
        >
          <View style={styles.heroRow}>
            <View style={styles.headerAvatarCircle}>
              {worker?.avatar_url ? (
                <Image
                  source={{ uri: worker.avatar_url }}
                  style={styles.headerAvatar}
                />
              ) : (
                <Text style={styles.headerAvatarInitial}>
                  {worker?.full_name?.charAt(0).toUpperCase() ?? "T"}
                </Text>
              )}
            </View>
            <Text 
              style={styles.greeting}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {greeting}, {workerName} 👋
            </Text>
          </View>

          <Text style={styles.tagline}>{tagline}</Text>
            {workplace ? (
              <Text style={styles.workplace}>
                {workplace}📍
              </Text>
            ) : null}

          <View style={styles.performanceCard}>
            <Image
              source={require("@/assets/logos/thankly-logo-primary.png")}
              style={styles.performanceLogo}
              resizeMode="contain"
            />
            <Text style={styles.cardTitle}>{t.home.todayPerformance}</Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>{t.home.tipsReceived}</Text>
                <Text style={styles.statValue}>{formatDollars(tipsToday)}</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statLabel}>{t.home.transactions}</Text>
                <Text style={styles.statValue}>{todayTransactions.length}</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statLabel}>{t.home.estimatedNet}</Text>
                <Text style={styles.statValue}>{formatDollars(netToday)}</Text>
              </View>
            </View>
          
          </View>
        </LinearGradient>

        {businessLinks.length > 0 && (
          <TouchableOpacity
            style={activeShift ? styles.shiftBannerActive : styles.shiftBannerIdle}
            onPress={() => setShowShiftModal(true)}
          >
            <Text style={activeShift ? styles.shiftBannerTextActive : styles.shiftBannerTextIdle}>
              {activeShift
                ? `● On shift — ${activeShift.is_personal ? "Personal / Independent" : (activeShift.businesses?.name ?? "Business")}`
                : "Working today? Start a shift to organize tips by workplace."}
            </Text>
            <Text style={styles.shiftBannerCaret}>›</Text>
          </TouchableOpacity>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButtonSecondary}
            onPress={() => router.push("/(tabs)/qr")}
          >
            <Image
              source={qrTabIcon}
              style={styles.actionIconImage}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>{t.home.viewQr}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonPrimary}
            onPress={() => router.push("/(tabs)/payouts")}
          >
            <Text style={styles.actionIcon}>🏦</Text>
            <Text style={styles.actionTextLight}>{t.home.initiatePayout}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.financeCard}>
          <Text style={styles.financeTitle}>{t.home.financialSummary}</Text>

          <View style={styles.financeBuckets}>
            <View style={styles.safeBucket}>
              <Text style={styles.bucketLabel}>{t.home.safeToSpend}</Text>
              <Text style={styles.safeBucketValue}>
                {formatDollars(safeToSpend)}
              </Text>
              <Text style={styles.bucketSubtext}>{t.home.availableAfterReserve}</Text>
            </View>

            <View style={styles.taxBucket}>
              <Text style={styles.bucketLabel}>{t.home.taxPocket}</Text>
              <Text style={styles.taxBucketValue}>
                {formatDollars(estimatedTaxPocket)}
              </Text>
//            <Text style={styles.bucketSubtext}>{t.home.setAside}</Text>
              <Text style={styles.taxPocketRate}>
                {t.activity.taxPocketrate} {taxRate}% {t.home.savingsRate}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.praiseCard}>
          <Text style={styles.sectionTitle}>{t.home.recentPraise}</Text>

          {averageRating ? (
            <>
              <Text style={styles.ratingText}>
                ⭐⭐⭐⭐⭐ {averageRating.toFixed(1)}
              </Text>

              {latestNote ? (
                <Text style={styles.praiseNote}>“{latestNote}”</Text>
              ) : (
                <Text style={styles.emptyText}>
                  Ratings are comin in. Customer notes will appear here.
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.emptyText}>
              {t.home.recentPraiseSub}
            </Text>
          )}
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>{t.home.recentActivity}</Text>
            <Text style={styles.seeAll}>{t.home.seeAll}</Text>
          </View>

          {recentTransactions.length === 0 ? (
            <Text style={styles.emptyText}>{t.home.noRecentTips}</Text>
          ) : (
            recentTransactions.map((tx) => (
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

      <Modal
        visible={showShiftModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowShiftModal(false)}
      >
        <View style={styles.shiftModalOverlay}>
          <View style={styles.shiftModalCard}>
            <Text style={styles.shiftModalTitle}>
              {activeShift ? "Manage Shift" : "Where are you working today?"}
            </Text>

            {activeShift && (
              <TouchableOpacity
                style={styles.shiftEndButton}
                onPress={async () => {
                  await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/mobile/shift/end`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ authUserId: user?.id }),
                  });
                  setActiveShift(null);
                  setShowShiftModal(false);
                }}
              >
                <Text style={styles.shiftEndText}>End current shift</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.shiftOption}
              onPress={async () => {
                const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/mobile/shift/start`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ authUserId: user?.id, isPersonal: true }),
                });
                const data = await res.json();
                setActiveShift(data.shift);
                setShowShiftModal(false);
              }}
            >
              <Text style={styles.shiftOptionText}>Personal / Independent</Text>
            </TouchableOpacity>

            {businessLinks.map((link) => (
              <TouchableOpacity
                key={link.business_id}
                style={styles.shiftOption}
                onPress={async () => {
                  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/mobile/shift/start`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      authUserId: user?.id,
                      businessId: link.business_id,
                      isPersonal: false,
                    }),
                  });
                  const data = await res.json();
                  setActiveShift(data.shift);
                  setShowShiftModal(false);
                }}
              >
                <Text style={styles.shiftOptionText}>{link.businesses?.name ?? "Business"}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.shiftAddBusiness}
              onPress={() => {
                setShowShiftModal(false);
                router.push("/(tabs)/settings");
              }}
            >
              <Text style={styles.shiftAddBusinessText}>+ Link a workplace</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shiftModalCancel}
              onPress={() => setShowShiftModal(false)}
            >
              <Text style={styles.shiftModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    shiftBannerActive: {
    marginTop: 10,
    marginBottom: 2,
    backgroundColor: "#dcfce7",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  shiftBannerIdle: {
    marginTop: 10,
    marginBottom: 2,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  shiftBannerTextActive: {
    flex: 1,
    color: "#166534",
    fontSize: 13,
    fontWeight: "700",
  },
  shiftBannerTextIdle: {
    flex: 1,
    color: "#1e40af",
    fontSize: 13,
    fontWeight: "600",
  },
  shiftBannerCaret: {
    color: "#94a3b8",
    fontSize: 18,
    marginLeft: 8,
  },
  shiftModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  shiftModalCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
  },
  shiftModalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 14,
  },
  shiftOption: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  shiftOptionText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },
  shiftEndButton: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    alignItems: "center",
  },
  shiftEndText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "700",
  },
  shiftAddBusiness: {
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 4,
  },
  shiftAddBusinessText: {
    color: "#0284c7",
    fontSize: 14,
    fontWeight: "600",
  },
  shiftModalCancel: {
    paddingVertical: 11,
    alignItems: "center",
  },
  shiftModalCancelText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
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
    padding: 16,
    paddingBottom: 100,
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#0f4c81",
    borderRadius: 34,
    padding: 28,
    alignItems: "center",
  },

  brand: {
    color: "#dbeafe",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 16,
  },

  heroRow: {
    marginTop: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingLeft: 16,
  },
  headerAvatarCircle: {
    width: isSmallScreen ? 92 : 118,
    height: isSmallScreen ? 92 : 118,
    borderRadius: isSmallScreen ? 46 : 59,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    marginBottom: 5,
    alignSelf: "center",
    overflow: "hidden",
  },

  headerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.92)",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },

  headerAvatarInitial: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },
  workplace: {
    marginTop: 4,
    color: "#bfdbfe",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
  },

  avatar: {
    marginTop: 18,
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#60a5fa",
    borderWidth: 4,
    borderColor: "#bfdbfe",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
  },

  actionIconImage: {
    width: 22,
    height: 22,
    marginBottom: 4,
    opacity: 0.75,
  },

  name: {
    marginTop: 14,
    color: "white",
    fontSize: 32,
    fontWeight: "900",
  },

  badge: {
    marginTop: 10,
    backgroundColor: "#dbeafe",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  greeting: {
    flexShrink: 1,
    color: "white",
    fontSize: clamp(rs(28), 22, 30),
    lineHeight: 39,
    fontWeight: "600",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 12,
    color: "#dbeafe",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  
  financeTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  financeBuckets: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },

  safeBucket: {
    flex: 1.25,
    backgroundColor: "white",
    borderRadius: 22,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  taxBucket: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  bucketLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "900",
  },

  safeBucketValue: {
    marginTop: 8,
    color: "#0f172a",
    fontSize: 30,
    fontWeight: "900",
  },

  taxBucketValue: {
    marginTop: 8,
    color: "#0f4c81",
    fontSize: 24,
    fontWeight: "900",
  },

  bucketSubtext: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
  },

  badgeText: {
    color: "#0f4c81",
    fontWeight: "900",
    fontSize: 12,
  },

  performanceLogo: {
    width: 48,
    height: 48,
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 0,
    opacity: 0.75,
  },

  tagline: {
    marginTop: 5,
    color: "#dbeafe",
    textAlign: "center",
    fontSize: 18,
    lineHeight: 24,
  },

  homeCanopy: {
    marginHorizontal: -20,
    marginTop: -20,
    paddingTop: isSmallScreen ? 6 : 9,
    paddingBottom: isSmallScreen ? 6 : 9,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },

  cardTitleLight: {
    textAlign: "center",
    color: "white",
    fontSize: 23,
    fontWeight: "500",
  },

  statLabelLight: {
    color: "#dbeafe",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  statValueLight: {
    marginTop: 6,
    color: "white",
    fontSize: 19,
    fontWeight: "900",
  },

  barGlass: {
    width: 24,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },

  barActiveGlass: {
    width: 24,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.35",
  },
  dayLabels: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },

  dayLabel: {
    marginTop: 8,
    width: 24,
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "800",
  },
  
  chartLabelLight: {
    marginTop: 10,
    textAlign: "center",
    color: "#dbeafe",
    fontSize: 13,
  },

  headerLogo: {
    paddingTop: 4,
    width: 360,
    height: 72,
    marginTop: 2,
    marginBottom: 0,
    alignItems: "center",
  },
  performanceCard: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },

    
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 18,
    paddingVertical: 0,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  taxPocketRate: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 12,
  },

  actionButtonPrimary: {
    flex: 1,
    backgroundColor: "#dbeafe",
    borderRadius: 18,
    height: 64,
    paddingVertical: 0,
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 5,
    borderWidth: 1,
    borderColor: "#93c5fd",
  },

  cardTitle: {
    textAlign: "center",
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "600",
  },

  statsRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  statValue: {
    marginTop: 6,
    color: "#0f172a",
    fontSize: 19,
    fontWeight: "900",
  },

  chart: {
    marginTop: 26,
    marginBottom: 6,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 14,
  },

  trendChart: {
    marginTop: 28,
    height: 120,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    position: "relative",
  },

  trendBaseline: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 30,
    height: 2,
    backgroundColor: "#cbd5e1",
  },

  trendColumn: {
    width: 24,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },

  trendConnector: {
    position: "absolute",
    bottom: 42,
    left: 24,
    width: 42,
    height: 2,
    backgroundColor: "#cbd5e1",
  },

  trendPoint: {
    width: 24,
    borderRadius: 10,
    backgroundColor: "#93c5fd",
    zIndex: 2,
  },

  trendPointActive: {
    width: 24,
    borderRadius: 10,
    backgroundColor: "#0f4c81",
    zIndex: 2,
  },

  bar: {
    width: 24,
    borderRadius: 10,
    backgroundColor: "#93c5fd",
  },

  barActive: {
    width: 24,
    borderRadius: 10,
    backgroundColor: "#0f4c81",
  },

  chartLabel: {
    marginTop: 10,
    textAlign: "center",
    color: "#475569",
    fontSize: 13,
  },

  actionsRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },

  actionButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#0f4c81",
    paddingVertical: 18,
    alignItems: "center",
  },

  actionIcon: {
    fontSize: 22,
    marginBottom: 4,
  },

  actionText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  actionTextLight: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  financeCard: {
    marginTop: 6,
    marginHorizontal: 0,
    backgroundColor: "#edf7ee",
    borderRadius: 24,
    padding: 10,
  },

  financeLabel: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "900",
  },

  financeValue: {
    marginTop: 8,
    color: "#0f172a",
    fontSize: 38,
    fontWeight: "900",
  },

  taxRow: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#bbf7d0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  taxLabel: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "800",
  },

  taxValue: {
    marginTop: 4,
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
  },

  infoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    color: "white",
    fontWeight: "900",
  },

  praiseCard: {
    marginTop: 6,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 12,
  },

  ratingText: {
    marginTop: 10,
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
  },

  praiseNote: {
    marginTop: 12,
    color: "#334155",
    fontSize: 16,
    lineHeight: 22,
    fontStyle: "italic",
  },

  activityCard: {
    marginTop: 6,
    backgroundColor: "white",
    borderRadius: 28,
    padding: 14,
  },

  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "700",
  },

  seeAll: {
    color: "#0284c7",
    fontWeight: "900",
  },

  emptyText: {
    marginTop: 16,
    color: "#64748b",
    fontSize: 14,
  },

  transactionRow: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  transactionTime: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 15,
  },

  transactionStatus: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 13,
    textTransform: "capitalize",
  },

  transactionAmount: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "900",
  },
});
