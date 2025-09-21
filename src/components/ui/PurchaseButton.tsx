'use client'

import React from 'react'
import {
  Button,
  ButtonProps,
  HStack,
  VStack,
  Text,
  Badge,
  Box,
  useToast,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

export interface PurchaseButtonConfig {
  // Produto info
  productId: string
  productName: string
  price: {
    amount: number
    currency: string
    original?: number
  }
  
  // Visual customização
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  colorScheme?: string
  text?: string
  loadingText?: string
  
  // Funcionalidades
  showPrice?: boolean
  showOriginalPrice?: boolean
  showDiscount?: boolean
  disabled?: boolean
  
  // Callbacks
  onPurchase: (productId: string, productData: PurchaseData) => void | Promise<void>
  onAddToCart?: (productId: string, productData: PurchaseData) => void | Promise<void>
  onError?: (error: Error) => void
  
  // Customização avançada
  className?: string
  children?: React.ReactNode
}

export interface PurchaseData {
  productId: string
  productName: string
  price: {
    amount: number
    currency: string
  }
  discount?: number
  timestamp: number
}

export function PurchaseButton({
  productId,
  productName,
  price,
  variant = 'solid',
  size = 'lg',
  colorScheme = 'green',
  text,
  loadingText = 'Processando...',
  showPrice = true,
  showOriginalPrice = true,
  showDiscount = true,
  disabled = false,
  onPurchase,
  onAddToCart,
  onError,
  className,
  children,
  ...buttonProps
}: PurchaseButtonConfig & Omit<ButtonProps, keyof PurchaseButtonConfig>) {
  
  const [isLoading, setIsLoading] = React.useState(false)
  const toast = useToast()
  
  // Calcular desconto
  const discount = price.original && price.original > price.amount 
    ? Math.round(((price.original - price.amount) / price.original) * 100)
    : 0

  // Formatação de preço
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD'
    }).format(amount)
  }

  // Handle purchase
  const handlePurchase = async () => {
    if (disabled || isLoading) return
    
    setIsLoading(true)
    
    try {
      const purchaseData: PurchaseData = {
        productId,
        productName,
        price: {
          amount: price.amount,
          currency: price.currency
        },
        discount,
        timestamp: Date.now()
      }
      
      await onPurchase(productId, purchaseData)
      
      toast({
        title: 'Sucesso!',
        description: `${productName} foi processado com sucesso.`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Purchase error:', error)
      onError?.(error as Error)
      
      toast({
        title: 'Erro na compra',
        description: 'Tente novamente em alguns instantes.',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!onAddToCart || disabled || isLoading) return
    
    try {
      const purchaseData: PurchaseData = {
        productId,
        productName,
        price: {
          amount: price.amount,
          currency: price.currency
        },
        discount,
        timestamp: Date.now()
      }
      
      await onAddToCart(productId, purchaseData)
      
      toast({
        title: 'Adicionado ao carrinho!',
        description: `${productName} foi adicionado com sucesso.`,
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      console.error('Add to cart error:', error)
      onError?.(error as Error)
    }
  }

  // Render custom children
  if (children) {
    return (
      <Box className={className} onClick={handlePurchase}>
        {children}
      </Box>
    )
  }

  // Render com preço
  if (showPrice) {
    return (
      <VStack spacing={onAddToCart ? 2 : 3} align="stretch" className={className}>
        {/* Preços */}
        <Box textAlign="center">
          <HStack justify="center" align="baseline" spacing={2}>
            {/* Preço atual */}
            <Text fontSize="2xl" fontWeight="bold" color={`${colorScheme}.500`}>
              {formatPrice(price.amount, price.currency)}
            </Text>
            
            {/* Preço original (riscado) */}
            {showOriginalPrice && price.original && price.original > price.amount && (
              <Text fontSize="lg" textDecoration="line-through" color="gray.500">
                {formatPrice(price.original, price.currency)}
              </Text>
            )}
            
            {/* Badge de desconto */}
            {showDiscount && discount > 0 && (
              <Badge colorScheme="red" fontSize="sm">
                -{discount}%
              </Badge>
            )}
          </HStack>
        </Box>

        {/* Botões */}
        <VStack spacing={2}>
          {/* Botão principal de compra */}
          <Button
            onClick={handlePurchase}
            variant={variant}
            size={size}
            colorScheme={colorScheme}
            isLoading={isLoading}
            loadingText={loadingText}
            disabled={disabled}
            leftIcon={<AddIcon />}
            width="100%"
            {...buttonProps}
          >
            {text || `Comprar ${productName}`}
          </Button>
          
          {/* Botão adicionar ao carrinho (opcional) */}
          {onAddToCart && (
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size={size}
              colorScheme={colorScheme}
              disabled={disabled || isLoading}
              width="100%"
            >
              Adicionar ao Carrinho
            </Button>
          )}
        </VStack>
      </VStack>
    )
  }

  // Render simples (só botão)
  return (
    <Button
      onClick={handlePurchase}
      variant={variant}
      size={size}
      colorScheme={colorScheme}
      isLoading={isLoading}
      loadingText={loadingText}
      disabled={disabled}
      leftIcon={<AddIcon />}
      className={className}
      {...buttonProps}
    >
      {text || `Comprar por ${formatPrice(price.amount, price.currency)}`}
    </Button>
  )
}