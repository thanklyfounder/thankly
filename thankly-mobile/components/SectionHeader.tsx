import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet, Text, View } from "react-native";


type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  statusText?: string;
  statusType?: "success" | "warning";
};

const isAndroid = Platform.OS === "android";
export default function SectionHeader({
  title,
  subtitle,
  statusText,
  statusType = "success",
}: SectionHeaderProps) {
  const isSuccess = statusType === "success";


  return (
    <LinearGradient
      colors={["#1b5a96", "#0f3f73"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <Text style={styles.title}>{title}</Text>


      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}


      {statusText ? (
        <View style={isSuccess ? styles.successBadge : styles.warningBadge}>
          <Text style={isSuccess ? styles.successText : styles.warningText}>
            {statusText}
          </Text>
        </View>
      ) : null}
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  header: {
    marginHorizontal: -20,
    marginTop: -20,
    paddingTop: isAndroid? 40 : 42,
    paddingBottom: isAndroid? 18 : 25,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    alignItems: "center",
  },


  title: {
    marginTop: 0,
    color: "white",
    fontSize: isAndroid? 26 : 28,
    fontWeight: "700",
    textAlign: "center",
  },


  subtitle: {
    marginTop: 8,
    color: "#dbeafe",
    textAlign: "center",
    fontSize: isAndroid? 12 : 14,
    lineHeight: 20,
  },


  successBadge: {
    marginTop: 12,
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },


  successText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "900",
  },


  warningBadge: {
    marginTop: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },


  warningText: {
    color: "#92400e",
    fontSize: 12,
    fontWeight: "900",
  },
});
