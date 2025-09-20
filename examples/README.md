# 📚 JovJrx PageBuilder Examples

This directory contains practical examples of how to use JovJrx PageBuilder in different scenarios.

## 🗂️ Examples Structure

```
examples/
├── next-app-router/          # App Router example
├── next-page-router/         # Page Router example
├── basic-setup/              # Minimal setup
├── advanced-setup/           # Full-featured setup
├── custom-theme/             # Custom theme example
├── multi-language/           # Multi-language setup
└── firebase-setup/           # Firebase configuration
```

## 🚀 Quick Examples

### Basic Editor Setup

```tsx
// app/admin/editor/[pageId]/page.tsx
import { PageBuilder, ThemeProvider } from 'jovjrx-pagebuilder'

const firebaseConfig = {
  // Your Firebase config
}

export default function EditorPage({ params }) {
  return (
    <ThemeProvider theme="dark-purple">
      <PageBuilder
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
        language="pt-BR"
      />
    </ThemeProvider>
  )
}
```

### Basic Renderer Setup

```tsx
// app/[pageId]/page.tsx
import { PageRenderer, ThemeProvider } from 'jovjrx-pagebuilder'

const firebaseConfig = {
  // Your Firebase config
}

export default function PublicPage({ params }) {
  return (
    <ThemeProvider theme="dark-purple">
      <PageRenderer
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
        language="pt-BR"
        mode="dark"
      />
    </ThemeProvider>
  )
}
```

### With Language Provider

```tsx
// app/layout.tsx
import { ThemeProvider, LanguageProvider } from 'jovjrx-pagebuilder'

export default function RootLayout({ children }) {
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

### Custom Theme

```tsx
import { PageBuilderTheme, ThemeProvider } from 'jovjrx-pagebuilder'

const customTheme: PageBuilderTheme = {
  name: 'custom-blue',
  colors: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  }
}

export default function MyApp({ children }) {
  return (
    <ThemeProvider theme={customTheme}>
      {children}
    </ThemeProvider>
  )
}
```

### Language Selector Component

```tsx
import { LanguageSelector, useLanguageContext } from 'jovjrx-pagebuilder'

export function Header() {
  const { currentLanguage } = useLanguageContext()
  
  return (
    <header>
      <nav>
        <div>My Website</div>
        <LanguageSelector 
          variant="select" 
          showFlags={true}
          size="sm"
        />
      </nav>
    </header>
  )
}
```

### Firebase Configuration

```tsx
// firebase-config.ts
import { FirebaseConfig } from 'jovjrx-pagebuilder'

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Error Handling

```tsx
import { PageRenderer, ThemeProvider } from 'jovjrx-pagebuilder'
import { useState } from 'react'

export default function PublicPage({ params }) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  if (error) {
    return (
      <div className="error-page">
        <h1>Página não encontrada</h1>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <ThemeProvider theme="dark-purple">
      <PageRenderer
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
        onLoad={() => setLoading(false)}
        onError={(err) => {
          setError(err)
          setLoading(false)
        }}
      />
    </ThemeProvider>
  )
}
```

### SEO Integration

```tsx
import { PageRenderer, ThemeProvider } from 'jovjrx-pagebuilder'
import Head from 'next/head'
import { useState } from 'react'

export default function PublicPage({ params }) {
  const [pageData, setPageData] = useState(null)

  return (
    <>
      <Head>
        <title>
          {pageData?.settings?.seo?.title?.['pt-BR'] || 
           pageData?.title?.['pt-BR'] || 
           'Minha Página'}
        </title>
        <meta 
          name="description" 
          content={
            pageData?.settings?.seo?.description?.['pt-BR'] || 
            pageData?.description?.['pt-BR'] || 
            'Descrição da página'
          } 
        />
        {pageData?.settings?.seo?.keywords && (
          <meta 
            name="keywords" 
            content={pageData.settings.seo.keywords.join(', ')} 
          />
        )}
        {pageData?.settings?.seo?.ogImage && (
          <meta 
            property="og:image" 
            content={pageData.settings.seo.ogImage} 
          />
        )}
      </Head>
      
      <ThemeProvider theme="dark-purple">
        <PageRenderer
          pageId={params.pageId}
          firebaseConfig={firebaseConfig}
          onLoad={(page) => setPageData(page)}
        />
      </ThemeProvider>
    </>
  )
}
```

### Authentication Integration

```tsx
import { PageBuilder, ThemeProvider } from 'jovjrx-pagebuilder'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase-config'

export default function EditorPage({ params }) {
  const [user, loading, error] = useAuthState(auth)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>Please login to access the editor</div>

  return (
    <ThemeProvider theme="dark-purple">
      <PageBuilder
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
        onSave={(page) => {
          console.log(`Page saved by ${user.email}:`, page.title)
        }}
      />
    </ThemeProvider>
  )
}
```

### Dynamic Page Creation

```tsx
import { generatePageId } from 'jovjrx-pagebuilder'
import { useRouter } from 'next/navigation'

export function CreatePageButton() {
  const router = useRouter()

  const createNewPage = () => {
    const newPageId = generatePageId()
    router.push(`/admin/editor/${newPageId}`)
  }

  return (
    <button onClick={createNewPage}>
      Create New Page
    </button>
  )
}
```

### Page List Component

```tsx
import { listPages } from 'jovjrx-pagebuilder'
import { useEffect, useState } from 'react'

export function PageList() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPages = async () => {
      try {
        const pageList = await listPages('pages')
        setPages(pageList)
      } catch (error) {
        console.error('Error loading pages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPages()
  }, [])

  if (loading) return <div>Loading pages...</div>

  return (
    <div>
      <h2>All Pages</h2>
      {pages.map((page) => (
        <div key={page.id}>
          <h3>{page.title['pt-BR']}</h3>
          <p>Status: {page.settings.status}</p>
          <a href={`/admin/editor/${page.id}`}>Edit</a>
          <a href={`/${page.slug}`}>View</a>
        </div>
      ))}
    </div>
  )
}
```

## 🔧 Environment Setup

### package.json

```json
{
  "dependencies": {
    "jovjrx-pagebuilder": "^1.0.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@chakra-ui/react": "^2.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0",
    "framer-motion": "^6.0.0",
    "firebase": "^9.0.0"
  }
}
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // For App Router
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'your-domain.com',
    ],
  },
}

module.exports = nextConfig
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pages/{pageId} {
      allow read: if true;
      allow write: if request.auth != null;
      
      match /blocks/{blockId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}
```

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
out
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

---

For more examples and detailed tutorials, visit our [documentation](https://docs.jovjrx.com).
