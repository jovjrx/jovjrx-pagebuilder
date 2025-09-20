'use client'

import React from 'react'
import { Box } from '@chakra-ui/react'
import { Block, PageBuilderTheme } from '../../types'
import { HeroBlock } from '../blocks/HeroBlock'
import { FeaturesBlock } from '../blocks/FeaturesBlock'
import { TestimonialsBlock } from '../blocks/TestimonialsBlock'
import { PricingBlock } from '../blocks/PricingBlock'
import { FAQBlock } from '../blocks/FAQBlock'
import { StatsBlock } from '../blocks/StatsBlock'
import { TextBlock } from '../blocks/TextBlock'
import { MediaBlock } from '../blocks/MediaBlock'
import { ListBlock } from '../blocks/ListBlock'
import { ActionsBlock } from '../blocks/ActionsBlock'
import { TimerBlock } from '../blocks/TimerBlock'

interface BlockRendererProps {
  block: Block
  theme: PageBuilderTheme
  language: string
  isFirst?: boolean
  isLast?: boolean
}

export function BlockRenderer({ 
  block, 
  theme, 
  language, 
  isFirst = false, 
  isLast = false 
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
  }

  // Render appropriate block component
  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return <HeroBlock {...commonProps} />
      
      case 'features':
        return <FeaturesBlock {...commonProps} />
      
      case 'testimonials':
        return <TestimonialsBlock {...commonProps} />
      
      case 'pricing':
        return <PricingBlock {...commonProps} />
      
      case 'faq':
        return <FAQBlock {...commonProps} />
      
      case 'stats':
        return <StatsBlock {...commonProps} />
      
      case 'text':
        return <TextBlock {...commonProps} />
      
      case 'media':
        return <MediaBlock {...commonProps} />
      
      case 'list':
        return <ListBlock {...commonProps} />
      
      case 'actions':
        return <ActionsBlock {...commonProps} />
      
      case 'timer':
        return <TimerBlock {...commonProps} />
      
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
    >
      {renderBlock()}
    </Box>
  )
}
