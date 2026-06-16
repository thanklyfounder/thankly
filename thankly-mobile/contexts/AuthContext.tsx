import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";
import { registerForPushNotificationsAsync } from "../services/notificationService";
import { 
    createWorkerProfileIfMissing,
    updateWorkerPushToken, 
} from "../services/workerService";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function savePushTokenForUser(nextSession: Session | null) {
    const authUserId = nextSession?.user?.id;
    const email = nextSession?.user?.email;

    if (!authUserId || !email) return;

    try {
      await createWorkerProfileIfMissing(authUserId, email);

      const token = await registerForPushNotificationsAsync();

      if (!token) return;

      await updateWorkerPushToken(authUserId, token);

      console.log("Push token saved to worker profile.");
    } catch (error) {
      console.error("Unable to prepare worker profile:", error);
    }
}


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      savePushTokenForUser(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      savePushTokenForUser(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
