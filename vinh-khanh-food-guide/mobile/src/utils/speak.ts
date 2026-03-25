import { Platform } from "react-native";
import * as Speech from "expo-speech";
import { voiceMap, Lang } from "../i18n/translations";
const BASE_URL = "http://192.168.66.14:8080"; 

export const speakText = async (
  text: string,
  lang: Lang,
  onEnd?: () => void
) => {
  if (!text) return;

  const langCode = voiceMap[lang];

  if (Platform.OS === "web") {
    try {
      const res = await fetch(`http://192.168.66.14:8080/api/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",       
        },
        body: JSON.stringify({ text, lang: langCode }),
      });

      if (!res.ok) throw new Error("API lỗi");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);

      audio.onended = () => onEnd && onEnd();

      await audio.play();
    } catch (e) {
      console.error("TTS API error:", e);

      // 🔥 fallback về web speech
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = langCode;
      window.speechSynthesis.speak(msg);
    }

    return;
  }

  Speech.stop();
  Speech.speak(text, {
    language: langCode,
    rate: 0.9,
    onDone: () => onEnd && onEnd(),
  });
};