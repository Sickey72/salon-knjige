import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, getTranslations } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Учитај језик из localStorage или користи подразумевани (ћирилица)
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'sr-Cyrl';
  });

  const [t, setT] = useState<Translations>(() => getTranslations(language));

  useEffect(() => {
    // Сачувај језик у localStorage
    localStorage.setItem('language', language);
    // Ажурирај преводе
    setT(getTranslations(language));
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
