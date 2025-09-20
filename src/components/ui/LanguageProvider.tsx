'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useLanguage, useLanguagePersistence, useLanguageDetection, UseLanguageReturn } from '../../hooks/useLanguage'

interface LanguageContextValue extends UseLanguageReturn {
  // Additional context-specific methods can be added here
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  children: React.ReactNode
  initialLanguage?: string
  availableLanguages?: string[]
  persistLanguage?: boolean
  detectLanguage?: boolean
  storageKey?: string
}

export function LanguageProvider({
  children,
  initialLanguage,
  availableLanguages = ['pt-BR', 'en', 'es'],
  persistLanguage = true,
  detectLanguage = true,
  storageKey = 'jovjrx-pagebuilder-language'
}: LanguageProviderProps) {
  // Language detection
  const { detectBrowserLanguage, detectUrlLanguage } = useLanguageDetection()
  
  // Language persistence
  const { persistedLanguage, updatePersistedLanguage } = useLanguagePersistence(
    persistLanguage ? storageKey : undefined
  )

  // Determine initial language
  const getInitialLanguage = (): string => {
    // Priority order:
    // 1. URL parameter (highest priority)
    // 2. Provided initialLanguage
    // 3. Persisted language (if enabled)
    // 4. Browser language detection (if enabled)
    // 5. Default fallback

    if (detectLanguage) {
      const urlLang = detectUrlLanguage()
      if (urlLang && availableLanguages.includes(urlLang)) {
        return urlLang
      }
    }

    if (initialLanguage && availableLanguages.includes(initialLanguage)) {
      return initialLanguage
    }

    if (persistLanguage && persistedLanguage && availableLanguages.includes(persistedLanguage)) {
      return persistedLanguage
    }

    if (detectLanguage) {
      const browserLang = detectBrowserLanguage()
      if (availableLanguages.includes(browserLang)) {
        return browserLang
      }
    }

    return availableLanguages[0] || 'pt-BR'
  }

  // Use language hook
  const languageHook = useLanguage(getInitialLanguage(), availableLanguages)

  // Update persistence when language changes
  useEffect(() => {
    if (persistLanguage) {
      updatePersistedLanguage(languageHook.currentLanguage)
    }
  }, [languageHook.currentLanguage, persistLanguage, updatePersistedLanguage])

  // Context value
  const contextValue: LanguageContextValue = {
    ...languageHook,
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use language context
export function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext)
  
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  
  return context
}

// HOC for components that need language context
export function withLanguage<P extends object>(
  Component: React.ComponentType<P & { language: string }>
) {
  return function LanguageWrappedComponent(props: P) {
    const { currentLanguage } = useLanguageContext()
    
    return <Component {...props} language={currentLanguage} />
  }
}

// Language selector component
interface LanguageSelectorProps {
  variant?: 'select' | 'buttons' | 'menu'
  size?: 'sm' | 'md' | 'lg'
  showFlags?: boolean
  className?: string
}

export function LanguageSelector({
  variant = 'select',
  size = 'md',
  showFlags = false,
  className
}: LanguageSelectorProps) {
  const { currentLanguage, availableLanguages, setLanguage, getLanguageName } = useLanguageContext()

  const flagEmojis: { [key: string]: string } = {
    'pt-BR': '🇧🇷',
    'en': '🇺🇸',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
  }

  if (variant === 'select') {
    return (
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value)}
        className={className}
        style={{
          padding: size === 'sm' ? '4px 8px' : size === 'lg' ? '12px 16px' : '8px 12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          fontSize: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
        }}
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {showFlags && flagEmojis[lang] ? `${flagEmojis[lang]} ` : ''}
            {getLanguageName(lang)}
          </option>
        ))}
      </select>
    )
  }

  if (variant === 'buttons') {
    return (
      <div className={className} style={{ display: 'flex', gap: '8px' }}>
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            style={{
              padding: size === 'sm' ? '4px 8px' : size === 'lg' ? '12px 16px' : '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: currentLanguage === lang ? '#8B5CF6' : 'white',
              color: currentLanguage === lang ? 'white' : 'black',
              fontSize: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
              cursor: 'pointer',
            }}
          >
            {showFlags && flagEmojis[lang] ? `${flagEmojis[lang]} ` : ''}
            {getLanguageName(lang)}
          </button>
        ))}
      </div>
    )
  }

  // Default to select if variant is not recognized
  return null
}
