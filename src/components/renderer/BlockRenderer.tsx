'use client'

import React from 'react'
import { Box } from '@chakra-ui/react'
import { Block, PageBuilderTheme } from '../../types'
import { HeroBlock } from '../blocks/HeroBlock'
import { FeaturesBlock } from '../blocks/FeaturesBlock'
import { CTABlock } from '../blocks/CTABlock'
import { ContentBlock } from '../blocks/ContentBlock'
// Legacy blocks (deprecated - use ContentBlock instead)
import { TextBlock } from '../blocks/TextBlock'
import { MediaBlock } from '../blocks/MediaBlock'
import { ActionsBlock } from '../blocks/ActionsBlock'
// TODO: Import when implemented
// import { TestimonialsBlock } from '../blocks/TestimonialsBlock'
// import { PricingBlock } from '../blocks/PricingBlock'
// import { FAQBlock } from '../blocks/FAQBlock'
// import { StatsBlock } from '../blocks/StatsBlock'
// import { TimerBlock } from '../blocks/TimerBlock'

interface BlockRendererProps {
  block: Block
  theme: PageBuilderTheme
  language: string
  isFirst?: boolean
  isLast?: boolean
  onPurchase?: (productId: string, productData: any) => void | Promise<void>
  onAddToCart?: (productId: string, productData: any) => void | Promise<void>
  purchaseButton?: any // PurchaseButtonConfig
  customPurchaseButton?: React.ReactNode
}

export function BlockRenderer({ 
  block, 
  theme, 
  language, 
  isFirst = false, 
  isLast = false,
  onPurchase,
  onAddToCart,
  purchaseButton,
  customPurchaseButton
}: BlockRendererProps) {
  // Don't render inactive blocks
  if (!block.active) {
    return null
  }

  // Apply block-specific theme overrides
  const blockTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      ...(block.theme?.background && { background: block.theme.background }),
      ...(block.theme?.text && { text: block.theme.text }),
      ...(block.theme?.accent && { primary: block.theme.accent }),
    }
  }

  // Common props for all blocks
  const commonProps = {
    block,
    theme: blockTheme,
    language,
    isFirst,
    isLast,
    onPurchase,
    onAddToCart,
    purchaseButton,
    customPurchaseButton,
  }

  // Render appropriate block component
  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return <HeroBlock {...commonProps} />
      
      case 'cta':
        return <CTABlock {...commonProps} />
      
      case 'content':
        return <ContentBlock {...commonProps} />
      
      case 'custom':
        // Reuse ContentBlock without automatic header
        return <ContentBlock {...commonProps} hideHeader />
      
      
      
      default:
        // Fallback for unknown block types
        return (
          <Box
            bg={blockTheme.colors.surface}
            color={blockTheme.colors.text}
            p={8}
            textAlign="center"
            borderRadius="md"
            border="2px dashed"
            borderColor={blockTheme.colors.border}
          >
            <Box fontSize="2xl" mb={2}>⚠️</Box>
            <Box fontSize="lg" fontWeight="bold" mb={2}>
              Tipo de bloco desconhecido
            </Box>
            <Box fontSize="sm" color={blockTheme.colors.textSecondary}>
              Tipo: {block.type}
            </Box>
          </Box>
        )
    }
  }

  return (
    <Box
      as="section"
      data-block-type={block.type}
      data-block-id={block.id}
      position="relative"
      // If container is 'none', let the child block control full-bleed layout
      px={block.layout?.container === 'none' ? 0 : undefined}
      py={block.layout?.container === 'none' ? 0 : undefined}
      w="full"
    >
      {renderBlock()}
    </Box>
  )
}
