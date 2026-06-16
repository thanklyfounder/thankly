import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useLanguage } from "@/contexts/LanguageContext";
import CompactHeader from "@/components/CompactHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCurrentWorker,
  updateWorkerProfile,
} from "@/services/workerService";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [workerId, setWorkerId] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [bioEs, setBioEs] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [profileSlug, setProfileSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [tipAmount1, setTipAmount1] = useState("5");
  const [tipAmount2, setTipAmount2] = useState("10");
  const [tipAmount3, setTipAmount3] = useState("15");

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      const worker = await getCurrentWorker(user.id);

      if (worker) {
        setWorkerId(worker.id);
        setFullName(worker.full_name ?? "");
        setBio(worker.bio ?? "");
        setBioEs(worker.bio_es ?? "");
        setWorkplace(worker.workplace ?? "");
        setProfileSlug(worker.profile_slug ?? "");
        setAvatarUrl(worker.avatar_url ?? null);
        setTipAmount1(String((worker.tip_amount_1 ?? 500) / 100));
        setTipAmount2(String((worker.tip_amount_2 ?? 1000) / 100));
        setTipAmount3(String((worker.tip_amount_3 ?? 1500) / 100));
      }
    }

    loadProfile();
  }, [user?.id]);

  async function pickAvatar() {  
    if (!user?.id || !workerId) {
      Alert.alert(t.editprofile.profileNotReadyTitle, t.editprofile.profileNotReadyMessage);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setAvatarUrl(uri);

    try {
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      const filePath = `${user.id}/avatar-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        Alert.alert(t.editprofile.uploadFailedTitle, uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("workers")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", workerId);

      if (updateError) {
        Alert.alert(t.editprofile.profileUpdateFailedTitle, updateError.message);
        return;
      }

      setAvatarUrl(publicUrl);

      Alert.alert(t.editprofile.profilePhotoUpdatedTitle, t.editprofile.profilePhotoUpdatedMessage);
    } catch (error) {
      console.error(t.editprofile.avataruploaderror, error);
      Alert.alert(t.editprofile.uploadFailedTitle, t.editprofile.uploadFailedMessage);
    }
  }

  async function handleSave() {
    if (!workerId || !fullName.trim() || !profileSlug.trim()) {
      Alert.alert(t.editprofile.missingInformationTitle, t.editprofile.missingInformationMessage);
      return;
    }
    try {
      setSaving(true);

      const tips = [
        Number(tipAmount1),
        Number(tipAmount2),
        Number(tipAmount3),
      ];

      if (tips.some((tip) => Number.isNaN(tip))) {
        Alert.alert(t.editprofile.invalidTipsTitle, t.editprofile.invalidNumbersMessage);
        return;
      }
      if (tips.some((tip) => tip < 5)) {
        Alert.alert(t.editprofile.minimumTipTitle, t.editprofile.minimumTipMessage);
        return;
      }

      if (!(tips[0] < tips[1] && tips[1] < tips[2])) {
        Alert.alert(
          t.editprofile.invalidOrderTitle,
          t.editprofile.invalidOrderMessage,
        );
        return;
      }
      await updateWorkerProfile({
        workerId,
        fullName: fullName.trim(),
        bio: bio.trim(),
        bioEs: bioEs.trim(),
        workplace: workplace.trim(),
        profileSlug: profileSlug.trim().toLowerCase(),
        tipAmount1: Math.round(tips[0] * 100),
        tipAmount2: Math.round(tips[1] * 100),
        tipAmount3: Math.round(tips[2] * 100),
      });

      Alert.alert(t.editprofile.profileUpdated, t.editprofile.thanklyprofilesaved);
      router.back();
    } catch (error) {
      console.error(t.editprofile.saveerror, error);
      Alert.alert(t.editprofile.unablesave, t.editprofile.tryagain);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <CompactHeader
          title={t.editprofile.editProfile}
          subtitle={t.editprofile.editProfileSub}
          avatarUrl={avatarUrl}
          fallbackInitial={fullName?.charAt(0).toUpperCase() || "T"}
        />

        <TouchableOpacity
          style={styles.changePhotoButton}
          onPress={pickAvatar}
        >
          <Text style={styles.changePhotoText}>
            {t.editprofile.changePhoto}
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.label}>{t.editprofile.displayName}</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Maria Gonzalez"
            style={styles.input}
          />

          <Text style={styles.label}>{t.editprofile.bioTagline}</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Your favorite server at Blue Lagoon"
            numberOfLines={2}
            multiline
            style={[styles.input, styles.textarea]}
          />

          <Text style={styles.label}>{t.editprofile.bioTaglineSpanish}</Text>
          <TextInput
            value={bioEs}
            onChangeText={setBioEs}
            placeholder="Tu mesero favorito en Blue Lagoon"
            style={[styles.input, styles.textareaspa]}
          />

          <Text style={styles.label}>{t.editprofile.workplace}</Text>
          <TextInput
            value={workplace}
            onChangeText={setWorkplace}
            placeholder="Blue Lagoon"
            style={styles.input}
          />

          <Text style={styles.label}>{t.editprofile.tipOptions}</Text>

          <Text style={styles.helperText}>
            {t.editprofile.tipOptionsSub}
          </Text>

          <View style={styles.tipRow}>
            <View style={styles.tipInputWrap}>
              <Text style={styles.tipPrefix}>$</Text>
              <TextInput
                value={tipAmount1}
                onChangeText={setTipAmount1}
                keyboardType="decimal-pad"
                style={styles.tipInput}
              />
            </View>

            <View style={styles.tipInputWrap}>
              <Text style={styles.tipPrefix}>$</Text>
              <TextInput
                value={tipAmount2}
                onChangeText={setTipAmount2}
                keyboardType="decimal-pad"
                style={styles.tipInput}
              />
            </View>

            <View style={styles.tipInputWrap}>
              <Text style={styles.tipPrefix}>$</Text>
              <TextInput
                value={tipAmount3}
                onChangeText={setTipAmount3}
                keyboardType="decimal-pad"
                style={styles.tipInput}
              />
            </View>
          </View>

          <Text style={styles.helperText}>
            {t.editprofile.tipOptionsHelp}
          </Text>

          <Text style={styles.tipPreviewLabel}>
            {t.editprofile.customerPreview}
          </Text>

          <View style={styles.tipPreviewRow}>
            {[tipAmount1, tipAmount2, tipAmount3].map((amount, index) => (
              <View key={index} style={styles.tipPreviewPill}>
                <Text style={styles.tipPreviewText}>
                  ${Number(amount || 0).toFixed(0)}
                </Text>
              </View>
            ))}

            <View style={styles.tipPreviewCustomPill}>
              <Text style={styles.tipPreviewCustomText}>
                {t.editprofile.custom}
              </Text>
            </View>
          </View>
          <Text style={styles.label}>{t.editprofile.profileLink}</Text>
          <View style={styles.slugRow}>
            <Text style={styles.slugPrefix}>getthankly.com/</Text>
            <TextInput
              value={profileSlug}
              onChangeText={setProfileSlug}
              autoCapitalize="none"
              placeholder="maria-g"
              style={styles.slugInput}
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.primaryText}>
              {saving ? t.editprofile.saving : t.editprofile.saveProfile}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryText}>{t.editprofile.cancel}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  content: { padding: 20, paddingBottom: 120 },

  changePhotoButton: {
    marginTop: -18,
    marginBottom: 18,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  changePhotoText: {
    color: "#0f4c81",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 0,
  },

  card: {
    marginTop: -5,
    backgroundColor: "white",
    borderRadius: 28,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },

  label: {
    marginTop: 8,
    marginBottom: 8,
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800",
    textAlignVertical: "top",

  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    padding: 10,
    fontSize: 16,
    color: "#0f172a",
  },

  textarea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
    textareaspa: {
    minHeight: 30,
    textAlignVertical: "top",
  },

  slugRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    overflow: "hidden",
  },

  slugPrefix: {
    paddingLeft: 14,
    color: "#64748b",
    fontWeight: "700",
  },

  slugInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#0f172a",
  },
  helperText: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 10,
  },

  tipRow: {
    flexDirection: "row",
    gap: 10,
  },

  tipInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    paddingHorizontal: 12,
  },

  tipPrefix: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "900",
    marginRight: 4,
  },

  tipInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "800",
  },

  tipPreviewLabel: {
    marginTop: 14,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 19,
    fontStyle: "italic",
  },

  tipPreviewRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: 8,
    paddingBottom: 14
  },

  tipPreviewPill: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  tipPreviewText: {
    color: "#0f4c81",
    fontSize: 14,
    fontWeight: "900",
  },

  tipPreviewCustomPill: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  tipPreviewCustomText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "900",
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: "#0284c7",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
  },

  primaryText: { color: "white", fontSize: 17, fontWeight: "900" },

  secondaryButton: {
    marginTop: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
  },

  secondaryText: { color: "#0f172a", fontSize: 16, fontWeight: "800" },
});