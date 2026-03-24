/**
 * ✅ 1. BASE TYPE (KHÔNG DÙNG LITERAL)
 */
export type Translation = {
  app_title: string;
  app_subtitle: string;
  home: string;
  map: string;
  lang: string;
  category: string;
};

/**
 * ✅ 2. TRANSLATIONS (TYPE SAFE)
 */
export const translations = {
  vi: {
    app_title: "Phố Ẩm Thực Vĩnh Khánh",
    app_subtitle: "Khám phá ẩm thực Việt Nam",
    home: "Trang chủ",
    map: "Bản đồ",
    lang: "Ngôn ngữ",
    category: "Danh mục",
  },

  en: {
    app_title: "Vinh Khanh Food Street",
    app_subtitle: "Discover Vietnamese Cuisine",
    home: "Home",
    map: "Map",
    lang: "Language",
    category: "Categories",
  },

  ja: {
    app_title: "ヴィンカインフードストリート",
    app_subtitle: "ベトナム料理を発見",
    home: "ホーム",
    map: "地図",
    lang: "言語",
    category: "カテゴリ",
  },

  // ko: {
  //   app_title: "빈칸 음식 거리",
  //   app_subtitle: "베트남 요리 탐험",
  //   home: "홈",
  //   map: "지도",
  //   lang: "언어",
  //   category: "카테고리",
  // },

  // fr: {
  //   app_title: "Rue Gastronomique Vinh Khanh",
  //   app_subtitle: "Découvrez la cuisine vietnamienne",
  //   home: "Accueil",
  //   map: "Carte",
  //   lang: "Langue",
  //   category: "Catégories",
  // },

  zh: {
    app_title: "永庆美食街",
    app_subtitle: "探索越南美食",
    home: "首页",
    map: "地图",
    lang: "语言",
    category: "类别",
  },

  th: {
    app_title: "ถนนอาหารวิงห์คั้ญ",
    app_subtitle: "ค้นพบอาหารเวียดนาม",
    home: "หน้าหลัก",
    map: "แผนที่",
    lang: "ภาษา",
    category: "หมวดหมู่",
  },
} satisfies Record<string, Translation>;

/**
 * ✅ 3. AUTO TYPE LANGUAGE
 */
export type Lang = keyof typeof translations;

/**
 * ✅ 4. TTS VOICE MAP
 */
export const voiceMap: Record<Lang, string> = {
  vi: "vi-VN",
  en: "en-US",
  ja: "ja-JP",
  // ko: "ko-KR",
  // fr: "fr-FR",
  zh: "zh-CN",
  th: "th-TH",
};