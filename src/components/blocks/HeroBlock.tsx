'use client'

import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  AspectRatio,
  Badge,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Block, PageBuilderTheme, TextContent, MediaContentBlock, ActionsContent } from '../../types'
import { getMultiLanguageValue } from '../../i18n'
import { ActionRenderer } from '../shared/ActionRenderer'

interface HeroBlockProps {
  block: Block
  theme: PageBuilderTheme
  language: string
  isFirst?: boolean
  isLast?: boolean
  onPurchase?: (productId: string, productData: any) => void | Promise<void>
  onAddToCart?: (productId: string, productData: any) => void | Promise<void>
  purchaseButton?: any
  customPurchaseButton?: React.ReactNode
}

export function HeroBlock({ block, theme, language, isFirst, onPurchase, onAddToCart, purchaseButton, customPurchaseButton }: HeroBlockProps) {
  // Extract content by type
  const textContent = block.content.filter(c => c.type === 'text') as TextContent[]
  const mediaContent = block.content.find(c => c.type === 'media') as MediaContentBlock | undefined
  const actionsContent = block.content.find(c => c.type === 'actions') as ActionsContent | undefined

  // Get main texts
  const title = getMultiLanguageValue(block.title, language)
  const subtitle = getMultiLanguageValue(block.subtitle || {}, language)
  const description = getMultiLanguageValue(block.description || {}, language)

  // Get additional text content
  const headingText = textContent.find(t => t.variant === 'heading')
  const subtitleText = textContent.find(t => t.variant === 'subtitle')
  const paragraphText = textContent.find(t => t.variant === 'paragraph')
  const kpiText = textContent.find(t => t.variant === 'kpi')

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false })
  const containerMaxW = useBreakpointValue({ base: 'container.sm', md: 'container.lg', lg: 'container.xl' })
  const gridColumns = useBreakpointValue({ base: 1, md: 2 })
  const textAlign = useBreakpointValue({ base: 'center', md: 'left' }) as any

  // Layout variant
  const isStackLayout = block.layout?.variant === 'stack' || isMobile
  const isSplitLayout = block.layout?.variant === 'split' && !isMobile

  // Background and colors
  const bg = block.theme?.background || theme.colors.background
  const textColor = block.theme?.text || theme.colors.text
  const accentColor = block.theme?.accent || theme.colors.primary

  // Render media
  const renderMedia = () => {
    if (!mediaContent) return null

    const { media } = mediaContent

    if (media.kind === 'image') {
      return (
        <AspectRatio ratio={16/9} w="full" maxW="600px">
          <Image
            src={media.url}
            alt={media.alt || title}
            objectFit="cover"
            borderRadius={theme.borderRadius.lg}
            shadow="2xl"
          />
        </AspectRatio>
      )
    }

    if (media.kind === 'video') {
      return (
        <AspectRatio ratio={16/9} w="full" maxW="600px">
          <Box
            as="video"
            controls
            poster={media.poster}
            autoPlay={media.autoplay}
            loop={media.loop}
            muted={media.muted}
            borderRadius={theme.borderRadius.lg}
            shadow="2xl"
          >
            <source src={media.url} type="video/mp4" />
          </Box>
        </AspectRatio>
      )
    }

    if (media.kind === 'youtube') {
      const videoId = media.url.includes('youtube.com') 
        ? media.url.split('v=')[1]?.split('&')[0]
        : media.url.split('youtu.be/')[1]?.split('?')[0]

      return (
        <AspectRatio ratio={16/9} w="full" maxW="600px">
          <Box
            as="iframe"
            src={`https://www.youtube.com/embed/${videoId}`}
            allowFullScreen
            borderRadius={theme.borderRadius.lg}
            shadow="2xl"
          />
        </AspectRatio>
      )
    }

    return null
  }

  // Render actions
  const renderActions = () => {
    if (!actionsContent) return null

    return (
      <ActionRenderer
        actionsContent={actionsContent}
        block={block}
        theme={theme}
        language={language}
        onPurchase={onPurchase}
        onAddToCart={onAddToCart}
        purchaseButton={purchaseButton}
        customPurchaseButton={customPurchaseButton}
        align={isMobile ? 'center' : 'left'}
        direction="column"
        spacing={4}
      />
    )
  }

  // Render content section
  const renderContent = () => (
    <VStack spacing={6} align={isMobile ? 'center' : 'start'} textAlign={textAlign}>
      {/* KPI/Stats */}
      {kpiText && (
        <Badge
          colorScheme="purple"
          variant="subtle"
          px={4}
          py={2}
          borderRadius={theme.borderRadius.lg}
          fontSize="md"
          fontWeight="bold"
        >
          {getMultiLanguageValue(kpiText.value, language)}
        </Badge>
      )}

      {/* Main Heading */}
      <Heading
        size={isMobile ? 'xl' : '2xl'}
        color={textColor}
        lineHeight="shorter"
        fontWeight="black"
      >
        {headingText ? getMultiLanguageValue(headingText.value, language) : title}
      </Heading>

      {/* Subtitle */}
      {(subtitleText || subtitle) && (
        <Text
          fontSize={isMobile ? 'lg' : 'xl'}
          color={accentColor}
          fontWeight="semibold"
        >
          {subtitleText ? getMultiLanguageValue(subtitleText.value, language) : subtitle}
        </Text>
      )}

      {/* Description */}
      {(paragraphText || description) && (
        <Text
          fontSize={isMobile ? 'md' : 'lg'}
          color={theme.colors.textSecondary}
          lineHeight="tall"
          maxW="600px"
        >
          {paragraphText ? getMultiLanguageValue(paragraphText.value, language) : description}
        </Text>
      )}

      {/* Actions */}
      {renderActions()}
    </VStack>
  )

  return (
    <Box
      bg={bg}
      py={{ base: 12, md: 20 }}
      px={{ base: 4, md: 6 }}
      minH={isFirst ? { base: '80vh', md: '90vh' } : 'auto'}
      display="flex"
      alignItems="center"
    >
      <Container maxW={containerMaxW} w="full">
        {isStackLayout ? (
          // Stack Layout (Mobile + Stack variant)
          <VStack spacing={10} textAlign="center">
            {renderContent()}
            {renderMedia()}
          </VStack>
        ) : (
          // Split Layout (Desktop)
          <SimpleGrid columns={gridColumns} spacing={12} alignItems="center">
            <Box order={block.layout?.align === 'end' ? 2 : 1}>
              {renderContent()}
            </Box>
            <Box order={block.layout?.align === 'end' ? 1 : 2}>
              {renderMedia()}
            </Box>
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}
