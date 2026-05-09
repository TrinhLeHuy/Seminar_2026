import axios from "axios";

export const translateText = async (text: string, targetLang: string) => {
  if (!text) return text;
  
  // Google Translate uses 'zh-CN' or 'zh-TW', passing 'zh' usually defaults to zh-CN.
  // For other languages like 'ja', 'th', 'vi', 'en', the short codes work fine.
  try {
    const response = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    // The response data is an array where the first element contains the translated chunks.
    const translatedText = response.data[0].map((chunk: any) => chunk[0]).join('');
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text if translation fails
  }
};

export const translateArray = async (items: any[], fieldsToTranslate: string[], targetLang: string) => {
  if (targetLang === "vi") return items; // Assuming database has Vietnamese by default
  
  const translatedItems = await Promise.all(
    items.map(async (item) => {
      const newItem = { ...item };
      for (const field of fieldsToTranslate) {
        if (newItem[field]) {
          newItem[field] = await translateText(newItem[field], targetLang);
        }
      }
      return newItem;
    })
  );
  
  return translatedItems;
};
