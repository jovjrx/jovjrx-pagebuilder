// Example: Using BlocksEditor in blocks-only mode
// This example shows how to use the page builder to manage only blocks
// while your main application controls the page metadata (SEO, status, etc.)

import React, { useState } from 'react'
import { BlocksEditor, PageBuilder, Block } from 'jovjrx-pagebuilder'
import { firebaseConfig } from './firebase-config'

// Option 1: Using the dedicated BlocksEditor component
export function ProductContentEditor({ productId }: { productId: string }) {
  return (
    <div>
      {/* Your application controls the product metadata */}
      <div className="product-header">
        <h1>Editing Product: {productId}</h1>
        {/* SEO fields, status, categories, etc. */}
      </div>

      {/* BlocksEditor manages only the content blocks */}
      <BlocksEditor
        parentId={productId}
        firebaseConfig={firebaseConfig}
        collection="product_blocks" // Custom collection name
        language="pt-BR"
        availableLanguages={['pt-BR', 'en', 'es']}
        onBlocksChange={(blocks) => {
          console.log('Blocks updated:', blocks.length)
          // Optional: sync with your app state
        }}
        onSave={(blocks) => {
          console.log('Blocks saved successfully:', blocks.length)
          // Optional: trigger other actions after save
        }}
        onError={(error) => {
          console.error('Error managing blocks:', error)
          // Handle errors in your application
        }}
      />
    </div>
  )
}

// Option 2: Customized BlocksEditor (embedded in your layout)
export function CustomProductEditor({ productId }: { productId: string }) {
  const [isSaving, setIsSaving] = useState(false)
  
  const handleCustomSave = async (blocks: Block[]) => {
    setIsSaving(true)
    try {
      // Your custom save logic
      await fetch('/api/products/' + productId, {
        method: 'PATCH',
        body: JSON.stringify({ blocks })
      })
      alert('✅ Produto salvo com sucesso!')
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="my-custom-layout">
      {/* Your custom header */}
      <div className="custom-header">
        <h1>Editando: {productId}</h1>
        <div className="custom-actions">
          <button onClick={() => window.history.back()}>← Voltar</button>
          <button disabled={isSaving}>
            {isSaving ? '⏳ Salvando...' : '💾 Salvar Produto'}
          </button>
        </div>
      </div>
      
      {/* BlocksEditor sem header próprio */}
      <BlocksEditor
        parentId={productId}
        firebaseConfig={firebaseConfig}
        collection="product_blocks"
        
        // 🎨 CUSTOMIZAÇÕES:
        hideHeader={true}              // Remove header do componente
        autoSave={true}                // Salva automaticamente a cada mudança
        hideSaveButton={true}          // Remove botão salvar (usa seu próprio)
        hidePreviewButton={true}       // Remove botão preview
        
        onSave={handleCustomSave}      // Sua função de save personalizada
        onBlocksChange={(blocks) => {
          // Sync com seu estado local em tempo real
          console.log('📝 Blocos alterados:', blocks.length)
        }}
        
        // Ações customizadas no header (se não escondido)
        customActions={
          <button className="custom-btn">
            📤 Publicar
          </button>
        }
      />
    </div>
  )
}

// Option 2: Using PageBuilder with blocks-only mode
export function ArticleContentEditor({ articleId }: { articleId: string }) {
  return (
    <div>
      <PageBuilder
        mode="blocks-only"
        parentId={articleId}
        firebaseConfig={firebaseConfig}
        collection="article_blocks"
        language="pt-BR"
        onSave={(blocks) => {
          console.log('Article blocks saved:', blocks)
        }}
      />
    </div>
  )
}

// Example Firebase Structure:
// 
// Collection: "product_blocks"
// ├── doc1: { parentId: "product-123", type: "hero", order: 0, title: {...}, content: [...] }
// ├── doc2: { parentId: "product-123", type: "features", order: 1, title: {...}, content: [...] }
// ├── doc3: { parentId: "product-456", type: "text", order: 0, title: {...}, content: [...] }
// └── doc4: { parentId: "product-123", type: "media", order: 2, title: {...}, content: [...] }
//
// Your main collections remain separate:
//
// Collection: "products"  
// ├── product-123: { name, price, category, seo, status, ... }
// └── product-456: { name, price, category, seo, status, ... }

// Benefits:
// ✅ Separation of concerns: You control metadata, PageBuilder controls content
// ✅ Flexible: Use with any entity (products, articles, courses, etc.)
// ✅ Scalable: Each block is an independent document
// ✅ Real-time: Automatic save to Firebase on every change
// ✅ Multi-language: Built-in i18n support