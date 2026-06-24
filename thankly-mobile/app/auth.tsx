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

  async function forgotPassword() {
    if (!email.trim()) {
      Alert.alert("Enter your email", "Type your email address above, then tap Forgot Password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: "thanklymobile://reset-password",
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Check your email", "A password reset link has been sent to " + email.trim() + ".");
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
            style={styles.forgotPassword}
            onPress={forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

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
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },

  headerLogo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  formSection: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
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
    marginTop: 18,
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    fontSize: 13,
  },

  input: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0f172a"
  },

  button: {
    marginTop: 16,
    backgroundColor: "#0284c7",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
  },

  secondaryButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#0284c7",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#0284c7",
    fontWeight: "700",
    fontSize: 15,
  },
  forgotPassword: {
    marginTop: 10,
    alignSelf: "flex-end",
  },

  forgotPasswordText: {
    color: "#0284c7",
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
  },
});
