import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/lib/db/supabase-client';

// Import translation files
import enTranslation from './locales/en/translation';
import esTranslation from './locales/es/translation';
import frTranslation from './locales/fr/translation';
import deTranslation from './locales/de/translation';
import zhTranslation from './locales/zh/translation';
import jaTranslation from './locales/ja/translation';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  de: { translation: deTranslation },
  zh: { translation: zhTranslation },
  ja: { translation: jaTranslation }
};

// Update user's language preference in database
export const updateUserLanguagePreference = async (userId: string, language: string) => {
  if (!userId) return;
  
  const { error } = await supabase
    .from('user_preferences')
    .upsert({ 
      user_id: userId,
      language: language
    }, { 
      onConflict: 'user_id' 
    });
    
  if (error) {
    console.error('Error updating language preference:', error);
  }
};

// Get user's language preference from database
export const getUserLanguagePreference = async (userId: string): Promise<string | null> => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('language')
    .eq('user_id', userId)
    .single();
    
  if (error || !data) {
    return null;
  }
  
  return data.language;
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n; 