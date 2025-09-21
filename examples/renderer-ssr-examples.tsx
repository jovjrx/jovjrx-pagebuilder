// Exemplos de uso do BlocksRenderer com dados pré-carregados (SSR/SSG)
import React from 'react'
import { BlocksRenderer, Block } from 'jovjrx-pagebuilder'

// 🚀 NEXT.JS APP ROUTER - SSR com dados pré-carregados
export default async function PaginaProduto({ params }: { params: { id: string } }) {
  // Busca dados no servidor (SSR)
  const blocosProduto = await buscarBlocosProduto(params.id)
  
  return (
    <div className="product-page">
      <HeaderLoja />
      
      {/* Renderiza com dados pré-carregados - SEM buscar Firebase */}
      <BlocksRenderer
        parentId={params.id}
        data={blocosProduto} // 📦 Dados já carregados no servidor
        widthContainer="1200px"
        language="pt-BR"
        mode="light"
        
        onLoad={(blocks) => {
          console.log(`✅ ${blocks.length} blocos renderizados (pré-carregados)`)
        }}
      />
      
      <FooterLoja />
    </div>
  )
}

// 🔄 NEXT.JS PAGES ROUTER - SSG com getStaticProps
export async function getStaticProps({ params }: { params: { id: string } }) {
  const blocosProduto = await buscarBlocosProduto(params.id)
  
  return {
    props: {
      blocosProduto,
    },
    revalidate: 3600, // Revalida a cada hora
  }
}

export default function ProdutoPage({ blocosProduto }: { blocosProduto: Block[] }) {
  return (
    <div>
      {/* Renderiza com dados do SSG */}
      <BlocksRenderer
        parentId="produto-static"
        data={blocosProduto} // 📦 Dados vêm do getStaticProps
        widthContainer="1400px" // Container mais largo
        language="pt-BR"
      />
    </div>
  )
}

// 🌐 CSR - Busca no Firebase em tempo real (modo tradicional)
export function ProdutoCSR({ produtoId }: { produtoId: string }) {
  return (
    <BlocksRenderer
      parentId={produtoId}
      // data não fornecido = busca no Firebase
      firebaseConfig={firebaseConfig}
      collection="product_blocks"
      widthContainer="1000px"
      language="pt-BR"
      
      onLoad={(blocks) => {
        console.log(`✅ ${blocks.length} blocos carregados do Firebase`)
      }}
    />
  )
}

// 🎨 CUSTOMIZAÇÃO AVANÇADA com container responsivo
export function ProdutoResponsivo({ produtoId, blocos }: { produtoId: string, blocos?: Block[] }) {
  return (
    <div className="product-responsive">
      <style jsx>{`
        .product-responsive {
          --container-mobile: 100%;
          --container-tablet: 768px;
          --container-desktop: 1200px;
        }
      `}</style>
      
      <BlocksRenderer
        parentId={produtoId}
        data={blocos}
        // Container responsivo via CSS custom properties
        widthContainer="var(--container-desktop)"
        language="pt-BR"
        mode="light"
      />
    </div>
  )
}

// 🔥 HÍBRIDO - Dados cache + fallback Firebase
export function ProdutoHibrido({ produtoId, blocosCache }: { produtoId: string, blocosCache?: Block[] }) {
  const [blocosAtivos, setBlocosAtivos] = React.useState(blocosCache)
  
  return (
    <div>
      {blocosCache ? (
        // Renderiza cache imediatamente
        <BlocksRenderer
          parentId={produtoId}
          data={blocosCache}
          widthContainer="1200px"
          onLoad={(blocks) => {
            setBlocosAtivos(blocks)
            console.log('✅ Renderizado do cache')
          }}
        />
      ) : (
        // Fallback para Firebase se não houver cache
        <BlocksRenderer
          parentId={produtoId}
          firebaseConfig={firebaseConfig}
          collection="product_blocks"
          widthContainer="1200px"
          onLoad={(blocks) => {
            setBlocosAtivos(blocks)
            console.log('✅ Renderizado do Firebase')
          }}
        />
      )}
    </div>
  )
}

// 🎯 DIFERENTES LARGURAS POR TIPO DE BLOCO
export function ProdutoCustomLarguras({ produtoId, blocos }: { produtoId: string, blocos: Block[] }) {
  return (
    <div>
      {blocos.map((block) => {
        // Largura diferente por tipo de bloco
        const getWidthForBlock = (blockType: string) => {
          switch (blockType) {
            case 'hero': return '100vw' // Full width
            case 'features': return '1200px' // Padrão
            case 'text': return '800px' // Mais estreito para leitura
            case 'media': return '1400px' // Mais largo para mídia
            default: return '1200px'
          }
        }
        
        return (
          <BlocksRenderer
            key={block.id}
            parentId={`${produtoId}-${block.type}`}
            data={[block]} // Renderiza um bloco por vez
            widthContainer={getWidthForBlock(block.type)}
            language="pt-BR"
          />
        )
      })}
    </div>
  )
}

// 🌍 MULTI-IDIOMA com dados pré-carregados
export function ProdutoMultiIdioma({ 
  produtoId, 
  blocos, 
  idioma 
}: { 
  produtoId: string
  blocos: Block[]
  idioma: 'pt-BR' | 'en' | 'es'
}) {
  return (
    <BlocksRenderer
      parentId={produtoId}
      data={blocos}
      language={idioma}
      widthContainer="1200px"
      
      onLoad={(blocks) => {
        // Analytics por idioma
        analytics.track('content_viewed', {
          product_id: produtoId,
          language: idioma,
          blocks_count: blocks.length
        })
      }}
    />
  )
}

// Função helper para buscar blocos (exemplo)
async function buscarBlocosProduto(produtoId: string): Promise<Block[]> {
  // Pode buscar de qualquer fonte: API, database, etc.
  const response = await fetch(`/api/produtos/${produtoId}/blocos`)
  return response.json()
}

// Declarações para o exemplo
declare const firebaseConfig: any
declare const HeaderLoja: React.FC
declare const FooterLoja: React.FC  
declare const analytics: any