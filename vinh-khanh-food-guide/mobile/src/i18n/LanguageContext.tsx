import React, { createContext, useContext, useState } from "react";
import { translations, Lang, Translation } from "./translations";

/**
 * ✅ CONTEXT TYPE
 */
type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
};

/**
 * ✅ CREATE CONTEXT
 */
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/**
 * ✅ PROVIDER
 */
export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("vi");

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * ✅ CUSTOM HOOK
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
};
