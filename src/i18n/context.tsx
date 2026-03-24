import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Language, Translations } from './types';
import { ja } from './ja';
import { en } from './en';

const STORAGE_KEY = 'classi-lang';
const DICT: Record<Language, Translations> = { ja, en };

type LanguageContextValue = {
  lang: Language;
  t: Translations;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ja',
  t: ja,
  toggle: () => { /* noop */ },
});

export function LanguageProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ja';
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'ja';
  });

  const toggle = useCallback((): void => {
    setLang((prev) => {
      const next: Language = prev === 'ja' ? 'en' : 'ja';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Sync <html lang=""> attribute
  useEffect((): void => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t: DICT[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  return useContext(LanguageContext);
}
