import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Image } from "react-native";
import { supabase } from "../lib/supabase";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!email || !password) {
      Alert.alert("Missing information", "Enter email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Sign in failed", error.message);
      return;
    }

    router.replace("/");
  }

  async function createAccount() {
    if (!email || !password) {
      Alert.alert("Missing information", "Enter email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Unable to create account", error.message);
      return;
    }

    Alert.alert(
      "Account created",
      "Your Thankly account has been created. You can now sign in."
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.authBrandHeader}>
          <Image
            source={require("../assets/icons/app-iconfade.png")}
            style={styles.headerLogo}
          />
        </View>
        <View style={styles.formSection}>
          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.subtitle}>
            Sign in to view your tips, QR page, payouts, and reports.
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={signIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing in..." : "Sign in"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={createAccount}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Create account</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Your tips. Your records. Your money under your control.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    minHeight: "82%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 36,
    overflow: "hidden",
  },

  authBrandHeader: {
    width: "100%",
    backgroundColor: "#0F4C81",
    height: 245,
    alignItems: "center",
    justifyContent: "center",
  },

  headerLogo: {
    width: 185,
    height: 185,
    resizeMode: "contain",
  },
  formSection: {
    paddingHorizontal: 28,
    paddingTop: 38,
    paddingBottom: 34,
  },
  authAppIcon: {
    width: 170,
    height: 90,
    resizeMode: "contain",
  },

  logo: {
    color: "#0284c7",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  title: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 21,
  },

  input: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    padding: 15,
    fontSize: 16,
    color: "#0f172a"
  },

  button: {
    marginTop: 18,
    backgroundColor: "#0284c7",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },

  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#0284c7",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#0284c7",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
  },
});
