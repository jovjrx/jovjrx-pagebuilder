'use client'

import { useState, useCallback, useEffect } from 'react'
import { MultiLanguageContent } from '../types'
import { 
  getMultiLanguageValue, 
  updateMultiLanguageContent, 
  createMultiLanguageContent,
  isLanguageSupported,
  supportedLanguages 
} from '../i18n'

export interface UseLanguageReturn {
  currentLanguage: string
  availableLanguages: string[]
  setLanguage: (language: string) => void
  getValue: (content: MultiLanguageContent) => string
  updateValue: (content: MultiLanguageContent, value: string) => MultiLanguageContent
  createValue: (value: string) => MultiLanguageContent
  isSupported: (language: string) => boolean
  getLanguageName: (language: string) => string
}

export function useLanguage(
  initialLanguage: string = 'pt-BR',
  availableLanguages: string[] = ['pt-BR', 'en', 'es']
): UseLanguageReturn {
  // Validate initial language
  const validInitialLanguage = isLanguageSupported(initialLanguage) ? initialLanguage : 'pt-BR'
  
  // State
  const [currentLanguage, setCurrentLanguage] = useState(validInitialLanguage)

  // Validate available languages
  const validAvailableLanguages = availableLanguages.filter(isLanguageSupported)
  if (validAvailableLanguages.length === 0) {
    validAvailableLanguages.push('pt-BR')
  }

  // Ensure current language is in available languages
  useEffect(() => {
    if (!validAvailableLanguages.includes(currentLanguage)) {
      setCurrentLanguage(validAvailableLanguages[0])
    }
  }, [currentLanguage, validAvailableLanguages])

  // Set language with validation
  const setLanguage = useCallback((language: string) => {
    if (isLanguageSupported(language) && validAvailableLanguages.includes(language)) {
      setCurrentLanguage(language)
    } else {
      console.warn(`Language ${language} is not supported or not available`)
    }
  }, [validAvailableLanguages])

  // Get value for current language
  const getValue = useCallback((content: MultiLanguageContent): string => {
    return getMultiLanguageValue(content, currentLanguage)
  }, [currentLanguage])

  // Update value for current language
  const updateValue = useCallback((
    content: MultiLanguageContent, 
    value: string
  ): MultiLanguageContent => {
    return updateMultiLanguageContent(content, value, currentLanguage)
  }, [currentLanguage])

  // Create value for current language
  const createValue = useCallback((value: string): MultiLanguageContent => {
    return createMultiLanguageContent(value, currentLanguage)
  }, [currentLanguage])

  // Get language display name
  const getLanguageName = useCallback((language: string): string => {
    return supportedLanguages[language as keyof typeof supportedLanguages] || language
  }, [])

  return {
    currentLanguage,
    availableLanguages: validAvailableLanguages,
    setLanguage,
    getValue,
    updateValue,
    createValue,
    isSupported: isLanguageSupported,
    getLanguageName,
  }
}

// Hook for managing language persistence
export function useLanguagePersistence(
  storageKey: string = 'jovjrx-pagebuilder-language'
) {
  const [persistedLanguage, setPersistedLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(storageKey) || 'pt-BR'
    }
    return 'pt-BR'
  })

  const updatePersistedLanguage = useCallback((language: string) => {
    setPersistedLanguage(language)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, language)
    }
  }, [storageKey])

  return {
    persistedLanguage,
    updatePersistedLanguage,
  }
}

// Hook for language detection
export function useLanguageDetection() {
  const detectBrowserLanguage = useCallback((): string => {
    if (typeof window === 'undefined') return 'pt-BR'

    const browserLang = navigator.language || navigator.languages?.[0] || 'pt-BR'
    
    // Map browser language to supported languages
    if (browserLang.startsWith('pt')) return 'pt-BR'
    if (browserLang.startsWith('en')) return 'en'
    if (browserLang.startsWith('es')) return 'es'
    if (browserLang.startsWith('fr')) return 'fr'
    if (browserLang.startsWith('de')) return 'de'
    if (browserLang.startsWith('it')) return 'it'
    
    return 'pt-BR' // Default fallback
  }, [])

  const detectUrlLanguage = useCallback((): string | null => {
    if (typeof window === 'undefined') return null

    const urlParams = new URLSearchParams(window.location.search)
    const langParam = urlParams.get('lang') || urlParams.get('language')
    
    if (langParam && isLanguageSupported(langParam)) {
      return langParam
    }

    // Check if language is in the path (e.g., /en/page, /pt-BR/page)
    const pathSegments = window.location.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0]
      if (isLanguageSupported(firstSegment)) {
        return firstSegment
      }
    }

    return null
  }, [])

  return {
    detectBrowserLanguage,
    detectUrlLanguage,
  }
}
