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
- **Professional Blocks** - Hero, Features, CTA, Content, and specialized blocks
- **Flexible Architecture** - Block types for structure, Content types for data
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
| **📊 Stats** | Animated counters and achievement metrics | 🚧 Coming Soon |
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

## Changelog

- 1.7.0
  - Model: Unify list-based content under `type: 'list'` with roles: `feature | testimonial | faq | plan | benefit | stat | detail`.
  - Renderer: Single list renderer branches by `role`. Removed legacy separate content items (features, statistics, details, testimonials).
  - Editor: List role selector now includes `stat` and `detail`. Actions, media, text, timer unchanged.
  - Scripts: Seeding script updated to use unified list roles.

- 1.6.3
  - Fix: Actions now render both primary and secondary consistently inside Content blocks using ActionRenderer
  - Fix: Editor Conteúdo tab now supports adding and editing List and Timer content types
  - Enhancement: Actions editor includes secondary action, benefits list, and urgency controls

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

## 📋 Changelog

### v1.6.2 - Tema por Bloco (Chakra Tokens) (September 2025)
- 🎨 Aba "Tema" por bloco: campos string aceitando exclusivamente tokens do Chakra (ex.: purple.500, gray.900)
- ⚙️ Abas reorganizadas: Definições, Layout, Tema, Conteúdo
- 🧷 Footer do editor sticky com espaçamento adequado

### v1.6.1 - UX do Editor + Auth Storage (September 2025)
- 🪄 BlocksEditor: seleciona automaticamente o primeiro bloco ao carregar
- ➕ Botão "Adicionar bloco": barra full-width abaixo do carrossel
- 🔐 Uploads: tentativa de autenticação anônima automática (`ensureAnonymousAuth`) para destravar regras de Storage que requerem `request.auth != null`
- 🧹 Repo URL normalizado no package.json (aviso do npm)

### v1.6.0 - Uploads + Layout Templates (September 2025)
- ✨ Media upload dropzone integrated in editor with progress
- ☁️ Firebase Storage helper `uploadMediaFile(file, pathPrefix?, onProgress?)`
- 🧩 Layout: `layout.container = 'boxed'|'fluid'|'none'`
- 🧱 Grid support via `gridColumns` or `templateColumns` with `gap`
- 🛠️ Renderer and ContentBlock updated to respect container/template settings

### v1.5.0 - Architectural Refactoring (September 2025)
- 🔥 **BREAKING**: Refactored Block.type architecture for better clarity
- ✨ **NEW**: CTABlock component for optimized call-to-action layouts
- ✨ **NEW**: ContentBlock generic component for flexible content combinations
- 🏗️ **Block types now represent structure**: `hero`, `features`, `cta`, `content`
- 📝 **Content types represent data**: `text`, `media`, `list`, `actions`, `timer`
- 📚 **Updated documentation** with new architecture examples
- 🎯 **Improved UX** in block type selection modal

### v1.4.1 - React 19 & Server-Side Support
- ⚡ React 19 compatible HTMLEditor component
- 📖 Complete server-side rendering documentation
- 🔧 Enhanced UX improvements in BlockEditor
- 🛡️ Improved HTML content sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Built with ❤️ by [José Júnior](https://josejunior.com.br)**

*Transform your Next.js applications with professional page building capabilities.*
