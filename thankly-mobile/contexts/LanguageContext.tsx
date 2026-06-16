import React, { createContext, useContext, useMemo, useState } from "react";
import {
  thanklyText,
  ThanklyLanguage,
} from "@/translations/thanklyText";

type LanguageContextValue = {
  language: ThanklyLanguage;
  setLanguage: (language: ThanklyLanguage) => void;
  t: typeof thanklyText.en;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<ThanklyLanguage>("en");

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: thanklyText[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}