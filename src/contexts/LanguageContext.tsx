import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { Language, getTranslation, Translations } from '../utils/i18n'

interface LanguageContextType {
  language: Language
  translations: Translations
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language
    return saved === 'en' || saved === 'zh' ? saved : 'zh'
  })

  const translations = useMemo(() => getTranslation(language), [language])

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'))
  }

  const setLang = (lang: Language) => {
    setLanguage(lang)
  }

  const t = useCallback((key: string) => {
    // 直接从 language 获取翻译，确保使用最新的
    const currentTranslations = getTranslation(language)
    if (!currentTranslations) return key
    
    const keys = key.split('.')
    let value: any = currentTranslations
    
    for (const k of keys) {
      if (value == null || typeof value !== 'object') {
        return key
      }
      value = value[k]
    }
    
    // 检查最终值
    if (typeof value === 'string') {
      return value
    }
    
    return key
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        translations,
        toggleLanguage,
        setLanguage: setLang,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}
