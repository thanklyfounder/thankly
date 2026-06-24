import React, { useRef, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import QRCode from "react-native-qrcode-svg";
import { Image } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentWorker } from "@/services/workerService";
import CompactHeader from "@/components/CompactHeader";
import { Dimensions, Platform } from "react-native";

type Worker = {
  id: string;
  full_name: string;
  profile_slug: string;
  bio?: string | null;
  bio_es?: string | null;
  workplace?: string | null;
  avatar_url?: string | null;
};

const isAndroid = Platform.OS === "android";
export default function MyQrScreen() {
  const { user } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const { t, language } = useLanguage();
  const qrCardRef = useRef<View>(null);
  const screenWidth = Dimensions.get("window").width;
  const qrSize = Math.min(
    Platform.OS === "android" ? screenWidth * 0.64 : screenWidth * 0.64,
    250
  );
  useFocusEffect(
    React.useCallback(() => {
      async function loadWorker() {
        if (!user?.id) return;

        try {
          const data = await getCurrentWorker(user.id);
          setWorker(data);
        } catch (error) {
          console.error("QR worker load error:", error);
        }
      }

      loadWorker();
    }, [user?.id])
  );

  const publicLink = worker?.profile_slug
    ? `https://getthankly.com/${worker.profile_slug}`
    : "https://getthankly.com";

  const workerName = worker?.full_name ?? "Thankly Worker";
  const workplace = worker?.workplace ?? "";
  const workerInitial = workerName.charAt(0).toUpperCase();
  const bio =
    language === "es"
    ? worker?.bio_es || worker?.bio || t.home.defaultBio
    : worker?.bio || t.home.defaultBio;

  async function shareQr() {
  try {
    if (!qrCardRef.current) return;

    const uri = await captureRef(qrCardRef, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });

    await Share.share({
      title: `${workerName} Thankly QR`,
      message: `Scan to tip ${workerName} on Thankly.\n\n${publicLink}`,
      url: uri,
    });
  } catch (error) {
    console.error("Share QR card error:", error);
    Alert.alert("Share failed", "Unable to share QR card. Please try again.");
  }
}

  async function openPublicPage() {
    try {
      await Linking.openURL(publicLink);
    } catch {
      Alert.alert("Unable to open page");
    }
  }

  async function copyLink() {
    await Share.share({
      message: publicLink,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CompactHeader
          title={t.qr.title}
          avatarUrl={worker?.avatar_url}
          fallbackInitial={workerInitial}
        />

        <View style={styles.qrCard}>
          <Text style={styles.scanTitle}>{t.qr.scanTitle} {workerName}</Text>

          {workplace ? (
            <Text style={styles.qrWorkplace}>{workplace}📍</Text>
          ) : null}

          <Text style={styles.scanSubtitle}>
            {t.qr.subtitle}
          </Text>

          <View style={styles.qrOuter}>
            <View style={styles.qrInner}>
              <QRCode
                value={publicLink}
                size={qrSize}
                color="#0f172a"
                backgroundColor="white"
              />   
            </View>
            
            <View style={styles.qrBrandRow}>
              <Image
                source={require("../../assets/logos/thankly-logo-primary.png")}
                style={styles.qrWatermark}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={shareQr}>
          <Text style={styles.primaryText}>{t.qr.share}</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.halfButton} onPress={copyLink}>
            <Text style={styles.halfButtonText}>{t.qr.copy}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.halfButton} onPress={openPublicPage}>
            <Text style={styles.halfButtonText}>{t.qr.preview}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.linkCard}>
          <Text style={styles.label}>{t.qr.public}</Text>
          <Text 
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {publicLink}
          </Text>
        </View>
      </ScrollView>
      <View
        ref={qrCardRef}
        collapsable={false}
        style={styles.exportCard}
      >
        <Image
          source={require("../../assets/logos/thankly-logo-primary.png")}
          style={styles.exportLogo}
          resizeMode="contain"
        />

        {worker?.avatar_url ? (
          <Image
            source={{ uri: worker.avatar_url }}
            style={styles.exportAvatar}
          />
        ) : (
          <View style={styles.exportInitialCircle}>
            <Text style={styles.exportInitial}>
              {workerInitial}
            </Text>
          </View>
        )}

        <Text style={styles.exportName}>{workerName}</Text>

        {!!bio && (
          <Text style={styles.exportBio} numberOfLines={2}>
            {bio}
          </Text>
        )}

        {!!workplace && (
          <Text style={styles.exportWorkplace} numberOfLines={1}>
            {workplace}
          </Text>
        )}

        <View style={styles.exportQrBox}>
          <QRCode
            value={publicLink}
            size={260}
            color="#0f172a"
            backgroundColor="white"
          />
        </View>

        <Text style={styles.exportScanText}>
          Scan to Tip
        </Text>

        <Text style={styles.exportLink} numberOfLines={1}>
          {publicLink.replace("https://", "")}
        </Text>

        <Text style={styles.exportPowered}>
          Powered by Thankly
        </Text>
      </View>
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

  qrWorkplace: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  identityCard: {
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

  avatar: {
    marginTop: 10,
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

  workerName: {
    marginTop: 14,
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },

  bio: {
    marginTop: 10,
    color: "#dbeafe",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },

  qrCard: {
    marginTop: 4,
    backgroundColor: "white",
    borderRadius: 34,
    paddingTop: 8,
    paddingBottom: 10,
    alignItems: "center",
  },

  scanTitle: {
    color: "#0f172a",
    fontSize: isAndroid? 16 : 22,
    lineHeight: 32,
    textAlign: "center",
  },

  qrBrandIcon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
    alignSelf: "flex-end",
    marginTop: 10,
    marginRight: 18,
    opacity: 0.35,
  },
  
  scanSubtitle: {
    marginTop: 4,
    color: "#475569",
    textAlign: "center",
    fontSize: isAndroid? 12 : 15,
    lineHeight: 22,
  },

  workplace: {
    marginTop: 6,
    color: "#bfdbfe",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  qrOuter: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 0,
    backgroundColor: "#f8fafc",
  },

  qrInner: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 20,
  },

  qrBrandRow: {
    marginTop: 1,
    marginBottom: -1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  qrWatermark: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    opacity: 0.40,
  },

  scanHelper: {
    marginTop: 10,
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 13,
  },

  linkCard: {
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 14,
  },

  label: {
    color: "#94a3b8",
    fontSize: 8,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  linkText: {
    marginTop: 10,
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },

  primaryButton: {
    marginTop: 8,
    backgroundColor: "#0284c7",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
  },

  primaryText: {
    color: "white",
    fontSize: 17,
    fontWeight: "900",
  },

  buttonRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 10,
  },

  halfButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 13,
    alignItems: "center",
  },

  halfButtonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
  },
  exportCard: {
    position: "absolute",
    left: -10000,
    top: 0,
    width: 900,
    minHeight: 1300,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 56,
    paddingHorizontal: 56,
    borderRadius: 36,
  },

  exportLogo: {
    width: 110,
    height: 110,
    marginBottom: 18,
  },

  exportAvatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    borderColor: "#0B3D91",
    marginBottom: 20,
  },

  exportInitialCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  exportInitial: {
    fontSize: 58,
    fontWeight: "900",
    color: "#0B3D91",
  },

  exportName: {
    fontSize: 44,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },

  exportBio: {
    marginTop: 10,
    fontSize: 26,
    color: "#64748b",
    textAlign: "center",
  },

  exportWorkplace: {
    marginTop: 6,
    fontSize: 24,
    color: "#0B3D91",
    fontWeight: "700",
    textAlign: "center",
  },

  exportQrBox: {
    marginTop: 36,
    padding: 28,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#dbeafe",
  },

  exportScanText: {
    marginTop: 32,
    fontSize: 34,
    fontWeight: "900",
    color: "#0f172a",
  },

  exportLink: {
    marginTop: 10,
    fontSize: 22,
    color: "#64748b",
    textAlign: "center",
  },

  exportPowered: {
    marginTop: 30,
    fontSize: 20,
    color: "#94a3b8",
    fontWeight: "700",
  },
});
