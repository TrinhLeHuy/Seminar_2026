import * as Speech from 'expo-speech';

type Lang = 'vi' | 'en';

const LANG_MAP = {
  vi: 'vi-VN',
  en: 'en-US',
};

export function playGuide(text: string, lang: Lang = 'vi') {
  Speech.stop();

  Speech.speak(text, {
    language: LANG_MAP[lang],
    rate: 0.9,
    pitch: 1.0,
  });
}

export function stopGuide() {
  Speech.stop();
}