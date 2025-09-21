// Exemplos de uso dos componentes de renderização
import React from 'react'
import { PageRenderer, BlocksRenderer, BlocksEditor, Block, Page } from 'jovjrx-pagebuilder'

// 🎯 RENDERIZAR PÁGINA COMPLETA (Modo tradicional)
export function ExibirPaginaCompleta({ pageId }: { pageId: string }) {
  return (
    <PageRenderer
      pageId={pageId}
      firebaseConfig={firebaseConfig}
      collection="pages"
      language="pt-BR"
      mode="light" // ou "dark"
      
      onLoad={(page) => {
        console.log('Página carregada:', page.title)
        // Atualizar SEO, analytics, etc.
      }}
      
      onError={(error) => {
        console.error('Erro ao carregar página:', error)
      }}
    />
  )
}

// 🎯 RENDERIZAR APENAS BLOCOS (Modo blocks-only)
export function ExibirBlocosProduto({ produtoId }: { produtoId: string }) {
  return (
    <div className="product-page">
      {/* Seu cabeçalho customizado */}
      <header className="product-header">
        <h1>Meu Produto Incrível</h1>
        <nav>Home / Produtos / Produto XYZ</nav>
      </header>

      {/* Renderização dos blocos salvos */}
      <main className="product-content">
        <BlocksRenderer
          parentId={produtoId}
          firebaseConfig={firebaseConfig}
          collection="product_blocks"
          language="pt-BR"
          mode="light"
          
          onLoad={(blocks) => {
            console.log(`${blocks.length} blocos carregados para produto ${produtoId}`)
          }}
          
          onError={(error) => {
            console.error('Erro ao carregar blocos:', error)
          }}
        />
      </main>

      {/* Seu rodapé customizado */}
      <footer className="product-footer">
        <p>© 2025 Minha Empresa</p>
      </footer>
    </div>
  )
}

// 🎯 PÁGINA DE PRODUTO DINÂMICA (Next.js App Router)
export default function PaginaProduto({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* SEO e metadados vêm do seu banco principal */}
      <head>
        <title>Produto {params.id}</title>
        <meta name="description" content="Descrição do produto..." />
      </head>

      {/* Layout fixo da loja */}
      <HeaderLoja />
      <BreadcrumbLoja produtoId={params.id} />

      {/* Conteúdo dinâmico gerenciado pelo PageBuilder */}
      <BlocksRenderer
        parentId={params.id}
        firebaseConfig={firebaseConfig}
        collection="product_blocks"
        language="pt-BR"
      />

      {/* Componentes fixos da loja */}
      <ProdutosRelacionados produtoId={params.id} />
      <FooterLoja />
    </div>
  )
}

// 🎯 PÁGINA DE ARTIGO (Blog)
export function PaginaArtigo({ artigoId }: { artigoId: string }) {
  return (
    <article className="blog-post">
      {/* Metadados do artigo vêm da sua API */}
      <header className="article-header">
        <h1>Título do Artigo</h1>
        <div className="article-meta">
          <span>Por: João Silva</span>
          <span>Em: 20/09/2025</span>
          <span>Categoria: Tecnologia</span>
        </div>
      </header>

      {/* Conteúdo do artigo gerenciado pelo PageBuilder */}
      <div className="article-content">
        <BlocksRenderer
          parentId={artigoId}
          firebaseConfig={firebaseConfig}
          collection="article_blocks"
          language="pt-BR"
          mode="light"
        />
      </div>

      {/* Comentários, compartilhamento, etc. */}
      <footer className="article-footer">
        <SocialShare />
        <CommentsSection />
      </footer>
    </article>
  )
}

// 🎯 DASHBOARD COM PREVIEW EM TEMPO REAL
export function DashboardComPreview({ produtoId }: { produtoId: string }) {
  return (
    <div className="dashboard-layout">
      {/* Editor na esquerda */}
      <div className="editor-pane">
        <BlocksEditor
          parentId={produtoId}
          firebaseConfig={firebaseConfig}
          collection="product_blocks"
          hideHeader={true}
          autoSave={true}
        />
      </div>

      {/* Preview na direita */}
      <div className="preview-pane">
        <h3>Preview em Tempo Real</h3>
        <div className="preview-frame">
          <BlocksRenderer
            parentId={produtoId}
            firebaseConfig={firebaseConfig}
            collection="product_blocks"
            language="pt-BR"
            mode="light"
          />
        </div>
      </div>
    </div>
  )
}

// 🎯 DIFERENTES TEMAS PARA DIFERENTES CONTEXTOS
export function ExemplosComTemas() {
  return (
    <div>
      {/* Tema escuro para dashboard admin */}
      <BlocksRenderer
        parentId="config-1"
        firebaseConfig={firebaseConfig}
        mode="dark"
        collection="admin_blocks"
      />

      {/* Tema claro para site público */}
      <BlocksRenderer
        parentId="config-1"
        firebaseConfig={firebaseConfig}
        mode="light"
        collection="public_blocks"
      />
    </div>
  )
}

// 🎯 MULTI-IDIOMA
export function ExemploMultiIdioma({ produtoId, idioma }: { produtoId: string, idioma: string }) {
  return (
    <BlocksRenderer
      parentId={produtoId}
      firebaseConfig={firebaseConfig}
      collection="product_blocks"
      language={idioma} // "pt-BR", "en", "es", etc.
      
      onLoad={(blocks) => {
        // Analytics por idioma
        analytics.track('content_viewed', {
          parentId: produtoId,
          language: idioma,
          blocks_count: blocks.length
        })
      }}
    />
  )
}

// Declarações de tipos para os exemplos
declare const firebaseConfig: any
declare const HeaderLoja: React.FC
declare const BreadcrumbLoja: React.FC<{ produtoId: string }>
declare const ProdutosRelacionados: React.FC<{ produtoId: string }>
declare const FooterLoja: React.FC
declare const SocialShare: React.FC
declare const CommentsSection: React.FC
declare const analytics: any