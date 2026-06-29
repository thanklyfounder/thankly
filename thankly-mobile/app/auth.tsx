import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

const isAndroid = Platform.OS === "android";

type Step = "signin" | "signup_credentials" | "signup_profile" | "verify_email" | "verify_phone";

export default function AuthScreen() {
  const [step, setStep] = useState<Step>("signin");

  // Sign in fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign up fields
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // ─── Sign In ───────────────────────────────────────────────
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

  // ─── Forgot Password ───────────────────────────────────────
  async function forgotPassword() {
    if (!email.trim()) {
      Alert.alert("Enter your email", "Type your email address above, then tap Forgot Password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: "https://getthankly.com/auth/reset-password",
    });
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    Alert.alert("Check your email", "A password reset link has been sent to " + email.trim() + ".");
  }

  // ─── Step 1 → Step 2 ──────────────────────────────────────
  function goToProfileStep() {
    if (!signupEmail.trim() || !signupPassword) {
      Alert.alert("Missing information", "Enter your email and choose a password.");
      return;
    }
    if (signupPassword.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }
    setStep("signup_profile");
  }

  // ─── Step 2 → Create Account ──────────────────────────────
  async function createAccount() {
    if (!fullName.trim()) {
      Alert.alert("Missing information", "Enter your full name.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Missing information", "Enter your phone number.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPassword,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: "https://getthankly.com/auth/confirm",
      },
    });

    if (error) {
      setLoading(false);
      Alert.alert("Unable to create account", error.message);
      return;
    }

    // Send phone OTP
    const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : `+1${phone.trim().replace(/\D/g, "")}`;
    const { error: phoneError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    setLoading(false);

    if (phoneError) {
      // Account created but phone failed — still go to email verify
      setStep("verify_email");
      return;
    }

    setStep("verify_phone");
  }

  // ─── Verify Phone OTP ─────────────────────────────────────
  async function verifyPhone() {
    if (!phoneOtp.trim() || phoneOtp.length !== 6) {
      Alert.alert("Invalid code", "Enter the 6-digit code sent to your phone.");
      return;
    }

    setLoading(true);
    const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : `+1${phone.trim().replace(/\D/g, "")}`;
    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: phoneOtp.trim(),
      type: "sms",
    });
    setLoading(false);

    if (error) {
      Alert.alert("Invalid code", error.message);
      return;
    }

    setStep("verify_email");
  }

  // ─── Resend email ─────────────────────────────────────────
  async function resendEmail() {
    await supabase.auth.resend({ type: "signup", email: signupEmail.trim() });
    Alert.alert("Sent", "Confirmation email resent.");
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.authBrandHeader}>
            <Image
              source={require("../assets/icons/app-iconfade.png")}
              style={styles.headerLogo}
            />
          </View>

          <View style={styles.formSection}>

            {/* ── SIGN IN ── */}
            {step === "signin" && (
              <>
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Sign in to view your tips, QR page, payouts, and reports.</Text>

                <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#94a3b8" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
                <View style={styles.passwordRow}>
                  <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#94a3b8" secureTextEntry={!showPassword} style={styles.passwordInput} />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotPassword} onPress={forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={signIn} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign in"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep("signup_credentials")}>
                  <Text style={styles.secondaryButtonText}>Create account</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── SIGN UP STEP 1: CREDENTIALS ── */}
            {step === "signup_credentials" && (
              <>
                <Text style={styles.title}>Create account</Text>
                <Text style={styles.subtitle}>Step 1 of 2 — Enter your email and choose a password.</Text>

                <TextInput value={signupEmail} onChangeText={setSignupEmail} placeholder="Email address" placeholderTextColor="#94a3b8" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
                <View style={styles.passwordRow}>
                  <TextInput value={signupPassword} onChangeText={setSignupPassword} placeholder="Password (min 8 characters)" placeholderTextColor="#94a3b8" secureTextEntry={!showSignupPassword} style={styles.passwordInput} />
                  <TouchableOpacity onPress={() => setShowSignupPassword(!showSignupPassword)} style={styles.eyeButton}>
                    <Ionicons name={showSignupPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={goToProfileStep}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep("signin")}>
                  <Text style={styles.secondaryButtonText}>Already have an account? Sign in</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── SIGN UP STEP 2: PROFILE ── */}
            {step === "signup_profile" && (
              <>
                <Text style={styles.title}>Your profile</Text>
                <Text style={styles.subtitle}>Step 2 of 2 — Tell us your name and phone number.</Text>

                <TextInput value={fullName} onChangeText={setFullName} placeholder="Full name" placeholderTextColor="#94a3b8" autoCapitalize="words" style={styles.input} />
                <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number (e.g. 4075551234)" placeholderTextColor="#94a3b8" keyboardType="phone-pad" style={styles.input} />

                <TouchableOpacity style={styles.button} onPress={createAccount} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "Creating account..." : "Create account"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep("signup_credentials")}>
                  <Text style={styles.secondaryButtonText}>← Back</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── VERIFY PHONE ── */}
            {step === "verify_phone" && (
              <>
                <Text style={styles.title}>Verify your phone</Text>
                <Text style={styles.subtitle}>We sent a 6-digit code to {phone}. Enter it below.</Text>

                <TextInput value={phoneOtp} onChangeText={setPhoneOtp} placeholder="6-digit code" placeholderTextColor="#94a3b8" keyboardType="number-pad" maxLength={6} style={styles.input} />

                <TouchableOpacity style={styles.button} onPress={verifyPhone} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify phone"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep("verify_email")}>
                  <Text style={styles.secondaryButtonText}>Skip for now</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── VERIFY EMAIL ── */}
            {step === "verify_email" && (
              <>
                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.subtitle}>We sent a confirmation link to {signupEmail}. Tap it to activate your account. If you don't see it, check your spam or junk folder.</Text>

                <View style={styles.emailIconContainer}>
                  <Text style={styles.emailIcon}>📬</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={resendEmail}>
                  <Text style={styles.buttonText}>Resend email</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => { setStep("signin"); setEmail(signupEmail); }}>
                  <Text style={styles.secondaryButtonText}>Back to sign in</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f9",
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
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
    paddingBottom: 32,
  },
  title: {
    marginTop: 8,
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
    marginBottom: 4,
  },
  input: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0f172a",
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
  emailIconContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  emailIcon: {
    fontSize: 64,
  },
  passwordRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  eyeButton: {
    paddingLeft: 8,
    paddingVertical: 12,
  },
});