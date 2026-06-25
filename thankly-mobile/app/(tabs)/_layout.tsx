import { Tabs, Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { Image } from "react-native";
import qrTabIcon from "../../assets/images/thankly-qr-tab-icon.png";


export default function TabLayout() {
  const { session, loading } = useAuth();
  const isAndroid = Platform.OS === "android";
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f1f5f9",
        }}
      >
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#0284c7",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: isAndroid? undefined : 70,
          paddingTop: 4,
          paddingBottom: 24,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size ?? 26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="qr"
        options={{
          title: "My QR",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" size={size ?? 26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="payouts"
        options={{
          title: "Payouts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" size={size ?? 26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size ?? 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financial-preferences"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="edit-profile"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="bank-account"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="notification-preferences"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="security"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="help-support"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="deactivate-account"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
