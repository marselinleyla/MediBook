/* ============================================================
 * i18n.js – Internationalisation configuration (i18next).
 *
 * Supports three languages: English (en), French (fr), and
 * Arabic (ar). Language is detected from cookies, localStorage,
 * or sessionStorage. Translation files are loaded from the
 * /locales/{{lng}}/translation.json path.
 *
 * When the language changes, the <html> element's dir and lang
 * attributes are updated to support RTL (Arabic) layout.
 * ============================================================ */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)           // Load translations via HTTP
  .use(LanguageDetector)  // Auto-detect user language
  .use(initReactI18next)  // Bind i18next to React
  .init({
    supportedLngs: ["en", "fr", "ar"], // Allowed languages
    fallbackLng: "en",                  // Default fallback
    debug: true,
    detection: {
      order: ["cookie", "localStorage", "sessionStorage"], // Detection order
      caches: ["localStorage", "cookie"],                   // Where to persist choice
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to JSON files
    },
    react: {
      useSuspense: false, // Disable Suspense for SSR compatibility
    },
  });

// Update <html> direction (LTR / RTL) and language when user switches locale
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = i18n.dir(lng);
  document.documentElement.lang = lng;
});

// Set initial direction on app boot
document.documentElement.dir = i18n.dir(i18n.language);
document.documentElement.lang = i18n.language || 'en';

export default i18n;
