import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';
import { DEFAULT_LANGUAGE } from './locales/i18nConfig';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  zh: { translation: zh }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false }
  });

export default i18n;
