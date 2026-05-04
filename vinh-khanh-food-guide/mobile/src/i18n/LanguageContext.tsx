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
  undefined,
);

/**
 * ✅ PROVIDER
 */
// export const LanguageProvider: React.FC<{
//   children: React.ReactNode;
// }> = ({ children }) => {
//   const [lang, setLang] = useState<Lang>("vi");

//   return (
//     <LanguageContext.Provider
//       value={{
//         lang,
//         setLang,
//         t: translations[lang],
//       }}
//     >
//       {children}
//     </LanguageContext.Provider>
//   );
// };
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const normalizeLang = (lang: string): Lang => {
    if (!lang) return "en";

    const short = lang.split("-")[0].toLowerCase();

    if (["vi", "en", "zh", "ja", "th"].includes(short)) {
      return short as Lang;
    }

    return "en";
  };

  const [lang, _setLang] = useState<Lang>("vi");

  const setLang = (l: string) => {
    _setLang(normalizeLang(l));
  };

  const value = React.useMemo(() => {
    return {
      lang,
      setLang,
      t: translations[lang] ?? translations.vi,
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
/**
 * ✅ CUSTOM HOOK
 */
// export const useLanguage = (): LanguageContextType => {
//   const context = useContext(LanguageContext);

// if (!context) {
//   throw new Error("useLanguage must be used within LanguageProvider");
// }

//   return context;
// };
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (!context) {
    // ✅ KHÔNG CRASH APP
    return {
      lang: "vi",
      setLang: () => {},
      t: translations.vi,
    };
  }

  return context;
};
