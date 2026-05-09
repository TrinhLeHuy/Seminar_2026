import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLanguage } from "../i18n/LanguageContext";
import { Lang } from "../i18n/translations";

const langs: { code: Lang; label: string }[] = [
  { code: "vi", label: "🇻🇳 Tiếng Việt" },
  { code: "en", label: "🇺🇸 English" },
  { code: "ja", label: "🇯🇵 Japanese" },
  // { code: "ko", label: "🇰🇷 Korean" },
  // { code: "fr", label: "🇫🇷 French" },
  { code: "zh", label: "🇨🇳 中文" },
  { code: "th", label: "🇹🇭 ไทย" },
];

const LanguageScreen: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <View style={styles.container}>
      {langs.map((l) => (
        <TouchableOpacity
          key={l.code}
          onPress={() => setLang(l.code)}
        >
          <Text
            style={[
              styles.item,
              lang === l.code && styles.active,
            ]}
          >
            {l.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
  },
  item: {
    padding: 16,
    fontSize: 16,
    color: "#333", // Ensure text is visible in light/dark mode
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  active: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
});