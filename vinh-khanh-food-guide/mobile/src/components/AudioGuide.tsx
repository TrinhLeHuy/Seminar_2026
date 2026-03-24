import * as Speech from 'expo-speech';

export type AudioLang = 'vi' | 'en';

const LANG_MAP = {
  vi: 'vi-VN',
  en: 'en-US',
};

export function playGuide(text: string, lang: AudioLang) {
  Speech.stop();
  Speech.speak(text, {
    language: LANG_MAP[lang],
    rate: 0.9,
  });
}

export function stopGuide() {
  Speech.stop();
}