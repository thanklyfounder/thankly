import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";


type CompactHeaderProps = {
  title: string;
  subtitle?: string;
  statusText?: string;
  statusType?: "success" | "warning";
  avatarUrl?: string | null;
  fallbackInitial?: string;
  showAvatar?: boolean;
};


export default function CompactHeader({
  title,
  subtitle,
  statusText,
  statusType = "success",
  avatarUrl,
  fallbackInitial = "T",
  showAvatar = true,
}: CompactHeaderProps) {
  const isSuccess = statusType === "success";


  return (
    <LinearGradient
      colors={["#1b5a96", "#0f3f73"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >

      {showAvatar ? (
        <View style={styles.headerAvatarCircle}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
          ) : (
            <Text style={styles.headerAvatarInitial}>{fallbackInitial}</Text>
          )}
        </View>
      ) : null}


      <View style={styles.contentBlock}>
        <Text style={styles.title}>{title}</Text>


        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}


        {statusText ? (
          <View style={isSuccess ? styles.successBadge : styles.warningBadge}>
            <Text style={isSuccess ? styles.successText : styles.warningText}>
              {statusText}
            </Text>
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  header: {
    marginHorizontal: -20,
    marginTop: -20,
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    alignItems: "center",
  },


  brand: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },


  headerAvatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 10,
    overflow: "hidden",
  },


  headerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },


  headerAvatarInitial: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },


  contentBlock: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },


  title: {
    marginTop: 0,
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },


  subtitle: {
    marginTop: 0,
    marginBottom: 8,
    color: "#dbeafe",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },


  successBadge: {
    marginTop: 10,
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
    marginTop: 10,
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

