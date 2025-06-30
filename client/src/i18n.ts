import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
import enCommon from '../public/locales/en/common.json';
import esCommon from '../public/locales/es/common.json';
import frCommon from '../public/locales/fr/common.json';

// Initialize i18next
i18n
  .use(Backend) // Load translations using http (for public/locales folder)
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources: {
      en: {
        common: enCommon
      },
      es: {
        common: esCommon
      },
      fr: {
        common: frCommon
      }
      // Additional languages will be loaded from backend
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ru', 'pt', 'ar'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'path'],
      caches: ['cookie', 'localStorage'],
    },
    react: {
      useSuspense: false // React 18 Suspense is not yet compatible
    }
  });

export default i18n; 