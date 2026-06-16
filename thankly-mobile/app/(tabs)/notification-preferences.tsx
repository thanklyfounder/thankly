import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import SectionHeader from "@/components/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
export default function NotificationPreferencesScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [payoutsEnabled, setPayoutsEnabled] = useState(true);
  const [accountEnabled, setAccountEnabled] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, [user?.id]);

  async function loadPreferences() {
    if (!user?.id) return;

    const { data } = await supabase
      .from("workers")
      .select("notify_tips, notify_payouts, notify_account_updates")
      .eq("auth_user_id", user.id)
      .single();

    if (!data) return;

    setTipsEnabled(data.notify_tips ?? true);
    setPayoutsEnabled(data.notify_payouts ?? true);
    setAccountEnabled(data.notify_account_updates ?? true);
  }

  async function updatePreference(field: string, value: boolean) {
    if (!user?.id) return;

    const { error } = await supabase
      .from("workers")
      .update({ [field]: value })
      .eq("auth_user_id", user.id);

    if (error) {
      Alert.alert("Error", "Unable to update notification preference.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title={t.notifications.notifications}
          subtitle={t.notifications.notificationsSub}
        />

        <View style={styles.card}>
          <PreferenceRow
            title={t.notifications.tipNotifications}
            subtitle={t.notifications.tipNotificationsSub}
            value={tipsEnabled}
            onValueChange={(value) => {
              setTipsEnabled(value);
              updatePreference("notify_tips", value);
            }}
          />

          <PreferenceRow
            title={t.notifications.payoutUpdates}
            subtitle={t.notifications.payoutUpdatesSub}
            value={payoutsEnabled}
            onValueChange={(value) => {
              setPayoutsEnabled(value);
              updatePreference("notify_payouts", value);
            }}
          />

          <PreferenceRow
            title={t.notifications.accountUpdates}
            subtitle={t.notifications.accountUpdatesSub}
            value={accountEnabled}
            onValueChange={(value) => {
              setAccountEnabled(value);
              updatePreference("notify_account_updates", value);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PreferenceRow({
  title,
  subtitle,
  value,
  onValueChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  content: { padding: 20, paddingBottom: 120 },

  card: {
    marginTop: 18,
    backgroundColor: "white",
    borderRadius: 28,
    padding: 22,
  },

  row: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  rowText: { flex: 1 },

  rowTitle: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "800",
  },

  rowSubtitle: {
    marginTop: 5,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },
});