// Example: Providers for App Router
// app/providers.tsx

'use client'

import { ThemeProvider, LanguageProvider } from 'jovjrx-pagebuilder'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme="dark-purple">
      <LanguageProvider
        availableLanguages={['pt-BR', 'en', 'es']}
        persistLanguage={true}
        detectLanguage={true}
      >
        {children}
      </LanguageProvider>
    </ThemeProvider>
  )
}
