import {
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

const isAndroid = Platform.OS === "android";

export default function DeactivateAccountScreen() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  async function deactivateAccount() {
    if (!user?.id) return;

    Alert.alert(
      "Deactivate Account",
      "Your QR page will be disabled and customers will no longer be able to tip you. You can reactivate later.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("workers")
              .update({
                account_status: "deactivated",
                deactivated_at: new Date().toISOString(),
              })
              .eq("auth_user_id", user.id);

            if (error) {
              Alert.alert("Error", "Unable to deactivate account.");
              return;
            }

            Alert.alert(
              "Account Deactivated",
              "Your Thankly profile has been deactivated."
            );

            await signOut();
          },
        },
      ]
    );
  }

  async function requestAccountDeletion() {
    if (!user?.id) return;

    Alert.alert(
      "Delete Account",
      "This will schedule your Thankly account for permanent deletion. Some transaction, payment, tax, fraud-prevention, or legal records may be retained where required by law or compliance obligations.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Request Deletion",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("workers")
              .update({
                account_status: "pending_deletion",
                deletion_status: "requested",
                deletion_requested_at: new Date().toISOString(),
                deactivated_at: new Date().toISOString(),
              })
              .eq("auth_user_id", user.id);

            if (error) {
              Alert.alert("Error", "Unable to request account deletion.");
              return;
            }

            Alert.alert(
              "Deletion Requested",
              "Your account deletion request has been submitted."
            );

            await signOut();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title={t.deactivation.title}
          subtitle={t.deactivation.subtitle}
        />

        <View style={styles.card}>
          <Text style={styles.title}>{t.deactivation.beforeDeactivate}</Text>

          <Text style={styles.text}>• {t.deactivation.point1}</Text>
          <Text style={styles.text}>• {t.deactivation.point2}</Text>
          <Text style={styles.text}>• {t.deactivation.point3}</Text>
          <Text style={styles.text}>• {t.deactivation.point4}</Text>

          <TouchableOpacity
            style={styles.keepActiveButton}
            onPress={() => router.back()}
          >
            <Text style={styles.keepActiveText}>{t.deactivation.keepActive}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deactivateButton}
            onPress={deactivateAccount}
          >
            <Text style={styles.deactivateText}>{t.deactivation.deactivate}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={requestAccountDeletion}
          >
            <Text style={styles.deleteText}>{t.deactivation.deleteAccount}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  content: { padding: 20, paddingBottom: 120 },

  card: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },

  title: {
    fontSize: isAndroid ? 15 : 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },

  text: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 6,
  },

  keepActiveButton: {
    marginTop: 16,
    backgroundColor: "#dbeafe",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  keepActiveText: {
    color: "#0f3f73",
    fontSize: 15,
    fontWeight: "800",
  },
  
  deactivateButton: {
    marginTop: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#dc2626",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  deactivateText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "800",
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "#64748b",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  deleteText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },
});