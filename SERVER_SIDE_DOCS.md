# jovjrx-pagebuilder - Documentação para Renderização Server-Side

## 📋 Visão Geral

Esta documentação especifica as **interfaces obrigatórias** que seu projeto deve seguir para renderizar conteúdo do `jovjrx-pagebuilder` usando seus próprios componentes, especialmente em cenários **Server-Side Rendering (SSR)** e **Static Site Generation (SSG)**.

## 🏗️ Estrutura de Dados Principais

### 1. **Block Interface** - Estrutura Principal

```typescript
interface Block {
  id?: string
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'stats' | 'cta' | 'content' | 'timer'
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
  parentId?: string
  created_at?: any
  updated_at?: any
}
```

#### 📌 **Importante: Entendendo a Arquitetura**

**BLOCK** = Tipo de **estrutura/layout** que será renderizada:
- `hero` - Seção principal/banner
- `features` - Layout para mostrar recursos
- `testimonials` - Layout para depoimentos  
- `pricing` - Layout para preços
- `faq` - Layout para perguntas frequentes
- `stats` - Layout para estatísticas
- `cta` - Layout otimizado para Call-to-Action/conversão
- `content` - Layout genérico para conteúdo flexível
- `timer` - Layout para contador/timer

**CONTENT** = O que vai **dentro** de cada bloco:
- `TextContent` - Textos, parágrafos, títulos
- `MediaContentBlock` - Imagens, vídeos
- `ListContent` - Listas de itens
- `ActionsContent` - Botões, CTAs
- `TimerContent` - Configurações de timer

### 2. **Content Types** - Conteúdo dos Blocos

```typescript
// Union type para todos os tipos de conteúdo
type Content = TextContent | MediaContentBlock | ListContent | ActionsContent | TimerContent

// Conteúdo de texto (mais comum)
interface TextContent {
  type: 'text'
  variant: 'heading' | 'subtitle' | 'paragraph' | 'caption' | 'kpi' | 'list'
  value: MultiLanguageContent
  order: number
}

// Conteúdo de mídia
interface MediaContentBlock {
  type: 'media'
  media: MediaContent
  order: number
}

// Conteúdo de lista
interface ListContent {
  type: 'list'
  role: 'feature' | 'testimonial' | 'faq' | 'plan' | 'benefit'
  items: ListItem[]
  order: number
}

// Conteúdo de ações/botões
interface ActionsContent {
  type: 'actions'
  primary: ActionContent
  secondary?: ActionContent
  benefits?: MultiLanguageContent[]
  urgency?: UrgencyConfig
  order: number
}
```

### 3. **Multi-Language Support**

```typescript
interface MultiLanguageContent {
  [languageCode: string]: string
}

// Exemplo de uso:
const title: MultiLanguageContent = {
  'pt-BR': 'Título em Português',
  'en': 'Title in English',
  'es': 'Título en Español'
}
```

### 4. **Action Content** - Botões e Links

```typescript
interface ActionContent {
  text: MultiLanguageContent
  url: string
  action: 'link' | 'buy' | 'download' | 'contact' | 'more_info'
  style: 'primary' | 'secondary' | 'outline' | 'ghost'
  price?: {
    amount: number
    currency: string
    original?: number // Para mostrar desconto
  }
}
```

## 🎨 Renderização Customizada

### Exemplo 1: Renderizador Básico de Bloco

```typescript
import { Block, Content, MultiLanguageContent } from 'jovjrx-pagebuilder'

function CustomBlockRenderer({ 
  block, 
  language = 'pt-BR' 
}: { 
  block: Block
  language?: string 
}) {
  // Função helper para extrair texto multi-idioma
  const getText = (content: MultiLanguageContent): string => {
    return content[language] || content['pt-BR'] || Object.values(content)[0] || ''
  }

  // Renderizar apenas blocos ativos
  if (!block.active) return null

  return (
    <section className={`block block-${block.type}`} data-block-id={block.id}>
      {/* Título do bloco */}
      {block.title && (
        <h2 className="block-title">
          {getText(block.title)}
        </h2>
      )}

      {/* Subtítulo */}
      {block.subtitle && (
        <h3 className="block-subtitle">
          {getText(block.subtitle)}
        </h3>
      )}

      {/* Descrição */}
      {block.description && (
        <div 
          className="block-description"
          dangerouslySetInnerHTML={{ 
            __html: getText(block.description) 
          }} 
        />
      )}

      {/* Conteúdo */}
      <div className="block-content">
        {block.content
          .sort((a, b) => a.order - b.order)
          .map((content, index) => (
            <CustomContentRenderer 
              key={`${block.id}-${index}`}
              content={content}
              language={language}
            />
          ))}
      </div>
    </section>
  )
}
```

### Exemplo 2: Renderizador de Conteúdo

```typescript
function CustomContentRenderer({ 
  content, 
  language = 'pt-BR' 
}: { 
  content: Content
  language?: string 
}) {
  const getText = (multiContent: MultiLanguageContent): string => {
    return multiContent[language] || multiContent['pt-BR'] || Object.values(multiContent)[0] || ''
  }

  switch (content.type) {
    case 'text':
      return <CustomTextRenderer content={content} language={language} />
    
    case 'media':
      return <CustomMediaRenderer content={content} />
    
    case 'list':
      return <CustomListRenderer content={content} language={language} />
    
    case 'actions':
      return <CustomActionsRenderer content={content} language={language} />
    
    case 'timer':
      return <CustomTimerRenderer content={content} language={language} />
    
    default:
      return null
  }
}
```

### Exemplo 3: Renderizador de Texto com HTML

```typescript
import { TextContent } from 'jovjrx-pagebuilder'

function CustomTextRenderer({ 
  content, 
  language = 'pt-BR' 
}: { 
  content: TextContent
  language?: string 
}) {
  const getText = (multiContent: MultiLanguageContent): string => {
    return multiContent[language] || multiContent['pt-BR'] || Object.values(multiContent)[0] || ''
  }

  const text = getText(content.value)
  const className = `text-content text-${content.variant}`

  switch (content.variant) {
    case 'heading':
      return (
        <h1 
          className={className}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
    
    case 'subtitle':
      return (
        <h2 
          className={className}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
    
    case 'paragraph':
      return (
        <p 
          className={className}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
    
    case 'list':
      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
    
    case 'kpi':
      return (
        <div className={`${className} text-4xl font-bold`}>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )
    
    case 'caption':
      return (
        <small 
          className={className}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
    
    default:
      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
  }
}
```

### Exemplo 4: Renderizador de Ações/Botões

```typescript
import { ActionsContent } from 'jovjrx-pagebuilder'

function CustomActionsRenderer({ 
  content, 
  language = 'pt-BR',
  onPurchase
}: { 
  content: ActionsContent
  language?: string
  onPurchase?: (productId: string, data: any) => void
}) {
  const getText = (multiContent: MultiLanguageContent): string => {
    return multiContent[language] || multiContent['pt-BR'] || Object.values(multiContent)[0] || ''
  }

  const handleClick = (action: ActionContent) => {
    if (action.action === 'buy' && onPurchase) {
      onPurchase(action.url, {
        name: getText(action.text),
        price: action.price
      })
    } else {
      window.open(action.url, '_blank')
    }
  }

  return (
    <div className="actions-content">
      {/* Botão primário */}
      <button 
        className={`btn btn-${action.primary.style}`}
        onClick={() => handleClick(action.primary)}
      >
        {getText(action.primary.text)}
        {action.primary.price && (
          <span className="price">
            {action.primary.price.currency} {action.primary.price.amount.toFixed(2)}
          </span>
        )}
      </button>

      {/* Botão secundário */}
      {content.secondary && (
        <button 
          className={`btn btn-${content.secondary.style}`}
          onClick={() => handleClick(content.secondary)}
        >
          {getText(content.secondary.text)}
        </button>
      )}

      {/* Benefícios */}
      {content.benefits && (
        <ul className="benefits-list">
          {content.benefits.map((benefit, index) => (
            <li key={index}>{getText(benefit)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## 📱 Next.js SSR/SSG Examples

### SSR com getServerSideProps

```typescript
// pages/landing/[slug].tsx
import { GetServerSideProps } from 'next'
import { Block } from 'jovjrx-pagebuilder'

interface LandingPageProps {
  blocks: Block[]
  language: string
}

export default function LandingPage({ blocks, language }: LandingPageProps) {
  return (
    <main>
      {blocks
        .filter(block => block.active && block.version === 'published')
        .sort((a, b) => a.order - b.order)
        .map(block => (
          <CustomBlockRenderer 
            key={block.id} 
            block={block} 
            language={language} 
          />
        ))}
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  // Buscar dados do Firebase ou sua API
  const blocks = await fetchBlocksFromFirebase(params?.slug as string)
  
  return {
    props: {
      blocks,
      language: locale || 'pt-BR'
    }
  }
}
```

### SSG com getStaticProps

```typescript
// pages/static/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  // Buscar todas as páginas disponíveis
  const pages = await getAllPages()
  
  return {
    paths: pages.map(page => ({ params: { slug: page.slug } })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const blocks = await fetchBlocksFromFirebase(params?.slug as string)
  
  return {
    props: { blocks },
    revalidate: 60 // Revalidar a cada 60 segundos
  }
}
```

## 🔧 Utilidades Helper

### 1. Função para extrair texto multi-idioma

```typescript
export function getMultiLanguageValue(
  content: MultiLanguageContent, 
  language: string
): string {
  return content[language] || 
         content['pt-BR'] || 
         Object.values(content)[0] || 
         ''
}
```

### 2. Função para sanitizar HTML

```typescript
export function sanitizeHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
}
```

### 3. Hook personalizado para blocos

```typescript
import { useState, useEffect } from 'react'

export function useBlocks(parentId: string) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchBlocks(parentId)
      .then(setBlocks)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [parentId])

  return { blocks, loading, error }
}
```

## 🚨 Regras Importantes

### ✅ **O que DEVE ser seguido:**

1. **Interfaces exatas**: Use exatamente as interfaces TypeScript exportadas
2. **Propriedade `order`**: Sempre ordene conteúdo por `content.order`
3. **Propriedade `active`**: Renderize apenas blocos com `active: true`
4. **Multi-idioma**: Sempre use função helper para extrair textos
5. **HTML seguro**: Sanitize HTML antes de renderizar com `dangerouslySetInnerHTML`

### ❌ **O que NÃO deve ser alterado:**

1. Estrutura das interfaces `Block`, `Content`, `ActionContent`, etc.
2. Nomes das propriedades (`type`, `variant`, `order`, etc.)
3. Valores dos enums (`action: 'buy' | 'link'...`)
4. Estrutura do `MultiLanguageContent`

## 📦 Importações Necessárias

```typescript
import {
  // Types principais
  Block,
  Content,
  TextContent,
  ActionsContent,
  ListContent,
  MediaContentBlock,
  TimerContent,
  
  // Configurações
  MultiLanguageContent,
  ActionContent,
  MediaContent,
  ListItem,
  
  // Layout e tema
  BlockLayout,
  BlockTheme,
  PageBuilderTheme,
  
  // Utilitários (se necessário)
  HTMLContent,
  HTMLEditor
} from 'jovjrx-pagebuilder'
```

## 🎯 Casos de Uso Comuns

### 1. **E-commerce com botões de compra**
```typescript
const handlePurchase = (productId: string, data: any) => {
  // Sua lógica de checkout
  addToCart(data.price, data.name)
  redirectToCheckout()
}

<CustomActionsRenderer 
  content={actionsContent}
  onPurchase={handlePurchase}
/>
```

### 2. **Blog com conteúdo HTML**
```typescript
<CustomTextRenderer content={textContent} />
// Automaticamente renderiza HTML do editor
```

### 3. **Landing page multi-idioma**
```typescript
const { locale } = useRouter()
<CustomBlockRenderer block={block} language={locale} />
```

Seguindo esta documentação, seu projeto pode renderizar qualquer conteúdo do `jovjrx-pagebuilder` mantendo **100% de compatibilidade** com o sistema! 🚀