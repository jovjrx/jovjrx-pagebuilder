// Exemplos de uso do PurchaseButton integrado ao PageBuilder
import React from 'react'
import { BlocksRenderer, PurchaseButton } from 'jovjrx-pagebuilder'

// 🛒 USO INTEGRADO NO BLOCKSRENDERER
export function PaginaProdutoComCompra({ produtoId }: { produtoId: string }) {
  
  // Lógica de compra personalizada
  const handlePurchase = async (productId: string, productData: any) => {
    console.log('🛒 Iniciando compra:', productData)
    
    try {
      // Sua lógica de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          amount: productData.price.amount,
          currency: productData.price.currency,
          productName: productData.productName
        })
      })
      
      if (response.ok) {
        const { checkoutUrl } = await response.json()
        // Redirecionar para checkout (Stripe, PagSeguro, etc.)
        window.location.href = checkoutUrl
      } else {
        throw new Error('Erro ao processar compra')
      }
    } catch (error) {
      console.error('Erro na compra:', error)
      alert('Erro ao processar compra. Tente novamente.')
    }
  }
  
  // Lógica de adicionar ao carrinho
  const handleAddToCart = async (productId: string, productData: any) => {
    console.log('🛍️ Adicionando ao carrinho:', productData)
    
    try {
      // Adicionar ao carrinho local/API
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cart.push(productData)
      localStorage.setItem('cart', JSON.stringify(cart))
      
      // Atualizar contador do carrinho
      updateCartCount(cart.length)
      
      alert(`${productData.productName} adicionado ao carrinho!`)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    }
  }

  return (
    <div className="product-page">
      <header className="product-header">
        <h1>Produto: {produtoId}</h1>
        <nav>Home / Produtos / {produtoId}</nav>
      </header>

      {/* Os blocos do produto com integração automática de compra */}
      <main>
        <BlocksRenderer
          parentId={produtoId}
          firebaseConfig={firebaseConfig}
          collection="product_blocks"
          language="pt-BR"
          mode="light"
          widthContainer="1200px"
          
          // 🎯 CALLBACKS DE COMPRA AUTOMÁTICOS:
          onPurchase={handlePurchase}
          onAddToCart={handleAddToCart}
          
          onLoad={(blocks) => {
            console.log(`✅ ${blocks.length} blocos carregados`)
          }}
        />
      </main>
    </div>
  )
}

// 🛒 USO DIRETO DO PURCHASEBUTTON  
export function ExemploPurchaseButtonDireto() {
  return (
    <div className="produto-card">
      <img src="/produto.jpg" alt="Produto" />
      <h3>Meu Produto Incrível</h3>
      <p>Descrição do produto...</p>
      
      {/* Botão de compra direto */}
      <PurchaseButton
        productId="prod-123"
        productName="Meu Produto Incrível"
        price={{
          amount: 99.90,
          currency: 'BRL',
          original: 199.90
        }}
        
        // Customização visual
        variant="solid"
        size="lg"
        colorScheme="green"
        showPrice={true}
        showOriginalPrice={true}
        showDiscount={true}
        
        // Callbacks
        onPurchase={async (productId, data) => {
          // Redirecionar para Stripe/PagSeguro
          window.location.href = `/checkout/${productId}`
        }}
        
        onAddToCart={async (productId, data) => {
          // Adicionar ao carrinho
          addToCart(data)
        }}
        
        onError={(error) => {
          console.error('Erro:', error)
        }}
      />
    </div>
  )
}

// 🛒 CUSTOMIZAÇÃO AVANÇADA
export function ExemploCustomizado() {
  return (
    <div>
      {/* Botão simples (sem preço visível) */}
      <PurchaseButton
        productId="prod-456"
        productName="Curso Online"
        price={{ amount: 197, currency: 'BRL' }}
        showPrice={false}
        text="🚀 Inscrever-se Agora"
        colorScheme="purple"
        onPurchase={(id, data) => console.log('Compra:', data)}
      />
      
      {/* Botão com elementos customizados */}
      <PurchaseButton
        productId="prod-789"
        productName="E-book Premium"
        price={{ amount: 47, currency: 'BRL', original: 97 }}
        onPurchase={(id, data) => console.log('Compra:', data)}
      >
        {/* Renderização 100% customizada */}
        <div className="custom-purchase-card">
          <h3>🔥 Oferta Especial!</h3>
          <p>E-book Premium</p>
          <div className="price">
            <span className="current">R$ 47</span>
            <span className="original">R$ 97</span>
            <span className="discount">51% OFF</span>
          </div>
          <button className="buy-btn">
            💳 Comprar Agora
          </button>
        </div>
      </PurchaseButton>
    </div>
  )
}

// 🛒 INTEGRAÇÃO COM NEXT.JS (SSR)
export default function PaginaProdutoSSR({ 
  productData, 
  blocksData 
}: { 
  productData: any, 
  blocksData: any[] 
}) {
  return (
    <div>
      <h1>{productData.name}</h1>
      
      {/* Dados pré-carregados no servidor */}
      <BlocksRenderer
        parentId={productData.id}
        firebaseConfig={firebaseConfig}
        collection="product_blocks"
        data={blocksData} // 🎯 Blocos já vêm do servidor
        
        onPurchase={async (productId, data) => {
          // Integração com Stripe
          const stripe = await stripePromise
          const { error } = await stripe.redirectToCheckout({
            sessionId: await createCheckoutSession(productId)
          })
          if (error) console.error(error)
        }}
      />
    </div>
  )
}

// Função para buscar dados no servidor (Next.js)
export async function getServerSideProps({ params }: any) {
  // Buscar dados do produto
  const productData = await fetchProduct(params.id)
  
  // Buscar blocos do PageBuilder
  const blocksData = await loadBlocksByParentId(params.id, 'product_blocks')
  
  return {
    props: {
      productData,
      blocksData
    }
  }
}

// Declarações de tipos
declare const firebaseConfig: any
declare const updateCartCount: (count: number) => void
declare const addToCart: (data: any) => void
declare const stripePromise: any
declare const createCheckoutSession: (productId: string) => Promise<string>
declare const fetchProduct: (id: string) => Promise<any>
declare const loadBlocksByParentId: (parentId: string, collection: string) => Promise<any[]>