// import { voiceMap } from "../i18n/translations";
// const mapLang = (lang: string) => {
//   switch (lang) {
//     case "zh":
//       return "zh-CN";
//     case "ko":
//       return "ko-KR";
//     default:
//       return lang;
//   }
// };
// // export const getTTS = async (locationId: number, lang: string) => {
// //   const safeLang = mapLang(lang);
// //   const res = await fetch(
// //     `http://192.168.1.167:8080/api/tts?locationId=${locationId}&lang=${safeLang}`
// //   );

// //   return await res.text();
// // };
// export const getTTS = async (locationId: number, lang: string) => {
//   const safeLang = mapLang(lang);

//   const res = await fetch(
//     `http://192.168.1.167:8080/api/tts/text?locationId=${locationId}&lang=${safeLang}`
//   );

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(err);
//   }

//   return res.text();
// };
// export const getText = async (locationId: number, lang: string) => {
//   const safeLang = mapLang(lang);
//   const res = await fetch(
//     `http://192.168.1.167:8080/api/tts/text?locationId=${locationId}&lang=${safeLang}`
//   );

//   return await res.text();
// };

import { voiceMap } from "../i18n/translations";

/**
 * =========================
 * 🎯 MAP LANG CHUẨN GỬI BACKEND
 * =========================
 */
const mapLang = (lang: string): string => {
  if (!lang) return "en";

  // normalize luôn
  const short = lang.split("-")[0].toLowerCase();

  switch (short) {
    case "vi":
    case "en":
    case "zh":
    case "ko":
    case "ja":
    case "th":
      return short;

    default:
      return "en";
  }
};

/**
 * =========================
 * 🎧 GET TTS AUDIO TEXT/URL
 * =========================
 */
export const getTTS = async (locationId: number, lang: string) => {
  const safeLang = mapLang(lang);

  const res = await fetch(
    `http://172.23.200.167:8080/api/tts?locationId=${locationId}&lang=${safeLang}`
  );

  if (!res.ok) {
    const err = await res.text();

    console.error("❌ TTS ERROR:", {
      locationId,
      lang,
      safeLang,
      status: res.status,
      error: err,
    });

    throw new Error(err);
  }

  return res.text();
};

/**
 * =========================
 * 📝 GET TEXT TRANSLATION
 * =========================
 */
export const getText = async (
  locationId: number,
  lang: string
): Promise<string> => {
  const safeLang = mapLang(lang);

  const res = await fetch(
    `http://172.23.200.167:8080/api/tts/text?locationId=${locationId}&lang=${safeLang}`
  );

  if (!res.ok) {
    const errText = await res.text();

    console.error("❌ TEXT ERROR:", {
      locationId,
      lang,
      safeLang,
      status: res.status,
      error: errText,
    });

    return "...";
  }

  return await res.text();
};