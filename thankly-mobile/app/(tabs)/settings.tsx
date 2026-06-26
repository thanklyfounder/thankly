import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { router, useFocusEffect } from "expo-router";

import { useLanguage } from "@/contexts/LanguageContext";
import { Platform } from "react-native";
import SectionHeader from "@/components/SectionHeader";

function SettingsRow({
  icon,
  title,
  subtitle,
  danger = false,
  avatar_url,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  danger?: boolean;
  avatar_url?: string | null;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <View style={styles.rowTextWrap}>
        <Text style={[styles.rowTitle, danger && styles.dangerText]}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}
const isAndroid = Platform.OS === "android";
export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [withholding, setWithholding] = useState(15);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customWithholding, setCustomWithholding] = useState("");
  const [customError, setCustomError] = useState("");
  const [hasAcknowledgedTaxDisclaimer, setHasAcknowledgedTaxDisclaimer] = useState(false);
  const [pendingWithholding, setPendingWithholding] = useState<number | null>(null);
  const [showTaxModal, setShowTaxModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFinancialPreferences();
    }, [user?.id])
  );

  async function loadFinancialPreferences() {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("workers")
      .select("tax_withholding_rate")
      .eq("auth_user_id", user.id)
      .single();
    
    if (error || !data) return;

    if (data.tax_withholding_rate !== null) {
      setWithholding(
        Math.round(Number(data.tax_withholding_rate) * 100)
      );
    }
  }

  async function handleSignOut() {
    await signOut();
    Alert.alert("Signed out", "You have been signed out. See you soon!👋");
  }

  async function saveFinancialPreferences() {
    if (!user?.id) {
      Alert.alert("Error", "User not found. ");
      return;
    }

    const { error } = await supabase
      .from("workers")
      .update({
        tax_withholding_rate: withholding ,
        tax_disclaimer_acknowledged_at: hasAcknowledgedTaxDisclaimer
          ? new Date().toISOString()
          : null,
      })
      .eq("auth_user_id", user.id);
    
    if (error) {
      Alert.alert(
        "Error",
        "Unable to save financial preferences."
      );
      return;
    }

    Alert.alert(
      "Preferences Updated",
      "Estimated tax savings rate updated succesfully."
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.settingsHeader}>
          <Text style={styles.settingsTitle}>{t.settings.title}</Text>
          <Text style={styles.settingsSubtitle}>{t.settings.subtitle}</Text>
        </View>
        <View style={styles.languageCard}>
          <Text style={styles.languageTitle}>{t.settings.language}</Text>

          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === "en" && styles.languageOptionActive,
              ]}
              onPress={() => setLanguage("en")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "en" && styles.languageTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                language === "es" && styles.languageOptionActive,
              ]}
              onPress={() => setLanguage("es")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "es" && styles.languageTextActive,
                ]}
              >
                Español
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.card}>
          <SettingsRow
            icon="👤"
            title={t.settings.profileInfo}
            subtitle={t.settings.profileSubtitle}
            onPress={() => router.push("/(tabs)/edit-profile")}
          />

          <SettingsRow
            icon="🏦"
            title={t.settings.finpreference}
            subtitle={`${t.settings.finpreferencesub}: ${withholding}%`}
            onPress={() => router.push("/(tabs)/financial-preferences")}
          />

          <SettingsRow
            icon="💳"
            title={t.settings.bankAccount}
            subtitle={t.settings.bankSubtitle}
            onPress={() => router.push("/(tabs)/bank-account")}
          />

          <SettingsRow
            icon="🏢"
            title={t.settings.linkWorkplace}
            subtitle={t.settings.linkWorkplaceSubtitle}
            onPress={() => router.push("/(tabs)/link-workplace")}
          />
          <SettingsRow
            icon="🔔"
            title={t.settings.notifications}
            subtitle={t.settings.notificationsSubtitle}
            onPress={() => router.push("/(tabs)/notification-preferences")}
          />

          <SettingsRow
            icon="🛡️"
            title={t.settings.security}
            subtitle={t.settings.securitySubtitle}
            onPress={() => router.push("/(tabs)/security")}
          />

          <SettingsRow
            icon="❓"
            title={t.settings.help}
            subtitle={t.settings.helpSubtitle}
            onPress={() => router.push("/(tabs)/help-support")}
          />
        </View>

        <View style={styles.card}>
          <SettingsRow
            icon="⚠️"
            title={t.settings.deactivation}
            subtitle={t.settings.deactivationSubtitle}
            danger
            onPress={() => router.push("/(tabs)/deactivate-account")}
          />
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t.settings.signout}</Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 30,
    marginTop: -20,
    paddingTop: isAndroid? 40 : 42,
    alignItems: "center",
  },

  brand: {
    color: "white",
    fontSize: 26,
    fontWeight: "900",
  },

  avatar: {
    marginTop: 18,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#60a5fa",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#bfdbfe",
  },

  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 12,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    color: "#0f4c81",
    fontSize: 36,
    fontWeight: "900",
  },

  avatarCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 12,
  },

  changePhotoButton: {
    marginTop: 14,
  },

  changePhotoText: {
    color: "#0f4c81",
    fontSize: 15,
    fontWeight: "900",
  },

  sectionTitle: {
    alignSelf: "flex-start",
    color: "#0f172a",
    fontSize: isAndroid ? 16 : 18,
    fontWeight: "900",
  },

  avatarText: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },
  languageCard: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 26,
    padding: 5,
  },

  languageTitle: {
    color: "#0f172a",
    fontSize: isAndroid ? 16 : 18,
    marginHorizontal: isAndroid? 5 : 7,
    fontWeight: "800",
  },

  languageToggle: {
    marginTop: 4,
    backgroundColor: "#eff6ff",
    borderRadius: 999,
    padding: 4,
    flexDirection: "row",
  },

  languageOption: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },

  languageOptionActive: {
    backgroundColor: "#0f4c81",
  },

  languageText: {
    color: "#0f4c81",
    fontSize: 14,
    fontWeight: "900",
  },

  languageTextActive: {
    color: "white",
  },
  financialCard: {
  marginTop: 16,
  backgroundColor: "white",
  borderRadius: 26,
  padding: 20,
},

financialTitle: {
  color: "#0f172a",
  fontSize: 20,
  fontWeight: "900",
},

financialLabel: {
  marginTop: 16,
  color: "#334155",
  fontSize: 14,
  fontWeight: "900",
},

taxOptions: {
  marginTop: 12,
  flexDirection: "row",
  gap: 8,
  flexWrap: "wrap",
},

taxButton: {
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 999,
  backgroundColor: "#eff6ff",
  borderWidth: 1,
  borderColor: "#bfdbfe",
},

taxButtonActive: {
  backgroundColor: "#0f4c81",
  borderColor: "#0f4c81",
},

taxButtonText: {
  color: "#0f4c81",
  fontSize: 14,
  fontWeight: "900",
},

taxButtonTextActive: {
  color: "white",
},

customInputWrapper: {
  marginTop: 14,
},

customInput: {
  borderWidth: 1,
  borderColor: "#cbd5e1",
  borderRadius: 16,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: "#0f172a",
  fontSize: 15,
  backgroundColor: "#f8fafc",
},

customErrorText: {
  marginTop: 6,
  color: "#dc2626",
  fontSize: 12,
  fontWeight: "700",
},

currentRateText: {
  marginTop: 10,
  color: "#64748b",
  fontSize: 13,
},
taxDisclosure: {
  marginTop: 14,
  color: "#64748b",
  fontSize: 12,
  lineHeight: 18,
},

learnMoreText: {
  marginTop: 8,
  color: "#0f4c81",
  fontSize: 13,
  fontWeight: "900",
},

modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(15, 23, 42, 0.45)",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
},

modalCard: {
  width: "100%",
  backgroundColor: "white",
  borderRadius: 28,
  padding: 24,
},

modalTitle: {
  color: "#0f172a",
  fontSize: 22,
  fontWeight: "900",
  marginBottom: 14,
},

modalText: {
  color: "#475569",
  fontSize: 14,
  lineHeight: 21,
},

modalButton: {
  marginTop: 22,
  backgroundColor: "#0f4c81",
  borderRadius: 18,
  paddingVertical: 14,
  alignItems: "center",
},

modalButtonText: {
  color: "white",
  fontSize: 15,
  fontWeight: "900",
},

financialSaveButton: {
  marginTop: 18,
  backgroundColor: "#0f4c81",
  borderRadius: 20,
  paddingVertical: 14,
  alignItems: "center",
},

financialSaveText: {
  color: "white",
  fontSize: 15,
  fontWeight: "900",
},
  
settingsHeader: {
  marginHorizontal: -20,
  marginTop: -20,
  paddingBottom: 8,
  paddingTop: isAndroid? 30 : 32,
  paddingHorizontal: 24,
  borderBottomLeftRadius: 34,
  borderBottomRightRadius: 34,
  backgroundColor: "#0f4c81",
  alignItems: "center",
},

settingsBrand: {
  color: "white",
  fontSize: 22,
  fontWeight: "900",
},

settingsTitle: {
  marginTop: 0,
  color: "white",
  fontSize: isAndroid ? 22 : 24,
  fontWeight: "700",
  textAlign: "center",
},

settingsSubtitle: {
  marginTop: 8,
  color: "#dbeafe",
  textAlign: "center",
  fontSize: isAndroid ? 11 : 13,
  lineHeight: 20,
},

  subtitle: {
    marginTop: 8,
    color: "#dbeafe",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },

  card: {
    marginTop: 2,
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
  },

  row: {
    minHeight: isAndroid? 40 : 55,
    paddingHorizontal: 18,
    paddingVertical: isAndroid? 12 : 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  iconText: {
    fontSize: 20,
  },

  rowTextWrap: {
    flex: 1,
  },

  rowTitle: {
    color: "#0f172a",
    fontSize: isAndroid? 15 : 17,
    fontWeight: "700",
  },

  rowSubtitle: {
    marginTop: 3,
    color: "#64748b",
    fontSize: isAndroid? 11 : 12,
  },

  dangerText: {
    color: "#b91c1c",
  },

  chevron: {
    color: "#94a3b8",
    fontSize: 34,
    fontWeight: "300",
    marginLeft: 8,
  },

  signOutButton: {
    marginTop: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "white",
    padding: 18,
    alignItems: "center",
  },

  signOutText: {
    color: "#dc2626",
    fontWeight: "900",
    fontSize: 16,
  },
});
