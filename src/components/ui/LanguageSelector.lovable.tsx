import { useState } from 'react';
import { useUserPreferences } from '../../hooks/use-user-preferences';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export default function LanguageSelector() {
  const { preferences, changeLanguage } = useUserPreferences();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === preferences.language) || languages[0];

  return (
    <Div className="relative">
      <Button
        onClick={() =></Div> setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Span className="text-lg" aria-hidden="true">{currentLanguage.flag}</Span>
        <Span className="hidden md:inline text-sm font-medium">{currentLanguage.name}</Span>
      </Button>

      {isOpen && (
        <Div className="absolute z-10 right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
          role="menu"
          aria-orientation="vertical"
      >
          <Div className="py-1" role="none">
            {languages.map((language) => (
              <Button
                key={language.code}
                onClick={() =></Div> handleLanguageChange(language.code)}
                className={`
                  w-full text-left px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900 flex items-center gap-3 transition-colors
                  ${language.code === preferences.language ? 'bg-blue-100 dark:bg-blue-800 font-medium' : ''}
                `}
                role="menuitem"
              >
                <Span className="text-lg" aria-hidden="true">{language.flag}</Span>
                {language.name}
              </Button>
            ))}
          </Div>
        </Div>
      )}
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 