'use client'

import React from 'react'
import {
  Button,
  VStack,
  HStack,
  Text,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Block, PageBuilderTheme, ActionsContent } from '../../types'
import { getMultiLanguageValue } from '../../i18n'
import { PurchaseButton } from '../ui/PurchaseButton'

interface ActionRendererProps {
  actionsContent: ActionsContent
  block: Block
  theme: PageBuilderTheme
  language: string
  onPurchase?: (productId: string, productData: any) => void | Promise<void>
  onAddToCart?: (productId: string, productData: any) => void | Promise<void>
  purchaseButton?: any // PurchaseButtonConfig
  customPurchaseButton?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  spacing?: number
  direction?: 'row' | 'column'
}

export function ActionRenderer({ 
  actionsContent,
  block,
  theme, 
  language, 
  onPurchase, 
  onAddToCart,
  purchaseButton,
  customPurchaseButton,
  align = 'center',
  spacing = 4,
  direction = 'column'
}: ActionRendererProps) {
  const { primary, secondary, benefits } = actionsContent
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  // Determinar layout responsivo
  const Stack = direction === 'row' ? HStack : VStack
  const alignValue = align === 'left' ? 'start' : align === 'right' ? 'end' : 'center'

  const renderPurchaseButton = () => {
    if (primary.action !== 'buy' || !primary.price || !onPurchase) {
      return null
    }

    // 1. Elemento customizado completo
    if (customPurchaseButton) {
      return customPurchaseButton
    }
    
    // 2. PurchaseButton com configuração personalizada
    if (purchaseButton) {
      return (
        <PurchaseButton
          {...purchaseButton}
          productId={purchaseButton.productId || block.id || 'unknown'}
          productName={purchaseButton.productName || getMultiLanguageValue(block.title, language)}
          price={purchaseButton.price || primary.price}
          onPurchase={purchaseButton.onPurchase || onPurchase}
          onAddToCart={purchaseButton.onAddToCart || onAddToCart}
        />
      )
    }
    
    // 3. PurchaseButton padrão automático
    return (
      <PurchaseButton
        productId={block.id || 'unknown'}
        productName={getMultiLanguageValue(block.title, language)}
        price={primary.price}
        text={getMultiLanguageValue(primary.text, language)}
        colorScheme="purple"
        size="lg"
        onPurchase={onPurchase}
        onAddToCart={onAddToCart}
      />
    )
  }

  const renderLinkButton = () => {
    if (primary.action === 'buy') {
      return null // Será renderizado pelo renderPurchaseButton
    }

    return (
      <Button
        size="lg"
        colorScheme="purple"
        as="a"
        href={primary.url}
        px={8}
        py={6}
        fontSize="lg"
        fontWeight="bold"
      >
        {getMultiLanguageValue(primary.text, language)}
      </Button>
    )
  }

  return (
    <Stack spacing={spacing} align={alignValue} width="100%">
      {/* Primary Action */}
      {primary && (
        <>
          {renderPurchaseButton()}
          {renderLinkButton()}
        </>
      )}

      {/* Secondary Action */}
      {secondary && (
        <Button
          size="lg"
          variant="outline"
          colorScheme="gray"
          as="a"
          href={secondary.url}
        >
          {getMultiLanguageValue(secondary.text, language)}
        </Button>
      )}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <VStack spacing={2} align={alignValue}>
          {benefits.map((benefit, index) => (
            <HStack key={index} spacing={2}>
              <Box color={theme.colors.primary}>✓</Box>
              <Text fontSize="sm" color={theme.colors.textSecondary}>
                {getMultiLanguageValue(benefit, language)}
              </Text>
            </HStack>
          ))}
        </VStack>
      )}
    </Stack>
  )
}