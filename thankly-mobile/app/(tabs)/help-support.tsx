import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const isAndroid = Platform.OS === "android";
export default function HelpSupportScreen() {
  const { t } = useLanguage();
  async function emailSupport() {
    const url =
      "mailto:support@getthankly.com?subject=Thankly Support Request";

    const canOpen = await Linking.canOpenURL(url);
    
    if (!canOpen) {
      Alert.alert("Unable to open email", "Please email support@getthankly.com.");
      return;
    }

    await Linking.openURL(url);
  }

  async function openSupportPage() {
  await Linking.openURL('https://getthankly.com/support')
  }
  async function emailBilling() {
    await Linking.openURL(
      "mailto:billing@getthankly.com?subject=Thankly Billing Question"
    );
  }

  async function emailLegal() {
    await Linking.openURL(
      "mailto:legal@getthankly.com?subject=Thankly Legal Question"
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          title={t.helpsupport.helpSupport}
          subtitle={t.helpsupport.helpSupportSub}
        />

        <View style={styles.card}>
          <Text style={styles.title}>{t.helpsupport.contactThankly}</Text>

          <SupportRow
            title={t.helpsupport.generalSupport}
            subtitle={t.helpsupport.generalSupportSub}
            onPress={emailSupport}
          />

          <SupportRow
            title={t.helpsupport.billingPayouts}
            subtitle={t.helpsupport.billingPayoutsSub}
            onPress={emailBilling}
          />

          <SupportRow
            title={t.helpsupport.legalCompliance}
            subtitle={t.helpsupport.legalComplianceSub}
            onPress={emailLegal}
          />
        </View>

        <TouchableOpacity style={styles.webSupportButton} onPress={openSupportPage}>
          <Text style={styles.webSupportText}>{t.helpsupport.supportwebpage} →</Text>
        </TouchableOpacity>
        
        <View style={styles.card}>
          <Text style={styles.title}>{t.helpsupport.faq}</Text>

          <FAQ
            question={t.helpsupport.faqTaxesQuestion}
            answer={t.helpsupport.faqTaxesAnswer}
          />

          <FAQ
            question={t.helpsupport.faqBankQuestion}
            answer={t.helpsupport.faqBankAnswer}
          />

          <FAQ
            question={t.helpsupport.faqProfileQuestion}
            answer={t.helpsupport.faqProfileAnswer}
          />
          <FAQ
            question={t.helpsupport.faqTaxPocketQuestion}
            answer={t.helpsupport.faqTaxPocketAnswer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SupportRow({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <View style={styles.faqBlock}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.answer}>{answer}</Text>
    </View>
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
    paddingTop: 10,
    paddingBottom: isAndroid? 2 : 5,
  },

  title: {
    color: "#0f172a",
    fontSize: isAndroid? 15 : 16,
    fontWeight: "700",
    marginBottom: 0,
  },

  subtitle: {
    fontSize: isAndroid? 10 : 8,
  },

  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  rowText: { flex: 1 },

  rowTitle: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },

  rowSubtitle: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
  },

  chevron: {
    color: "#94a3b8",
    fontSize: 34,
    fontWeight: "300",
  },

  faqBlock: {
    marginTop: 12,
  },

  question: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
  },

  answer: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 19,
  },
  webSupportButton: {
    marginTop: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  webSupportText: {
    color: '#1B3A6B',
    fontWeight: '700',
    fontSize: isAndroid ? 13 : 14,
  },
});