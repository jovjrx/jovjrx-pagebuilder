// Core Types for JovJrx PageBuilder
export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export interface PageBuilderTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export interface MultiLanguageContent {
  [languageCode: string]: string
}

export interface MediaContent {
  kind: 'image' | 'video' | 'youtube' | 'vimeo'
  url: string
  alt?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

export interface ActionContent {
  text: MultiLanguageContent
  url: string
  action: 'link' | 'buy' | 'download' | 'contact' | 'more_info'
  style: 'primary' | 'secondary' | 'outline' | 'ghost'
  price?: {
    amount: number
    currency: string
    original?: number
  }
}

export interface TextContent {
  type: 'text'
  variant: 'heading' | 'subtitle' | 'paragraph' | 'caption' | 'kpi'
  value: MultiLanguageContent
  order: number
}

export interface MediaContentBlock {
  type: 'media'
  media: MediaContent
  order: number
}

export interface ListContent {
  type: 'list'
  role: 'feature' | 'testimonial' | 'faq' | 'plan' | 'benefit'
  items: ListItem[]
  order: number
}

export interface ActionsContent {
  type: 'actions'
  primary: ActionContent
  secondary?: ActionContent
  benefits?: MultiLanguageContent[]
  urgency?: {
    type: 'limited_time' | 'limited_quantity' | 'flash_sale'
    message: MultiLanguageContent
    endDate?: string
    quantity?: number
  }
  order: number
}

export interface TimerContent {
  type: 'timer'
  endDate: string
  title: MultiLanguageContent
  subtitle?: MultiLanguageContent
  style: 'countdown' | 'progress' | 'circular'
  order: number
}

export type Content = TextContent | MediaContentBlock | ListContent | ActionsContent | TimerContent

export interface ListItem {
  id?: string
  role: 'feature' | 'testimonial' | 'faq' | 'plan' | 'benefit'
  title: MultiLanguageContent
  subtitle?: MultiLanguageContent
  text?: MultiLanguageContent
  media?: MediaContent
  rating?: number
  price?: {
    amount: number
    currency: string
    original?: number
  }
  features?: MultiLanguageContent[]
  highlighted?: boolean
  popular?: boolean
  tags?: string[]
  stat?: {
    value: string
    color: string
  }
  qa?: {
    q: MultiLanguageContent
    a: MultiLanguageContent
  }
  cta?: ActionContent
  meta?: Record<string, any>
}

export interface BlockLayout {
  variant: 'stack' | 'split' | 'grid' | 'carousel'
  columns?: number
  align: 'start' | 'center' | 'end'
  spacing?: 'tight' | 'normal' | 'loose'
}

export interface BlockTheme {
  background?: string
  text?: string
  accent?: string
  border?: string
  shadow?: string
}

export interface Block {
  id?: string
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'stats' | 'text' | 'media' | 'list' | 'actions' | 'timer'
  kind: 'section' | 'component'
  title: MultiLanguageContent
  subtitle?: MultiLanguageContent
  description?: MultiLanguageContent
  content: Content[]
  layout?: BlockLayout
  theme?: BlockTheme
  order: number
  active: boolean
  version: 'draft' | 'published'
  parentId?: string // For blocks-only mode
  created_at?: any
  updated_at?: any
}

export interface Page {
  id?: string
  title: MultiLanguageContent
  slug: string
  description?: MultiLanguageContent
  blocks: Block[]
  settings: {
    seo?: {
      title?: MultiLanguageContent
      description?: MultiLanguageContent
      keywords?: string[]
      ogImage?: string
    }
    theme?: string
    language?: string
    status: 'draft' | 'published' | 'archived'
  }
  created_at?: any
  updated_at?: any
}

export interface PageBuilderConfig {
  firebaseConfig: FirebaseConfig
  theme?: string | PageBuilderTheme
  language?: string
  availableLanguages?: string[]
  collection?: string
  onSave?: (page: Page) => void
  onError?: (error: Error) => void
  onLanguageChange?: (language: string) => void
}

export interface PageRendererConfig {
  firebaseConfig: FirebaseConfig
  theme?: string | PageBuilderTheme
  language?: string
  mode?: 'light' | 'dark' | 'auto'
  collection?: string
  onLoad?: (page: Page) => void
  onError?: (error: Error) => void
}

// Blocks-only mode configuration
export interface BlocksEditorConfig {
  parentId: string
  firebaseConfig: FirebaseConfig
  theme?: string | PageBuilderTheme
  language?: string
  availableLanguages?: string[]
  collection?: string
  onBlocksChange?: (blocks: Block[]) => void
  onSave?: (blocks: Block[]) => void
  onError?: (error: Error) => void
  onLanguageChange?: (language: string) => void
  // Customization options
  hideHeader?: boolean
  hideSaveButton?: boolean
  hidePreviewButton?: boolean
  hideLanguageSelector?: boolean
  autoSave?: boolean
  customActions?: React.ReactNode
  saveButtonText?: string
  saveButtonColor?: string
}

export interface BlocksRendererConfig {
  parentId: string
  firebaseConfig: FirebaseConfig
  theme?: string | PageBuilderTheme
  language?: string
  mode?: 'light' | 'dark' | 'auto'
  collection?: string
  data?: Block[] // Dados pré-carregados (SSR/SSG)
  widthContainer?: string // Largura máxima do container
  onLoad?: (blocks: Block[]) => void
  onError?: (error: Error) => void
  onPurchase?: (productId: string, productData: any) => void | Promise<void>
  onAddToCart?: (productId: string, productData: any) => void | Promise<void>
}

export interface PurchaseButtonConfig {
  // Produto info
  productId: string
  productName: string
  price: {
    amount: number
    currency: string
    original?: number
  }
  
  // Visual options
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  colorScheme?: string
  text?: string
  showPrice?: boolean
  showDiscount?: boolean
  
  // States
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
  
  // Callbacks
  onPurchase?: (productId: string, productData: any) => void | Promise<void>
  onAddToCart?: (productId: string, productData: any) => void | Promise<void>
  onError?: (error: Error) => void
  
  // Props extras
  className?: string
  buttonProps?: any
  children?: React.ReactNode
}
