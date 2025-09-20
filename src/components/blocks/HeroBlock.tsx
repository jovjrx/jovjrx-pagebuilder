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

interface HeroBlockProps {
  block: Block
  theme: PageBuilderTheme
  language: string
  isFirst?: boolean
  isLast?: boolean
}

export function HeroBlock({ block, theme, language, isFirst }: HeroBlockProps) {
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

    const { primary, secondary, benefits, urgency } = actionsContent

    return (
      <VStack spacing={4} align={isMobile ? 'center' : 'start'}>
        {/* Action Buttons */}
        <HStack spacing={4} flexWrap="wrap" justify={isMobile ? 'center' : 'start'}>
          <Button
            size="lg"
            colorScheme={primary.style === 'primary' ? 'purple' : 'gray'}
            variant={primary.style === 'outline' ? 'outline' : 'solid'}
            as="a"
            href={primary.url}
            px={8}
            py={6}
            fontSize="lg"
            fontWeight="bold"
            borderRadius={theme.borderRadius.lg}
            shadow="lg"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'xl',
            }}
            transition="all 0.2s"
          >
            {getMultiLanguageValue(primary.text, language)}
            {primary.price && (
              <Text as="span" ml={2} fontSize="sm" opacity={0.9}>
                {primary.price.currency} {primary.price.amount}
              </Text>
            )}
          </Button>

          {secondary && (
            <Button
              size="lg"
              variant="outline"
              colorScheme="gray"
              as="a"
              href={secondary.url}
              px={6}
              py={6}
              fontSize="md"
              borderRadius={theme.borderRadius.lg}
            >
              {getMultiLanguageValue(secondary.text, language)}
            </Button>
          )}
        </HStack>

        {/* Benefits */}
        {benefits && benefits.length > 0 && (
          <VStack spacing={2} align={isMobile ? 'center' : 'start'}>
            {benefits.map((benefit, index) => (
              <HStack key={index} spacing={2}>
                <Box color={accentColor} fontSize="lg">✓</Box>
                <Text fontSize="sm" color={theme.colors.textSecondary}>
                  {getMultiLanguageValue(benefit, language)}
                </Text>
              </HStack>
            ))}
          </VStack>
        )}

        {/* Urgency */}
        {urgency && (
          <Badge
            colorScheme="red"
            variant="solid"
            px={3}
            py={1}
            borderRadius={theme.borderRadius.md}
            fontSize="sm"
          >
            {getMultiLanguageValue(urgency.message, language)}
          </Badge>
        )}
      </VStack>
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
