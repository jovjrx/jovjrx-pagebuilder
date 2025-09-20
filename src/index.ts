// Main exports for jovjrx-pagebuilder

// Core Components
export { PageBuilder } from './components/editor/PageBuilder'
export { PageRenderer } from './components/renderer/PageRenderer'
export { BlockRenderer } from './components/renderer/BlockRenderer'

// Editor Components
export { BlocksList } from './components/editor/BlocksList'
export { BlockEditor } from './components/editor/BlockEditor'
export { PageSettings } from './components/editor/PageSettings'

// Block Components
export {
  HeroBlock,
  FeaturesBlock,
  TextBlock,
  MediaBlock,
  ActionsBlock,
} from './components/blocks'

// TODO: Export when implemented
// TestimonialsBlock,
// PricingBlock, 
// FAQBlock,
// StatsBlock,
// ListBlock,
// TimerBlock

// UI Components
export { ThemeProvider, ThemeProviderWithContext, usePageBuilderTheme, useThemeContext } from './components/ui/ThemeProvider'
export { LanguageProvider, LanguageSelector, useLanguageContext, withLanguage } from './components/ui/LanguageProvider'

// Hooks
export { useLanguage, useLanguagePersistence, useLanguageDetection } from './hooks/useLanguage'

// Types
export type {
  FirebaseConfig,
  PageBuilderTheme,
  MultiLanguageContent,
  MediaContent,
  ActionContent,
  TextContent,
  MediaContentBlock,
  ListContent,
  ActionsContent,
  TimerContent,
  Content,
  ListItem,
  BlockLayout,
  BlockTheme,
  Block,
  Page,
  PageBuilderConfig,
  PageRendererConfig,
} from './types'

// Themes
export { darkPurpleTheme, lightPurpleTheme, themes, defaultTheme } from './themes/dark-purple'

// i18n
export {
  supportedLanguages,
  translations,
  getTranslation,
  getMultiLanguageValue,
  createMultiLanguageContent,
  updateMultiLanguageContent,
  isLanguageSupported,
  getLanguageName,
} from './i18n'

// Firebase utilities
export {
  initializeFirebase,
  getFirestoreInstance,
  savePage,
  loadPage,
  deletePage,
  listPages,
  saveBlock,
  loadBlocks,
  deleteBlock,
  serializeFirestoreData,
  generatePageId,
  generateBlockId,
  PageBuilderFirebaseError,
  handleFirebaseError,
} from './firebase'

// Version
export const VERSION = '1.0.0'

// Default configurations
export const DEFAULT_CONFIG = {
  theme: 'dark-purple',
  language: 'pt-BR',
  availableLanguages: ['pt-BR', 'en', 'es'],
  collection: 'pages',
}

// Utility function to create a complete PageBuilder setup
export function createPageBuilder(config: {
  firebaseConfig: any
  theme?: string
  language?: string
  availableLanguages?: string[]
}) {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  }
}
