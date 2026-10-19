import i18next, { type i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import fr from './locales/fr.json'
import en from './locales/en.json'

export const LANGUAGES = ['es', 'fr', 'en'] as const
export type Language = (typeof LANGUAGES)[number]
export const LANGUAGE_LABELS: Record<Language, string> = {
  es: 'ES',
  fr: 'FR',
  en: 'EN',
}

const resources: Record<Language, { ui: typeof es.ui }> = {
  es,
  fr,
  en,
}

function detectLanguage(): Language {
  const stored = localStorage.getItem('pikito.lang')
  if (stored && (LANGUAGES as readonly string[]).includes(stored)) return stored as Language
  const nav = navigator.language.slice(0, 2).toLowerCase()
  if (nav === 'fr') return 'fr'
  if (nav === 'es' || nav === 'ca' || nav === 'gl' || nav === 'eu') return 'es'
  return 'en'
}

export function initI18n(): I18nInstance {
  void i18next.use(initReactI18next).init({
    lng: detectLanguage(),
    fallbackLng: 'en',
    resources: {
      es: { translation: resources.es },
      fr: { translation: resources.fr },
      en: { translation: resources.en },
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  })
  return i18next
}

export function setLanguage(lang: Language) {
  void i18next.changeLanguage(lang)
  localStorage.setItem('pikito.lang', lang)
  document.documentElement.lang = lang
}
