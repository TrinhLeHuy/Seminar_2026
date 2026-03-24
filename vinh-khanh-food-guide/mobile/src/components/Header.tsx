import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

import { useLanguage } from '../i18n/LanguageContext';

export default function Header() {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.app_title}</Text>
      <Text style={styles.subtitle}>{t.app_subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#fff',
    opacity: 0.9,
  },
});