import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const supabaseUrl = "https://gqkbiqibyzdhzijkxbkk.supabase.co";
const supabaseAnonKey = "sb_publishable_kBCzIqfbCSZ5Z8qxIBIwYA__gZ7FwVc";

// Persist the Supabase auth session in encrypted SecureStore so it survives
// a full app close (otherwise the session lives only in memory and the user is
// logged out on every cold start).
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === "web" ? undefined : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});