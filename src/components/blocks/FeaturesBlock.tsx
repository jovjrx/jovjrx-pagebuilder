'use client'

import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Block, PageBuilderTheme, ListContent, ActionsContent } from '../../types'
import { getMultiLanguageValue } from '../../i18n'
import { ActionRenderer } from '../shared/ActionRenderer'

interface FeaturesBlockProps {
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

export function FeaturesBlock({ block, theme, language, onPurchase, onAddToCart, purchaseButton, customPurchaseButton }: FeaturesBlockProps) {
  // Extract features from list content
  const featuresContent = block.content.find(c => c.type === 'list' && c.role === 'feature') as ListContent | undefined
  const features = featuresContent?.items || []
  const actionsContent = block.content.find(c => c.type === 'actions') as ActionsContent | undefined

  // Get main texts
  const title = getMultiLanguageValue(block.title, language)
  const subtitle = getMultiLanguageValue(block.subtitle || {}, language)
  const description = getMultiLanguageValue(block.description || {}, language)

  // Responsive values
  const containerMaxW = useBreakpointValue({ base: 'container.sm', md: 'container.lg', lg: 'container.xl' })
  const gridColumns = useBreakpointValue({ 
    base: 1, 
    md: block.layout?.columns === 2 ? 2 : 3,
    lg: block.layout?.columns || 3 
  })
  const textAlign = useBreakpointValue({ base: 'center', md: block.layout?.align || 'center' }) as any

  // Background and colors
  const bg = block.theme?.background || theme.colors.surface
  const textColor = block.theme?.text || theme.colors.text
  const accentColor = block.theme?.accent || theme.colors.primary

  // Feature icons mapping
  const getFeatureIcon = (title: string) => {
    const iconMap: { [key: string]: string } = {
      // Performance
      'velocidade': '⚡',
      'performance': '⚡',
      'rápido': '⚡',
      'speed': '⚡',
      'fast': '⚡',
      
      // Security
      'segurança': '🔒',
      'security': '🔒',
      'proteção': '🛡️',
      'protection': '🛡️',
      
      // Quality
      'qualidade': '⭐',
      'quality': '⭐',
      'excelência': '💎',
      'excellence': '💎',
      
      // Support
      'suporte': '🎧',
      'support': '🎧',
      'ajuda': '💬',
      'help': '💬',
      
      // Growth
      'crescimento': '📈',
      'growth': '📈',
      'resultado': '🎯',
      'results': '🎯',
      
      // Innovation
      'inovação': '🚀',
      'innovation': '🚀',
      'tecnologia': '💻',
      'technology': '💻',
      
      // Default
      'default': '✨'
    }

    const lowerTitle = title.toLowerCase()
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerTitle.includes(key)) {
        return icon
      }
    }
    return iconMap.default
  }

  if (features.length === 0) {
    return null
  }

  return (
    <Box
      bg={bg}
      py={{ base: 12, md: 16 }}
      px={{ base: 4, md: 6 }}
    >
      <Container maxW={containerMaxW}>
        <VStack spacing={12}>
          {/* Header */}
          {(title || subtitle || description) && (
            <VStack spacing={4} textAlign={textAlign} maxW="800px">
              {title && (
                <Heading
                  size={{ base: 'lg', md: 'xl' }}
                  color={textColor}
                  fontWeight="bold"
                >
                  {title}
                </Heading>
              )}
              
              {subtitle && (
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color={accentColor}
                  fontWeight="semibold"
                >
                  {subtitle}
                </Text>
              )}
              
              {description && (
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color={theme.colors.textSecondary}
                  lineHeight="tall"
                >
                  {description}
                </Text>
              )}
            </VStack>
          )}

          {/* Features Grid */}
          <SimpleGrid
            columns={gridColumns}
            spacing={{ base: 8, md: 10 }}
            w="full"
          >
            {features.map((feature, index) => {
              const featureTitle = getMultiLanguageValue(feature.title, language)
              const featureText = getMultiLanguageValue(feature.text || {}, language)
              const featureIcon = getFeatureIcon(featureTitle)

              return (
                <VStack
                  key={index}
                  spacing={4}
                  p={{ base: 6, md: 8 }}
                  bg={theme.colors.background}
                  borderRadius={theme.borderRadius.lg}
                  border="1px solid"
                  borderColor={theme.colors.border}
                  textAlign="center"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'xl',
                    borderColor: accentColor,
                  }}
                  cursor="pointer"
                >
                  {/* Icon */}
                  <Box
                    fontSize="3xl"
                    p={4}
                    bg={accentColor}
                    color="white"
                    borderRadius="full"
                    w="80px"
                    h="80px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    shadow="lg"
                  >
                    {featureIcon}
                  </Box>

                  {/* Title */}
                  <Heading
                    size="md"
                    color={textColor}
                    fontWeight="bold"
                  >
                    {featureTitle}
                  </Heading>

                  {/* Description */}
                  {featureText && (
                    <Text
                      color={theme.colors.textSecondary}
                      lineHeight="tall"
                      fontSize="sm"
                    >
                      {featureText}
                    </Text>
                  )}

                  {/* Stats/KPI */}
                  {feature.stat && (
                    <Box
                      bg={feature.stat.color || accentColor}
                      color="white"
                      px={3}
                      py={1}
                      borderRadius={theme.borderRadius.md}
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      {feature.stat.value}
                    </Box>
                  )}

                  {/* Tags */}
                  {feature.tags && feature.tags.length > 0 && (
                    <HStack spacing={2} flexWrap="wrap" justify="center">
                      {feature.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Box
                          key={tagIndex}
                          bg={theme.colors.surface}
                          color={theme.colors.textSecondary}
                          px={2}
                          py={1}
                          borderRadius={theme.borderRadius.sm}
                          fontSize="xs"
                        >
                          {tag}
                        </Box>
                      ))}
                    </HStack>
                  )}
                </VStack>
              )
            })}
          </SimpleGrid>

          {/* Bottom CTA (if available) */}
          {actionsContent && (
            <VStack spacing={6} textAlign="center">
              <ActionRenderer
                actionsContent={actionsContent}
                block={block}
                theme={theme}
                language={language}
                onPurchase={onPurchase}
                onAddToCart={onAddToCart}
                purchaseButton={purchaseButton}
                customPurchaseButton={customPurchaseButton}
                align="center"
                direction="column"
                spacing={4}
              />
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
