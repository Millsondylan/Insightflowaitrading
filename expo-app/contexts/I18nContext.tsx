import React, { createContext, useContext, useState, useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { initReactI18next, useTranslation as useI18nTranslation } from 'react-i18next';
import i18n from 'i18next';

// Define available languages
const LANGUAGES = {
  en: { label: 'English', nativeName: 'English' },
  es: { label: 'Spanish', nativeName: 'Español' },
  fr: { label: 'French', nativeName: 'Français' },
};

// Get device language
const getDeviceLanguage = (): string => {
  // Try to get the language from the device settings
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;
  
  // Extract the language code (e.g., "en-US" -> "en")
  const languageCode = deviceLanguage?.split('-')?.[0] || 'en';
  
  // Check if the language is supported
  return LANGUAGES[languageCode] ? languageCode : 'en';
};

interface I18nContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, options?: object) => string;
  availableLanguages: typeof LANGUAGES;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Initialize i18next
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: {
      common: {
        nav: {
          home: 'Home',
          strategy: 'Strategy',
          journal: 'Journal',
          markets: 'Markets',
          settings: 'Settings',
        },
        // Other common translations
      },
    },
  },
  lng: Localization.locale.split('-')[0], // Default to device language
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(getDeviceLanguage());
  const { t } = useI18nTranslation();
  
  // Load stored language preference
  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedLanguage) {
          setLanguageState(storedLanguage);
          i18n.changeLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };
    
    loadStoredLanguage();
  }, []);
  
  // Save language preference and update i18n
  const setLanguage = async (newLanguage: string) => {
    try {
      await AsyncStorage.setItem('language', newLanguage);
      setLanguageState(newLanguage);
      i18n.changeLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };
  
  return (
    <I18nContext.Provider value={{
      language,
      setLanguage,
      t,
      availableLanguages: LANGUAGES,
    }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}; 