/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ru', 'pt', 'ar'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  localePath: './src/i18n/locales',
  react: {
    useSuspense: false,
  },
  detection: {
    order: ['cookie', 'localStorage', 'navigator', 'path'],
    caches: ['cookie', 'localStorage'],
  }
} 