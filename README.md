# 🚀 JovJrx PageBuilder

**Universal Page Builder Library for Next.js Applications**

A powerful, production-ready React component library that enables you to create stunning landing pages and websites directly within your Next.js applications. Built with TypeScript, Chakra UI, and Firebase for maximum flexibility and type safety.

## ✨ What is JovJrx PageBuilder?

JovJrx PageBuilder is a **React component library** that provides a complete visual page building system for Next.js applications. Instead of building your own editor from scratch, simply install our library and get:

### 🎯 **For Developers**
- **Drop-in Components** - Ready-to-use `<PageBuilder>` and `<PageRenderer>` components
- **TypeScript First** - Full type safety and excellent DX
- **Next.js Native** - Works with both App Router and Pages Router
- **Firebase Ready** - Built-in Firestore integration for data persistence
- **Customizable** - Extensive theming and configuration options

### 🎨 **For Content Creators**
- **Visual Editor** - Drag & drop interface for building pages
- **Professional Blocks** - Hero sections, features, testimonials, pricing, and more
- **Multi-language** - Built-in i18n support for global audiences
- **Responsive** - Mobile-first design that works on all devices
- **Real-time Preview** - See changes as you build

### 🚀 **Key Features**
- ✅ **Production Ready** - Used in real projects, battle-tested
- ✅ **Zero Config** - Works out of the box with sensible defaults
- ✅ **Performance Optimized** - Tree-shakeable, minimal bundle impact
- ✅ **SEO Friendly** - Server-side rendering compatible
- ✅ **Accessibility** - WCAG compliant components

## 📦 Installation

```bash
# npm
npm install jovjrx-pagebuilder

# yarn
yarn add jovjrx-pagebuilder

# pnpm  
pnpm add jovjrx-pagebuilder
```

**Required peer dependencies:**

```bash
# npm
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion firebase

# yarn
yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion firebase

# pnpm
pnpm add @chakra-ui/react @emotion/react @emotion/styled framer-motion firebase
```

## 🚀 Quick Start

### 1. Create a Page Editor (Admin Interface)

```tsx
// app/admin/editor/[pageId]/page.tsx
import { PageBuilder, ThemeProvider } from 'jovjrx-pagebuilder'

const firebaseConfig = {
  // Your Firebase config
  projectId: "your-project-id",
  // ... other config
}

export default function EditorPage({ params }: { params: { pageId: string } }) {
  return (
    <ThemeProvider>
      <PageBuilder
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
      />
    </ThemeProvider>
  )
}
```

### 2. Display Pages (Public Interface)

```tsx
// app/[pageId]/page.tsx  
import { PageRenderer, ThemeProvider } from 'jovjrx-pagebuilder'

export default function PublicPage({ params }: { params: { pageId: string } }) {
  return (
    <ThemeProvider>
      <PageRenderer
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
      />
    </ThemeProvider>
  )
}
```

**That's it!** 🎉 You now have a complete page building system in your Next.js app.

## 🧱 Available Block Components

| Block Type | Description | Status |
|------------|-------------|---------|
| **🚀 Hero** | Landing sections with CTAs, media, and social proof | ✅ Available |
| **✨ Features** | Grid layouts showcasing benefits and features | ✅ Available |  
| **📝 Text** | Rich text content with multiple typography variants | ✅ Available |
| **🎬 Media** | Images, videos, and YouTube/Vimeo embeds | ✅ Available |
| **🎯 Actions** | Call-to-action buttons with pricing and benefits | ✅ Available |
| **💬 Testimonials** | Customer reviews and social proof | 🚧 Coming Soon |
| **💰 Pricing** | Plan comparisons and pricing tables | 🚧 Coming Soon |
| **❓ FAQ** | Accordion-style frequently asked questions | 🚧 Coming Soon |
| **📊 Stats** | Animated counters and achievement metrics | � Coming Soon |
| **📋 List** | Flexible lists for any type of content | 🚧 Coming Soon |
| **⏰ Timer** | Countdown timers for urgency and offers | 🚧 Coming Soon |

> **Note:** Missing blocks show a placeholder with "Coming Soon" message when used.

## 🌍 Multi-Language Support

Built-in internationalization support for global audiences:

**Supported Languages:** Portuguese (BR), English, Spanish, French, German, Italian

```tsx
import { LanguageProvider, useLanguageContext } from 'jovjrx-pagebuilder'

// Wrap your app
<LanguageProvider availableLanguages={['pt-BR', 'en', 'es']}>
  <YourApp />
</LanguageProvider>
```

## 🎨 Theming

Professional dark theme included. Fully customizable:

```tsx
<ThemeProvider theme="dark-purple">  {/* Default */}
<ThemeProvider theme="light-purple"> {/* Alternative */}
<ThemeProvider theme={customTheme}>  {/* Your own theme */}
```

## 🔧 Configuration

### Basic Props

```tsx
// PageBuilder (Editor)
<PageBuilder 
  pageId="my-page"
  firebaseConfig={config}
  language="pt-BR"                    // Optional
  availableLanguages={['pt-BR', 'en']} // Optional
  onSave={(page) => {}}               // Optional
/>

// PageRenderer (Display)  
<PageRenderer
  pageId="my-page"
  firebaseConfig={config}
  mode="dark"                         // Optional
  onLoad={(page) => {}}               // Optional
/>
```

## 🔥 Firebase Setup

1. Create a Firebase project
2. Enable Firestore Database  
3. Set these Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pages/{pageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📊 Technical Details

- **TypeScript** - Full type safety
- **Responsive** - Mobile-first design  
- **SEO Ready** - Server-side rendering support
- **Performance** - Tree-shakeable, optimized bundles
- **Accessibility** - WCAG compliant components

## � Use Cases

**Perfect for:**
- 🚀 **SaaS Landing Pages** - Create high-converting product pages
- 🏢 **Agency Websites** - Build client sites with visual editors  
- 🛍️ **E-commerce** - Product showcases and promotional pages
- 📚 **Documentation** - Interactive guides and tutorials
- 🎯 **Marketing Campaigns** - A/B testable campaign pages

## 🔗 Links

- **Website:** [josejunior.com.br](https://josejunior.com.br)
- **Issues:** [GitHub Issues](https://github.com/jovjrx/jovjrx-pagebuilder/issues)
- **Changelog:** [Releases](https://github.com/jovjrx/jovjrx-pagebuilder/releases)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Built with ❤️ by [José Júnior](https://josejunior.com.br)**

*Transform your Next.js applications with professional page building capabilities.*
