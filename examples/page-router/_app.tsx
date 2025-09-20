// Example: _app.tsx for Page Router
// pages/_app.tsx

import type { AppProps } from 'next/app'
import { ThemeProvider, LanguageProvider } from 'jovjrx-pagebuilder'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme="dark-purple">
      <LanguageProvider
        availableLanguages={['pt-BR', 'en', 'es']}
        persistLanguage={true}
        detectLanguage={true}
      >
        <Component {...pageProps} />
      </LanguageProvider>
    </ThemeProvider>
  )
}
