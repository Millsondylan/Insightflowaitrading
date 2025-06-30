import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select';
import { supabase } from '@/lib/db/supabase-client';
import { useAuth } from '@/hooks/use-auth';
import i18n from '@/i18n';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSelector() {
  const { t } = useTranslation('common');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language || 'en');
  const { user } = useAuth();

  // Set up language on first load
  useEffect(() => {
    setSelectedLanguage(i18n.language || 'en');
  }, []);

  // Save language preference to Supabase when user changes language
  const saveLanguagePreference = async (lang: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({ 
            user_id: user.id, 
            language: lang,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving language preference:', error);
        }
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }
  };

  // Handle language change
  const changeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    document.documentElement.lang = lang;
    saveLanguagePreference(lang);
    i18n.changeLanguage(lang);
  };

  const getCurrentLanguage = (): Language => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  return (
    <Select value={selectedLanguage} onValueChange={changeLanguage}/>
      <SelectTrigger className="w-fit min-w-[100px] bg-transparent border-white/10 hover:bg-white/5"/>
        <SelectValue>
          <div className="flex items-center space-x-2">
            <span>{getCurrentLanguage().flag}</Select>
            <span className="hidden md:inline">{getCurrentLanguage().code.toUpperCase()}</span>
          </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}/>
              <div className="flex items-center space-x-2">
                <span>{language.flag}</SelectContent>
                <span>{language.name}</span>
              </div>
          ))}
        </SelectGroup>
    </Select>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 