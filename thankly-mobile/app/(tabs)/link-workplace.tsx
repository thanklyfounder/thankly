import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CameraView, Camera } from "expo-camera";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const isAndroid = Platform.OS === "android";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://getthankly.com";

export default function LinkWorkplaceScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const tl = t.linkworkplace;
  const [mode, setMode] = useState<"menu" | "paste" | "scan">("menu");
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [linkedBusinesses, setLinkedBusinesses] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    loadLinkedBusinesses();
  }, []);

  async function loadLinkedBusinesses() {
    if (!user?.id) return;
    const { data: worker } = await supabase
      .from("workers")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();
    if (!worker) return;

    const { data } = await supabase
      .from("business_workers")
      .select("businesses(name)")
      .eq("worker_id", worker.id)
      .eq("status", "active");

    setLinkedBusinesses((data ?? []).map((d: any) => ({ id: d.business_id, name: d.businesses?.name ?? "" })));
  }

  async function requestCameraPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === "granted");
    if (status === "granted") {
      setMode("scan");
    } else {
      Alert.alert(tl.cameraPermissionTitle, tl.cameraPermissionMessage);
    }
  }

  function extractSlugFromUrl(url: string): string | null {
    try {
      const match = url.match(/\/business\/([^/]+)\/join/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  async function joinBusiness(slug: string) {
    setLoading(true);
    setMessage(null);

    const { data: business } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (!business) {
      setLoading(false);
      setMessage({ text: tl.invalidLink, success: false });
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/business/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, authUserId: user?.id }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage({ text: data.error || "Unable to join business.", success: false });
      return;
    }

    if (data.alreadyJoined) {
      setMessage({ text: tl.alreadyLinked.replace("{name}", business.name), success: true });
      } else {
        setMessage({ text: tl.successLinked.replace("{name}", business.name), success: true });
      loadLinkedBusinesses();
    }
  }

  async function handlePasteJoin() {
    const slug = extractSlugFromUrl(inviteUrl.trim());
    if (!slug) {
      setMessage({ text: "Invalid invite link. It should look like: getthankly.com/business/name/join", success: false });
      return;
    }
    await joinBusiness(slug);
  }

  function handleBarcodeScan({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    setMode("paste");
    setInviteUrl(data);
    const slug = extractSlugFromUrl(data);
    if (slug) {
      joinBusiness(slug);
    } else {
      setMessage({ text: tl.notThanklyQR, success: false });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader 
          title={tl.title} 
          subtitle={tl.subtitle}
        />
        {/* Linked businesses */}
        {linkedBusinesses.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{tl.yourLinked}</Text>
            {linkedBusinesses.map((b, i) => (
              <View key={i} style={styles.linkedRow}>
                <Text style={styles.linkedIcon}>🏢</Text>
                <Text style={styles.linkedName}>{b.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      tl.removeTitle,
                      tl.removeConfirm.replace("{name}", b.name),
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: tl.remove,
                          style: "destructive",
                          onPress: async () => {
                            const response = await fetch(`${API_BASE_URL}/api/business/leave`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ businessId: b.id, authUserId: user?.id }),
                            });
                            if (response.ok) {
                              setLinkedBusinesses((prev) => prev.filter((_, idx) => idx !== i));
                            } else {
                              Alert.alert("Error", tl.removeError);
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Menu */}
        {mode === "menu" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{tl.addWorkplace}</Text>
            <Text style={styles.sectionSub}>{tl.addWorkplaceSub}</Text>

            <TouchableOpacity style={styles.optionButton} onPress={() => setMode("paste")}>
              <Text style={styles.optionIcon}>🔗</Text>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{tl.pasteLink}</Text>
                <Text style={styles.optionSub}>{tl.pasteLinkSub}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={requestCameraPermission}>
              <Text style={styles.optionIcon}>📷</Text>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{tl.scanQR}</Text>
                <Text style={styles.optionSub}>{tl.scanQRSub}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Paste mode */}
        {mode === "paste" && (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => { setMode("menu"); setMessage(null); setInviteUrl(""); }} style={styles.backLink}>
              <Text style={styles.backLinkText}>{tl.back}</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>{tl.pasteLinkTitle}</Text>
            <Text style={styles.sectionSub}>{tl.pasteLinkInstructions}</Text>

            <TextInput
              style={styles.input}
              value={inviteUrl}
              onChangeText={setInviteUrl}
              placeholder={tl.linkPlaceholder}
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            {message ? (
              <Text style={[styles.messageText, message.success ? styles.successText : styles.errorText]}>
                {message.text}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePasteJoin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.primaryText}>{tl.linkButton}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Scan mode */}
        {mode === "scan" && hasCameraPermission && (
          <View style={styles.scanCard}>
            <TouchableOpacity onPress={() => { setMode("menu"); setScanned(false); }} style={styles.backLink}>
              <Text style={styles.backLinkText}>{tl.back}</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{tl.scanTitle}</Text>
            <Text style={styles.sectionSub}>{tl.scanInstructions}</Text>
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarcodeScan}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              />
            </View>
            {scanned && (
              <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
                <Text style={styles.rescanText}>{tl.tapToScan}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.cancelLink} onPress={() => router.back()}>
          <Text style={styles.cancelText}>{tl.backToSettings}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  content: { padding: 16, paddingBottom: 120 },

  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },

  scanCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },

  sectionSub: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 14,
  },

  linkedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 10,
  },

  linkedIcon: { fontSize: 18 },

  linkedName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },

  removeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#dc2626",
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 12,
  },

  optionIcon: { fontSize: 22 },

  optionText: { flex: 1 },

  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },

  optionSub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    lineHeight: 16,
  },

  chevron: {
    color: "#94a3b8",
    fontSize: 20,
  },

  backLink: { marginBottom: 12 },

  backLinkText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#0f172a",
    marginBottom: 10,
  },

  messageText: {
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
  },

  successText: { color: "#166534" },
  errorText: { color: "#dc2626" },

  primaryButton: {
    backgroundColor: "#0284c7",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },

  primaryText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  cameraContainer: {
    borderRadius: 18,
    overflow: "hidden",
    height: 280,
    marginTop: 8,
  },

  camera: { flex: 1 },

  rescanButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 10,
  },

  rescanText: {
    color: "#0284c7",
    fontSize: 14,
    fontWeight: "600",
  },

  cancelLink: {
    alignItems: "center",
    paddingVertical: 12,
  },

  cancelText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
});