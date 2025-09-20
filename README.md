# 🚀 JovJrx PageBuilder

**Universal Page Builder for Next.js with Firebase** - Dark Purple Theme

A powerful, independent page builder that works with any Next.js project (Page Router or App Router) with Firebase backend. Features multi-language support, conversion-optimized blocks, and a beautiful dark purple theme.

## ✨ Features

- 🎨 **Universal Compatibility** - Works with Page Router and App Router
- 🔥 **Firebase Integration** - Automatic Firestore integration
- 🌍 **Multi-Language Support** - Built-in i18n with 6+ languages
- 🎯 **Conversion Optimized** - Blocks designed for maximum conversion
- 💜 **Dark Purple Theme** - Beautiful default theme with Chakra UI
- 📱 **Mobile-First** - Responsive design out of the box
- ⚡ **Performance** - Optimized for speed and SEO
- 🔧 **TypeScript** - Full type safety
- 🎛️ **Drag & Drop** - Intuitive visual editor
- 🚀 **Plug & Play** - Install and use immediately

## 📦 Installation

```bash
npm install jovjrx-pagebuilder
# or
yarn add jovjrx-pagebuilder
# or
pnpm add jovjrx-pagebuilder
```

### Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom next @chakra-ui/react @emotion/react @emotion/styled framer-motion firebase
```

## 🚀 Quick Start

### 1. Setup Firebase

Create a Firebase project and get your config:

```javascript
// firebase-config.js
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}
```

### 2. Editor Page (Admin)

```tsx
// pages/admin/editor/[pageId].tsx (Page Router)
// or app/admin/editor/[pageId]/page.tsx (App Router)

import { PageBuilder, ThemeProvider } from 'jovjrx-pagebuilder'
import { firebaseConfig } from '../../../firebase-config'

export default function EditorPage({ params }: { params: { pageId: string } }) {
  return (
    <ThemeProvider theme="dark-purple">
      <PageBuilder
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
        language="pt-BR"
        availableLanguages={['pt-BR', 'en', 'es']}
        onSave={(page) => console.log('Page saved:', page)}
        onError={(error) => console.error('Error:', error)}
      />
    </ThemeProvider>
  )
}
```

### 3. Public Page (Render)

```tsx
// pages/[pageId].tsx (Page Router)
// or app/[pageId]/page.tsx (App Router)

import { PageRenderer, ThemeProvider } from 'jovjrx-pagebuilder'
import { firebaseConfig } from '../firebase-config'

export default function PublicPage({ params }: { params: { pageId: string } }) {
  return (
    <ThemeProvider theme="dark-purple">
      <PageRenderer
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
        language="pt-BR"
        mode="dark"
        onLoad={(page) => console.log('Page loaded:', page)}
        onError={(error) => console.error('Error:', error)}
      />
    </ThemeProvider>
  )
}
```

### 4. With Providers (Recommended)

```tsx
// app/layout.tsx (App Router)
import { ThemeProvider, LanguageProvider } from 'jovjrx-pagebuilder'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider theme="dark-purple">
          <LanguageProvider
            availableLanguages={['pt-BR', 'en', 'es']}
            persistLanguage={true}
            detectLanguage={true}
          >
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## 🎨 Available Blocks

### 🚀 Hero Block
Perfect landing section with:
- Title, subtitle, description
- Call-to-action buttons
- Media support (image/video/YouTube)
- Social proof elements
- Urgency indicators

### ✨ Features Block
Showcase benefits with:
- Grid layout (1-4 columns)
- Icons and descriptions
- Hover animations
- Statistics/KPIs
- Tags and categories

### 💬 Testimonials Block
Build trust with:
- Customer testimonials
- Star ratings
- Photos and results
- Social proof metrics

### 💰 Pricing Block
Convert visitors with:
- Plan comparisons
- Feature lists
- Popular badges
- Call-to-action buttons

### ❓ FAQ Block
Answer questions with:
- Accordion layout
- Search functionality
- Categories
- Rich text answers

### 📊 Stats Block
Show impact with:
- Animated counters
- Visual comparisons
- Progress bars
- Achievement metrics

### 📝 Text Block
Rich content with:
- Multiple text variants
- Headings and paragraphs
- Captions and KPIs
- Custom styling

### 🎬 Media Block
Visual content with:
- Images and videos
- YouTube/Vimeo embeds
- Responsive layouts
- Alt text support

### 🎯 Actions Block
Drive conversions with:
- Primary/secondary buttons
- Benefit lists
- Urgency elements
- Price displays

### ⏰ Timer Block
Create urgency with:
- Countdown timers
- Limited offers
- Progress indicators
- Custom styling

## 🌍 Multi-Language Support

### Supported Languages

- 🇧🇷 Portuguese (Brazil) - `pt-BR`
- 🇺🇸 English - `en`
- 🇪🇸 Spanish - `es`
- 🇫🇷 French - `fr`
- 🇩🇪 German - `de`
- 🇮🇹 Italian - `it`

### Usage

```tsx
import { useLanguageContext, LanguageSelector } from 'jovjrx-pagebuilder'

function MyComponent() {
  const { currentLanguage, setLanguage, getValue } = useLanguageContext()
  
  const multiLangText = {
    'pt-BR': 'Olá mundo',
    'en': 'Hello world',
    'es': 'Hola mundo'
  }
  
  return (
    <div>
      <LanguageSelector variant="select" showFlags={true} />
      <p>{getValue(multiLangText)}</p>
    </div>
  )
}
```

## 🎨 Themes

### Dark Purple (Default)
```tsx
<ThemeProvider theme="dark-purple">
  {/* Your components */}
</ThemeProvider>
```

### Light Purple
```tsx
<ThemeProvider theme="light-purple">
  {/* Your components */}
</ThemeProvider>
```

### Custom Theme
```tsx
import { PageBuilderTheme } from 'jovjrx-pagebuilder'

const customTheme: PageBuilderTheme = {
  name: 'custom',
  colors: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    // ... other colors
  },
  // ... other theme properties
}

<ThemeProvider theme={customTheme}>
  {/* Your components */}
</ThemeProvider>
```

## 🔧 Configuration

### PageBuilder Props

```tsx
interface PageBuilderConfig {
  pageId: string                    // Required: Unique page identifier
  firebaseConfig: FirebaseConfig    // Required: Firebase configuration
  theme?: string | PageBuilderTheme // Optional: Theme name or object
  language?: string                 // Optional: Default language (pt-BR)
  availableLanguages?: string[]     // Optional: Available languages
  collection?: string               // Optional: Firestore collection (pages)
  onSave?: (page: Page) => void    // Optional: Save callback
  onError?: (error: Error) => void // Optional: Error callback
  onLanguageChange?: (lang: string) => void // Optional: Language change callback
}
```

### PageRenderer Props

```tsx
interface PageRendererConfig {
  pageId: string                    // Required: Unique page identifier
  firebaseConfig: FirebaseConfig    // Required: Firebase configuration
  theme?: string | PageBuilderTheme // Optional: Theme name or object
  language?: string                 // Optional: Default language (pt-BR)
  mode?: 'light' | 'dark' | 'auto' // Optional: Theme mode
  collection?: string               // Optional: Firestore collection (pages)
  onLoad?: (page: Page) => void    // Optional: Load callback
  onError?: (error: Error) => void // Optional: Error callback
}
```

## 🔥 Firebase Setup

### Firestore Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pages collection
    match /pages/{pageId} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Authenticated write
      
      // Blocks subcollection
      match /blocks/{blockId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}
```

### Collection Structure

```
pages/
  ├── page-id-1/
  │   ├── title: { "pt-BR": "Minha Página", "en": "My Page" }
  │   ├── slug: "minha-pagina"
  │   ├── settings: { status: "published", language: "pt-BR" }
  │   └── blocks/
  │       ├── block-id-1/
  │       ├── block-id-2/
  │       └── ...
  └── page-id-2/
      └── ...
```

## 📱 Responsive Design

All blocks are mobile-first and fully responsive:

- **Mobile**: Stack layout, touch-friendly
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Full layout with advanced features

## ⚡ Performance

- **Server-Side Rendering** - SEO optimized
- **Lazy Loading** - Images and videos
- **Code Splitting** - Minimal bundle size
- **Caching** - Firebase caching enabled
- **Optimized Images** - WebP support

## 🔒 Security

- **Input Sanitization** - XSS protection
- **Firebase Rules** - Access control
- **Type Safety** - TypeScript validation
- **Error Handling** - Graceful failures

## 🛠️ Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/jovjrx/jovjrx-pagebuilder.git

# Install dependencies
cd jovjrx-pagebuilder
npm install

# Build the package
npm run build

# Run in development mode
npm run dev
```

### Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 📚 Examples

### Complete Setup Example

```tsx
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

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

// app/admin/editor/[pageId]/page.tsx
import { PageBuilder } from 'jovjrx-pagebuilder'
import { firebaseConfig } from '../../../../firebase-config'

export default function EditorPage({ params }: { params: { pageId: string } }) {
  return (
    <PageBuilder
      pageId={params.pageId}
      firebaseConfig={firebaseConfig}
      onSave={(page) => {
        console.log('Page saved successfully:', page.title)
      }}
      onError={(error) => {
        console.error('Failed to save page:', error.message)
      }}
    />
  )
}

// app/[pageId]/page.tsx
import { PageRenderer } from 'jovjrx-pagebuilder'
import { firebaseConfig } from '../../firebase-config'

export default function PublicPage({ params }: { params: { pageId: string } }) {
  return (
    <PageRenderer
      pageId={params.pageId}
      firebaseConfig={firebaseConfig}
      mode="dark"
      onLoad={(page) => {
        // Set page title for SEO
        document.title = page.settings.seo?.title?.['pt-BR'] || page.title['pt-BR']
      }}
    />
  )
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@jovjrx.com
- 💬 Discord: [Join our community](https://discord.gg/jovjrx)
- 📖 Documentation: [docs.jovjrx.com](https://docs.jovjrx.com)
- 🐛 Issues: [GitHub Issues](https://github.com/jovjrx/jovjrx-pagebuilder/issues)

## 🚀 Roadmap

- [ ] More block types (Gallery, Carousel, Forms)
- [ ] Advanced animations and transitions
- [ ] A/B testing capabilities
- [ ] Analytics integration
- [ ] Template marketplace
- [ ] WordPress plugin version
- [ ] Shopify integration

---

**Made with 💜 by JovJrx Team**

Transform your Next.js projects with the most powerful page builder available!
#
