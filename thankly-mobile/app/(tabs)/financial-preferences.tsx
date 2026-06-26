import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import SectionHeader from "@/components/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getCurrentWorker } from "@/services/workerService";
import { Platform } from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { LinearGradient } from "expo-linear-gradient";

type Worker = {
  id: string;
  full_name?: string | null;
  stripe_onboarded?: boolean | null;
  stripe_account_id?: string | null;
  avatar_url?: string | null;
};

const PRESET_RATES = [0, 10, 15, 20, 25];
const isAndroid = Platform.OS === "android";
export default function FinancialPreferencesScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [withholding, setWithholding] = useState(15);
  const [customWithholding, setCustomWithholding] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customError, setCustomError] = useState("");
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [hasAcknowledgedTaxDisclaimer, setHasAcknowledgedTaxDisclaimer] =
    useState(false);
  const [saving, setSaving] = useState(false);
  const [modalScrolledToEnd, setModalScrolledToEnd] = useState(false);
  const [modalContentTall, setModalContentTall] = useState(false);

  const [worker, setWorker] = useState<{
    full_name?: string | null;
  } | null>(null);

  useEffect(() => {
    loadFinancialPreferences();
  }, [user?.id]);

  async function loadFinancialPreferences() {
  if (!user?.id) return;

  const { data, error } = await supabase
    .from("workers")
    .select(
      "full_name, tax_withholding_rate, tax_disclaimer_acknowledged_at"
    )
    .eq("auth_user_id", user.id)
    .single();

  if (error) {
    console.log("LOAD FINANCIAL PREFS ERROR:", error);
    return;
  }

  if (!data) return;

  setWorker({
    full_name: data.full_name,
  });

  if (data.tax_withholding_rate !== null) {
    setWithholding(Math.round(Number(data.tax_withholding_rate) * 100));
  }

  const acknowledged = Boolean(data.tax_disclaimer_acknowledged_at);
  setHasAcknowledgedTaxDisclaimer(acknowledged);

  if (!acknowledged) {
    setShowTaxModal(true);
  }
}
  function selectPreset(rate: number) {
    setShowCustomInput(false);
    setCustomError("");
    setWithholding(rate);

    if (!hasAcknowledgedTaxDisclaimer) {
      setShowTaxModal(true);
    }
  }

  function selectCustom() {
    setShowCustomInput(true);

    if (!hasAcknowledgedTaxDisclaimer) {
      setShowTaxModal(true);
    }
  }

  function handleCustomChange(value: string) {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setCustomWithholding(cleanValue);

    const numberValue = Number(cleanValue);

    if (numberValue > 50) {
      setCustomError("Custom Tax Pocket rate cannot exceed 50%.");
      return;
    }

    setCustomError("");

    if (cleanValue) {
      setWithholding(numberValue);
    }
  }

  async function saveFinancialPreferences() {
  if (!user?.id) {
    Alert.alert("Error", "User not found.");
    return;
  }

  if (showCustomInput) {
    const customRate = Number(customWithholding);

    if (!customWithholding || Number.isNaN(customRate)) {
      Alert.alert("Invalid rate", "Please enter a valid custom rate.");
      return;
    }

    if (customRate > 50) {
      Alert.alert("Invalid rate", "Custom Tax Pocket rate cannot exceed 50%.");
      return;
    }

    if (customRate < 0) {
      Alert.alert("Invalid rate", "Custom Tax Pocket rate cannot be negative.");
      return;
    }

    setWithholding(customRate);
  }

  const rateToSave = showCustomInput ? Number(customWithholding) : withholding;

  try {
    setSaving(true);

    const { data, error } = await supabase
      .from("workers")
      .update({
        tax_withholding_rate: rateToSave / 100,
        tax_disclaimer_acknowledged_at: hasAcknowledgedTaxDisclaimer
          ? new Date().toISOString()
          : null,
      })
      .eq("auth_user_id", user.id)
      .select("tax_withholding_rate, tax_disclaimer_acknowledged_at");

    if (error) {
      console.log("SAVE FINANCIAL PREFS ERROR:", error);
      Alert.alert("Error", error.message);
      return;
    }

    console.log("SAVE FINANCIAL PREFS SUCCESS:", data);

    setWithholding(rateToSave);

    Alert.alert(
      "Preferences Updated",
      "Estimated tax savings rate updated successfully."
    );
  } finally {
    setSaving(false);
  }
}
  function acknowledgeDisclaimer() {
    setHasAcknowledgedTaxDisclaimer(true);
    setShowTaxModal(false);
    setModalScrolledToEnd(false);
    setModalContentTall(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title={t.financialpreferences.financialPreferences}
          subtitle={t.financialpreferences.financialPreferencesSub}
        />

        <View style={styles.card}>
          <Text style={styles.title}>{t.financialpreferences.estimatedTaxSavingsRate}</Text>

          <View style={styles.pillWrap}>
            {PRESET_RATES.map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.pill,
                  !showCustomInput && withholding === rate && styles.pillActive,
                ]}
                onPress={() => selectPreset(rate)}
              >
                <Text
                  style={[
                    styles.pillText,
                    !showCustomInput &&
                      withholding === rate &&
                      styles.pillTextActive,
                  ]}
                >
                  {rate}%
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.pill, showCustomInput && styles.pillActive]}
              onPress={selectCustom}
            >
              <Text
                style={[
                  styles.pillText,
                  showCustomInput && styles.pillTextActive,
                ]}
              >
                {t.financialpreferences.custom}
              </Text>
            </TouchableOpacity>
          </View>

          {showCustomInput ? (
            <View style={styles.customBox}>
              <Text style={styles.inputLabel}>Custom Tax Pocket Rate</Text>

              <View style={styles.inputRow}>
                <TextInput
                  value={customWithholding}
                  onChangeText={handleCustomChange}
                  keyboardType="number-pad"
                  placeholder="Enter rate"
                  style={styles.input}
                />
                <Text style={styles.percentText}>%</Text>
              </View>

              {customError ? (
                <Text style={styles.errorText}>{customError}</Text>
              ) : null}
            </View>
          ) : null}

          <Text style={styles.notice}>
            {t.financialpreferences.estimatesOnly}
          </Text>

          <Text style={styles.currentRate}>
            {t.financialpreferences.currentTaxPocketRate} {withholding}%
          </Text>

          <TouchableOpacity onPress={() => setShowTaxModal(true)}>
            <Text style={styles.learnMore}>{t.financialpreferences.learnMore}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={saveFinancialPreferences}
            disabled={saving}
          >
            <Text style={styles.primaryText}>
              {saving ? "Saving..." : t.financialpreferences.savePreferences}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(tabs)/settings")}
          >
            <Text style={styles.secondaryText}>{t.financialpreferences.backToSettings}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showTaxModal}
        transparent
        animationType="fade"
        onRequestClose={() => { setShowTaxModal(false); setModalScrolledToEnd(false); setModalContentTall(false); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.taxModalCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
              onContentSizeChange={(_, contentHeight) => {
                setModalContentTall(contentHeight > 300);
              }}
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                const isAtEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                if (isAtEnd) setModalScrolledToEnd(true);
              }}
              scrollEventThrottle={16}
            >
              <Text style={styles.modalTitle}>
                {t.financialpreferences.taxfinancedisclaimer}
              </Text>
              <Text style={styles.modalText}>
                {t.financialpreferences.disclaimer1}
                {"\n\n"}
                {t.financialpreferences.disclaimer2}
                {"\n\n"}
                {t.financialpreferences.disclaimer3}
                {"\n\n"}
                {t.financialpreferences.disclaimer4}
                {"\n\n"}
                {t.financialpreferences.disclaimer5}
              </Text>
            </ScrollView>

            {modalContentTall && !modalScrolledToEnd && (
              <Text style={styles.scrollHint}>↓ scroll for more</Text>
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={acknowledgeDisclaimer}
            >
              <Text style={styles.primaryText}>
                {t.financialpreferences.gotit}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  content: { padding: 20, paddingBottom: 120 },

  card: {
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 28,
    padding: 22,
    paddingTop: 10,
    paddingBottom: 10,
  },

  title: {
    color: "#0f172a",
    fontSize: isAndroid ? 19 : 20,
    fontWeight: "700",
    marginBottom: 18,
  },

  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: isAndroid ? 8 : 10,
    justifyContent: "space-evenly",
    alignItems: "stretch",
  },

  pill: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: isAndroid ? 18 : 20,
  },

  pillActive: {
    backgroundColor: "#0f4c81",
    borderColor: "#0f4c81",
  },

  pillText: {
    color: "#0f4c81",
    fontSize: isAndroid ? 15 : 17,
    fontWeight: "800",
  },

  pillTextActive: {
    color: "white",
  },

  customBox: {
    marginTop: 18,
  },

  inputLabel: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    padding: 14,
    fontSize: 18,
    color: "#0f172a",
  },

  percentText: {
    marginLeft: 10,
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
  },

  errorText: {
    marginTop: 8,
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "800",
  },

  notice: {
    marginTop: 22,
    color: "#64748b",
    fontSize: 15,
    lineHeight: 22,
  },

  currentRate: {
    marginTop: 14,
    color: "#64748b",
    fontSize: 15,
    fontWeight: "700",
  },

  learnMore: {
    marginTop: isAndroid? 10 : 15,
    color: "#0f4c81",
    fontSize: 16,
    fontWeight: "900",
  },

  primaryButton: {
    marginTop: 18,
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

  secondaryButton: {
    marginTop: 8,
    backgroundColor: "#f8fbfc",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  secondaryText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  taxModalCard: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 28,
    padding: 20,
    position: "relative",
  },

  modalFadeWrap: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    height: 48,
    overflow: "hidden",
  },

  modalFade: {
    flex: 1,
  },

  scrollHint: {
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },

  modalTitle: {
    color: "#0f172a",
    fontSize: isAndroid? 20 : 24,
    fontWeight: "900",
    marginBottom: 18,
  },

  modalText: {
    color: "#475569",
    fontSize: isAndroid? 13 : 15,
    lineHeight: 24,
  },
});