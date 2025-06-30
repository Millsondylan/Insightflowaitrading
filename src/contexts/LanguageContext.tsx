// src/contexts/LanguageContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { getUserLanguagePreference, updateUserLanguagePreference } from '@/i18n/config';

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  availableLanguages: { code: string; name: string }[];
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' }
  ];
  
  // Fetch user's language preference on login
  useEffect(() => {
    const syncUserLanguage = async () => {
      setIsLoading(true);
      
      if (user?.id) {
        const userLang = await getUserLanguagePreference(user.id);
        if (userLang) {
          await i18n.changeLanguage(userLang);
        }
      }
      
      setIsLoading(false);
    };
    
    syncUserLanguage();
  }, [user, i18n]);
  
  // Change language handler
  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    
    if (user?.id) {
      await updateUserLanguagePreference(user.id, lang);
    }
  };
  
  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: i18n.language,
        changeLanguage,
        availableLanguages,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};