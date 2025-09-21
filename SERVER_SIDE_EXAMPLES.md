# jovjrx-pagebuilder - Exemplos Práticos Server-Side

## 🔥 **Nova Arquitetura (v1.4.2+)**

### Tipos de Bloco Atualizados
- `hero` - Seção principal
- `features` - Recursos/características  
- `cta` - Call-to-Action otimizado
- `content` - Conteúdo genérico flexível
- `testimonials`, `pricing`, `faq`, `stats`, `timer` - Layouts específicos

### Exemplo Rápido da Nova Estrutura

```typescript
const exemploBloco: Block = {
  id: 'bloco-1',
  type: 'cta', // Tipo do layout/estrutura
  title: { 'pt-BR': 'Compre Agora!' },
  content: [ // Conteúdo dentro do bloco
    {
      type: 'text',
      variant: 'paragraph', 
      value: { 'pt-BR': 'Oferta especial...' },
      order: 0
    },
    {
      type: 'actions',
      primary: { 
        text: { 'pt-BR': 'Comprar' }, 
        action: 'buy', 
        style: 'primary' 
      },
      order: 1
    }
  ]
}
```

## 🌟 Exemplos Reais de Implementação

### 1. **E-commerce Landing Page Completa**

```typescript
// components/CustomPageRenderer.tsx
import React from 'react'
import { Block, getMultiLanguageValue } from 'jovjrx-pagebuilder'

interface CustomPageRendererProps {
  blocks: Block[]
  language?: string
  onPurchase?: (productId: string, data: any) => Promise<void>
}

export function CustomPageRenderer({ 
  blocks, 
  language = 'pt-BR',
  onPurchase 
}: CustomPageRendererProps) {
  return (
    <div className="custom-page">
      {blocks
        .filter(block => block.active && block.version === 'published')
        .sort((a, b) => a.order - b.order)
        .map(block => (
          <CustomBlockRenderer 
            key={block.id}
            block={block}
            language={language}
            onPurchase={onPurchase}
          />
        ))}
    </div>
  )
}

// Renderizador de bloco específico para e-commerce
function CustomBlockRenderer({ block, language, onPurchase }) {
  const getText = (content) => getMultiLanguageValue(content, language)

  const blockStyles = {
    hero: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20',
    features: 'py-16 bg-gray-50',
    testimonials: 'py-16 bg-white',
    pricing: 'py-16 bg-gradient-to-b from-gray-50 to-white',
    text: 'py-12',
    actions: 'py-16 bg-purple-900 text-white text-center'
  }

  return (
    <section className={`block-${block.type} ${blockStyles[block.type] || 'py-8'}`}>
      <div className="container mx-auto px-4">
        {/* Header do bloco */}
        {(block.title || block.subtitle) && (
          <div className="text-center mb-12">
            {block.title && (
              <h2 className="text-4xl font-bold mb-4">
                {getText(block.title)}
              </h2>
            )}
            {block.subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {getText(block.subtitle)}
              </p>
            )}
          </div>
        )}

        {/* Conteúdo específico por tipo */}
        {renderBlockContent(block, language, onPurchase)}
      </div>
    </section>
  )
}

function renderBlockContent(block, language, onPurchase) {
  const getText = (content) => getMultiLanguageValue(content, language)

  switch (block.type) {
    case 'hero':
      return (
        <div className="text-center">
          {block.content.map((content, index) => {
            if (content.type === 'text' && content.variant === 'heading') {
              return (
                <h1 key={index} className="text-6xl font-bold mb-6">
                  {getText(content.value)}
                </h1>
              )
            }
            if (content.type === 'actions') {
              return (
                <div key={index} className="mt-8 space-x-4">
                  <button 
                    className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition"
                    onClick={() => handlePurchase(content.primary, onPurchase)}
                  >
                    {getText(content.primary.text)}
                    {content.primary.price && (
                      <span className="ml-2">
                        - R$ {content.primary.price.amount.toFixed(2)}
                      </span>
                    )}
                  </button>
                </div>
              )
            }
            return null
          })}
        </div>
      )

    case 'features':
      return (
        <div className="grid md:grid-cols-3 gap-8">
          {block.content
            .filter(content => content.type === 'list')
            .map(listContent => 
              listContent.items.map((item, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">
                    {getText(item.title)}
                  </h3>
                  <p className="text-gray-600">
                    {getText(item.text || {})}
                  </p>
                </div>
              ))
            )}
        </div>
      )

    case 'testimonials':
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {block.content
            .filter(content => content.type === 'list' && content.role === 'testimonial')
            .map(listContent => 
              listContent.items.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{getText(testimonial.text || {})}"
                  </p>
                  <div className="font-semibold">
                    {getText(testimonial.title)}
                  </div>
                  {testimonial.subtitle && (
                    <div className="text-sm text-gray-600">
                      {getText(testimonial.subtitle)}
                    </div>
                  )}
                </div>
              ))
            )}
        </div>
      )

    case 'pricing':
      return (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {block.content
            .filter(content => content.type === 'list' && content.role === 'plan')
            .map(listContent => 
              listContent.items.map((plan, index) => (
                <div key={index} className={`
                  bg-white rounded-xl p-8 shadow-lg relative
                  ${plan.popular ? 'border-2 border-purple-500 transform scale-105' : 'border border-gray-200'}
                `}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      {getText(plan.title)}
                    </h3>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        R$ {plan.price?.amount.toFixed(2)}
                      </span>
                      <span className="text-gray-600">/mês</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <span className="text-green-500 mr-3">✓</span>
                          {getText(feature)}
                        </li>
                      ))}
                    </ul>

                    {plan.cta && (
                      <button 
                        className={`
                          w-full py-3 px-6 rounded-lg font-semibold transition
                          ${plan.popular 
                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }
                        `}
                        onClick={() => handlePurchase(plan.cta, onPurchase)}
                      >
                        {getText(plan.cta.text)}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
        </div>
      )

    default:
      return (
        <div className="prose max-w-none">
          {block.content
            .sort((a, b) => a.order - b.order)
            .map((content, index) => (
              <div key={index} className="mb-6">
                {renderContent(content, language)}
              </div>
            ))}
        </div>
      )
  }
}

function renderContent(content, language) {
  const getText = (multiContent) => getMultiLanguageValue(multiContent, language)

  switch (content.type) {
    case 'text':
      const text = getText(content.value)
      switch (content.variant) {
        case 'heading':
          return <h2 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: text }} />
        case 'subtitle':
          return <h3 className="text-2xl font-semibold mb-3" dangerouslySetInnerHTML={{ __html: text }} />
        case 'paragraph':
          return <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
        case 'list':
          return <div className="space-y-2" dangerouslySetInnerHTML={{ __html: text }} />
        default:
          return <div dangerouslySetInnerHTML={{ __html: text }} />
      }

    case 'media':
      return (
        <div className="my-8">
          {content.media.kind === 'image' && (
            <img 
              src={content.media.url} 
              alt={content.media.alt || ''} 
              className="w-full h-auto rounded-lg"
            />
          )}
          {content.media.kind === 'video' && (
            <video 
              src={content.media.url}
              poster={content.media.poster}
              controls
              className="w-full rounded-lg"
            />
          )}
        </div>
      )

    default:
      return null
  }
}

function handlePurchase(action, onPurchase) {
  if (action.action === 'buy' && onPurchase) {
    onPurchase(action.url, {
      name: action.text,
      price: action.price,
      action: action.action
    })
  } else {
    window.location.href = action.url
  }
}
```

### 2. **Hook Customizado para Carregar Dados**

```typescript
// hooks/usePageBuilder.ts
import { useState, useEffect } from 'react'
import { Block } from 'jovjrx-pagebuilder'

export interface UsePageBuilderResult {
  blocks: Block[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function usePageBuilder(
  parentId: string,
  options?: {
    collection?: string
    language?: string
    version?: 'draft' | 'published'
    firebaseConfig?: any
  }
): UsePageBuilderResult {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlocks = async () => {
    try {
      setLoading(true)
      setError(null)

      // Sua lógica de busca (Firebase, API, etc.)
      const response = await fetch(`/api/blocks/${parentId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Falha ao carregar blocos')
      }

      const data = await response.json()
      
      // Filtrar apenas blocos ativos se especificado
      const filteredBlocks = data.filter(block => {
        if (options?.version && block.version !== options.version) return false
        return true
      })

      setBlocks(filteredBlocks)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao carregar blocos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (parentId) {
      fetchBlocks()
    }
  }, [parentId])

  return {
    blocks,
    loading,
    error,
    refresh: fetchBlocks
  }
}
```

### 3. **Next.js API Route para SSR**

```typescript
// pages/api/blocks/[parentId].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { Block } from 'jovjrx-pagebuilder'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Block[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { parentId } = req.query
  const { version = 'published' } = req.query

  try {
    // Initialize Firebase
    const app = initializeApp({
      // Sua configuração do Firebase
    })
    const db = getFirestore(app)

    // Query blocks
    const blocksRef = collection(db, 'blocks')
    const q = query(
      blocksRef,
      where('parentId', '==', parentId),
      where('version', '==', version),
      where('active', '==', true),
      orderBy('order', 'asc')
    )

    const querySnapshot = await getDocs(q)
    const blocks: Block[] = []

    querySnapshot.forEach((doc) => {
      blocks.push({ id: doc.id, ...doc.data() } as Block)
    })

    res.status(200).json(blocks)
  } catch (error) {
    console.error('Erro ao buscar blocos:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
```

### 4. **Componente de Loading e Error**

```typescript
// components/PageBuilderWrapper.tsx
import React from 'react'
import { usePageBuilder } from '../hooks/usePageBuilder'
import { CustomPageRenderer } from './CustomPageRenderer'

interface PageBuilderWrapperProps {
  parentId: string
  language?: string
  onPurchase?: (productId: string, data: any) => Promise<void>
  fallback?: React.ReactNode
}

export function PageBuilderWrapper({ 
  parentId, 
  language = 'pt-BR',
  onPurchase,
  fallback
}: PageBuilderWrapperProps) {
  const { blocks, loading, error, refresh } = usePageBuilder(parentId, {
    version: 'published',
    language
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Carregando conteúdo...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold">Erro ao carregar conteúdo</h3>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
        <button 
          onClick={refresh}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  if (blocks.length === 0) {
    return fallback || (
      <div className="text-center py-20 text-gray-600">
        <h3 className="text-lg font-semibold mb-2">Nenhum conteúdo encontrado</h3>
        <p>Esta página ainda não possui conteúdo publicado.</p>
      </div>
    )
  }

  return (
    <CustomPageRenderer 
      blocks={blocks}
      language={language}
      onPurchase={onPurchase}
    />
  )
}
```

### 5. **Uso em Página Next.js**

```typescript
// pages/lp/[slug].tsx
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Block, getMultiLanguageValue } from 'jovjrx-pagebuilder'
import { PageBuilderWrapper } from '../../components/PageBuilderWrapper'

interface LandingPageProps {
  parentId: string
  seo: {
    title: string
    description: string
  }
  blocks?: Block[] // Para SSR
}

export default function LandingPage({ parentId, seo, blocks }: LandingPageProps) {
  const handlePurchase = async (productId: string, data: any) => {
    // Sua lógica de checkout
    console.log('Comprar produto:', productId, data)
    
    // Exemplo: redirecionar para checkout
    window.location.href = `/checkout?product=${productId}&price=${data.price.amount}`
  }

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
      </Head>

      <PageBuilderWrapper 
        parentId={parentId}
        onPurchase={handlePurchase}
        fallback={
          <div className="text-center py-20">
            <h1>Página em construção</h1>
          </div>
        }
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const slug = params?.slug as string
  
  try {
    // Buscar dados da página
    const pageResponse = await fetch(`${process.env.API_URL}/api/pages/${slug}`)
    
    if (!pageResponse.ok) {
      return { notFound: true }
    }
    
    const pageData = await pageResponse.json()
    
    return {
      props: {
        parentId: pageData.id,
        seo: {
          title: getMultiLanguageValue(pageData.title, locale || 'pt-BR'),
          description: getMultiLanguageValue(pageData.description || {}, locale || 'pt-BR')
        }
      }
    }
  } catch (error) {
    console.error('Erro ao carregar página:', error)
    return { notFound: true }
  }
}
```

## 📱 React Native Example

```typescript
// components/NativePageBuilder.tsx
import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Block, getMultiLanguageValue } from 'jovjrx-pagebuilder'

interface NativePageBuilderProps {
  blocks: Block[]
  language?: string
  onPurchase?: (productId: string, data: any) => void
}

export function NativePageBuilder({ blocks, language = 'pt-BR', onPurchase }: NativePageBuilderProps) {
  const getText = (content) => getMultiLanguageValue(content, language)

  return (
    <ScrollView style={styles.container}>
      {blocks
        .filter(block => block.active && block.version === 'published')
        .sort((a, b) => a.order - b.order)
        .map(block => (
          <View key={block.id} style={styles.block}>
            {block.title && (
              <Text style={styles.blockTitle}>
                {getText(block.title)}
              </Text>
            )}
            
            {block.content
              .sort((a, b) => a.order - b.order)
              .map((content, index) => (
                <View key={index}>
                  {content.type === 'text' && (
                    <Text style={getTextStyle(content.variant)}>
                      {getText(content.value)}
                    </Text>
                  )}
                  
                  {content.type === 'actions' && (
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => onPurchase?.(content.primary.url, {
                        name: getText(content.primary.text),
                        price: content.primary.price
                      })}
                    >
                      <Text style={styles.buttonText}>
                        {getText(content.primary.text)}
                      </Text>
                      {content.primary.price && (
                        <Text style={styles.price}>
                          R$ {content.primary.price.amount.toFixed(2)}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              ))}
          </View>
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  block: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  blockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  price: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4
  }
})

function getTextStyle(variant) {
  switch (variant) {
    case 'heading':
      return { fontSize: 28, fontWeight: 'bold', marginBottom: 12 }
    case 'subtitle':
      return { fontSize: 20, fontWeight: '600', marginBottom: 8 }
    case 'paragraph':
      return { fontSize: 16, lineHeight: 24, marginBottom: 12 }
    default:
      return { fontSize: 16, marginBottom: 8 }
  }
}
```

Estes exemplos mostram como implementar **completamente** seu próprio renderizador mantendo **100% compatibilidade** com o `jovjrx-pagebuilder`! 🚀