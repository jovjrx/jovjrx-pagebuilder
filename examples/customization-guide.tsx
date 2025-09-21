// Documentação completa de como usar e personalizar o BlocksEditor
import React, { useState } from 'react'
import { BlocksEditor, Block } from 'jovjrx-pagebuilder'

// 🎯 USO BÁSICO
export function ExemploBasico({ produtoId }: { produtoId: string }) {
  return (
    <BlocksEditor 
      parentId={produtoId}
      firebaseConfig={meuFirebaseConfig}
      collection="product_blocks"
      language="pt-BR"
    />
  )
}

// ⚙️ PERSONALIZAÇÃO COMPLETA
export function ExemploPersonalizado({ produtoId }: { produtoId: string }) {
  const [blocks, setBlocks] = useState<Block[]>([])
  
  return (
    <div className="meu-layout-customizado">
      {/* SEU HEADER PERSONALIZADO */}
      <header className="product-header">
        <h1>Editando Produto: {produtoId}</h1>
        <div className="actions">
          <button>← Voltar</button>
          <button>💾 Salvar Produto</button>
          <button>👁️ Visualizar</button>
        </div>
      </header>

      {/* BLOCKS EDITOR SEM INTERFACE PRÓPRIA */}
      <BlocksEditor
        parentId={produtoId}
        firebaseConfig={meuFirebaseConfig}
        collection="product_blocks"
        
        // 🎨 CUSTOMIZAÇÕES DISPONÍVEIS:
        hideHeader={true}              // Remove o header do componente
        autoSave={true}                // Salva automaticamente a cada mudança
        hideSaveButton={true}          // Remove botão "Salvar" (usa o seu)
        hidePreviewButton={true}       // Remove botão "Preview" 
        hideLanguageSelector={true}    // Remove seletor de idioma
        
        // 📡 CALLBACKS PERSONALIZADOS:
        onBlocksChange={(blocks) => {
          setBlocks(blocks)
          console.log(`✏️ ${blocks.length} blocos no produto`)
        }}
        
        onSave={(blocks) => {
          console.log('✅ Blocos salvos:', blocks)
          // Aqui você pode:
          // - Mostrar notificação
          // - Redirecionar usuário
          // - Atualizar cache local
          // - Sincronizar com sua API
        }}
        
        onError={(error) => {
          console.error('❌ Erro:', error)
          alert('Erro ao salvar!')
        }}
      />
      
      {/* SEU FOOTER/SIDEBAR PERSONALIZADO */}
      <aside className="product-sidebar">
        <h3>Info do Produto</h3>
        <p>{blocks.length} blocos de conteúdo</p>
        <p>Status: Rascunho</p>
      </aside>
    </div>
  )
}

// 🔧 OUTRAS OPÇÕES DE PERSONALIZAÇÃO
export function OutrasOpcoes({ produtoId }: { produtoId: string }) {
  return (
    <BlocksEditor
      parentId={produtoId}
      firebaseConfig={meuFirebaseConfig}
      collection="product_blocks"
      
      // Customizar texto do botão salvar
      saveButtonText="💾 Salvar Agora"
      
      // Customizar cor do botão salvar
      saveButtonColor="blue" // green, blue, red, purple, etc.
      
      // Adicionar ações customizadas no header
      customActions={
        <div>
          <button>📤 Publicar</button>
          <button>📋 Duplicar</button>
        </div>
      }
      
      // Apenas português (sem seletor)
      language="pt-BR"
      availableLanguages={['pt-BR']}
      hideLanguageSelector={true}
    />
  )
}

// 📊 ESTRUTURA NO FIREBASE
/* 
Collection: "product_blocks"
├── block_1726834567890_abc: { 
│   parentId: "produto-123",
│   type: "hero", 
│   order: 0,
│   title: { "pt-BR": "Hero do Produto" },
│   content: [...]
│ }
├── block_1726834567891_def: {
│   parentId: "produto-123",
│   type: "features",
│   order: 1,
│   title: { "pt-BR": "Características" },
│   content: [...]
│ }
└── block_1726834567892_ghi: {
    parentId: "produto-456",  ← Outro produto
    type: "text",
    order: 0,
    title: { "pt-BR": "Descrição" },
    content: [...]
  }

Suas collections permanecem separadas:
Collection: "products"
├── produto-123: { nome, preco, categoria, seo, status... }
└── produto-456: { nome, preco, categoria, seo, status... }
*/

// 🚀 BENEFÍCIOS
/*
✅ FLEXÍVEL: Use com produtos, artigos, cursos, qualquer coisa
✅ PERFORMÁTICO: Consulta só blocos do parentId específico  
✅ REAL-TIME: Auto-save opcional + callbacks em tempo real
✅ CUSTOMIZÁVEL: Esconda/modifique qualquer parte da interface
✅ SEPARADO: Seus dados ficam separados do page builder
✅ ESCALÁVEL: 300, 3000 ou 30.000 blocos, funciona igual
*/

declare const meuFirebaseConfig: any