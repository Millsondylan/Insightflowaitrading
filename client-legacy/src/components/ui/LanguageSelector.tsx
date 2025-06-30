
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  languages?: Language[];
}

const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const LanguageSelector = ({ 
  currentLanguage, 
  onLanguageChange, 
  languages = defaultLanguages 
}: LanguageSelectorProps) => {
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <Select value={currentLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="flex items-center gap-1">
            <span>{getCurrentLanguage().flag}</span>
            <span>{getCurrentLanguage().name}</span>
          </span>
        </div>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
