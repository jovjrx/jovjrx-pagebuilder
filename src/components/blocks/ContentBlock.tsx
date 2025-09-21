'use client'

import React from 'react'
import { Box, VStack, Heading, Text, Container } from '@chakra-ui/react'
import { Block, PageBuilderTheme, TextContent, MediaContentBlock, ListContent, ActionsContent, TimerContent } from '../../types'
import { HTMLContent } from '../ui/HTMLContent'
import { TextBlock } from './TextBlock'
import { MediaBlock } from './MediaBlock'
import { ActionsBlock } from './ActionsBlock'

interface ContentBlockProps {
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

export const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  theme,
  language,
  isFirst,
  isLast,
  onPurchase,
  onAddToCart,
  purchaseButton,
  customPurchaseButton,
}) => {
  // Get multilingual content
  const getContent = (content: any) => {
    if (!content) return ''
    return typeof content === 'string' ? content : content[language] || content['pt'] || ''
  }

  const title = getContent(block.title)
  const subtitle = getContent(block.subtitle)
  const description = getContent(block.description)

  // Sort content by order
  const sortedContent = [...block.content].sort((a, b) => a.order - b.order)

  // Render individual content item
  const renderContentItem = (content: TextContent | MediaContentBlock | ListContent | ActionsContent | TimerContent) => {
    const key = `${content.type}-${content.order}`

    switch (content.type) {
      case 'text':
        return (
          <Box key={key} w="100%">
            {content.variant === 'heading' && (
              <Heading 
                size="lg" 
                mb={4}
                color={block.theme?.text || theme.colors.text}
              >
                {getContent(content.value)}
              </Heading>
            )}
            {content.variant === 'subtitle' && (
              <Heading 
                size="md" 
                mb={4}
                color={block.theme?.text || theme.colors.text}
              >
                {getContent(content.value)}
              </Heading>
            )}
            {(content.variant === 'paragraph' || content.variant === 'caption') && (
              <Box mb={4}>
                <HTMLContent content={getContent(content.value)} />
              </Box>
            )}
            {content.variant === 'kpi' && (
              <Box 
                textAlign="center" 
                p={6} 
                bg={block.theme?.accent || theme.colors.accent}
                borderRadius="lg"
                mb={4}
              >
                <Text 
                  fontSize="3xl" 
                  fontWeight="bold"
                  color={theme.colors.background}
                >
                  {getContent(content.value)}
                </Text>
              </Box>
            )}
            {content.variant === 'list' && (
              <Box mb={4}>
                <HTMLContent content={getContent(content.value)} />
              </Box>
            )}
          </Box>
        )

      case 'media':
        // Create a temporary block structure for MediaBlock
        const mediaBlock: Block = {
          ...block,
          content: [content]
        }
        return (
          <Box key={key} w="100%" mb={4}>
            <MediaBlock 
              block={mediaBlock}
              theme={theme}
              language={language}
            />
          </Box>
        )

      case 'list':
        return (
          <Box key={key} w="100%" mb={6}>
            {content.items.map((item, index) => (
              <Box 
                key={index}
                p={4}
                mb={3}
                bg={block.theme?.background || theme.colors.surface}
                borderRadius="md"
                border="1px solid"
                borderColor={block.theme?.border || theme.colors.border}
              >
                {item.title && (
                  <Heading size="sm" mb={2} color={block.theme?.text || theme.colors.text}>
                    {getContent(item.title)}
                  </Heading>
                )}
                {item.subtitle && (
                  <Text color={theme.colors.textSecondary} fontSize="sm" mb={2}>
                    {getContent(item.subtitle)}
                  </Text>
                )}
                {item.text && (
                  <Text color={theme.colors.textSecondary}>
                    {getContent(item.text)}
                  </Text>
                )}
                {item.price && (
                  <Text color={block.theme?.accent || theme.colors.accent} fontWeight="bold" mt={2}>
                    {item.price.currency} {item.price.amount}
                    {item.price.original && (
                      <Text as="span" ml={2} textDecoration="line-through" fontSize="sm" opacity={0.6}>
                        {item.price.currency} {item.price.original}
                      </Text>
                    )}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        )

      case 'actions':
        // Create a temporary block structure for ActionsBlock
        const actionsBlock: Block = {
          ...block,
          content: [content]
        }
        return (
          <Box key={key} w="100%" mb={4}>
            <ActionsBlock 
              block={actionsBlock}
              theme={theme}
              language={language}
            />
          </Box>
        )

      case 'timer':
        return (
          <Box 
            key={key} 
            w="100%" 
            mb={6}
            p={6}
            bg={block.theme?.accent || theme.colors.accent}
            color={theme.colors.background}
            borderRadius="lg"
            textAlign="center"
          >
            <Heading size="md" mb={2}>
              {getContent(content.title)}
            </Heading>
            {content.subtitle && (
              <Text mb={4}>
                {getContent(content.subtitle)}
              </Text>
            )}
            <Box 
              fontSize="2xl" 
              fontWeight="bold"
              fontFamily="monospace"
            >
              {/* Timer implementation would go here */}
              {new Date(content.endDate).toLocaleDateString()}
            </Box>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box
      bg={block.theme?.background || theme.colors.background}
      color={block.theme?.text || theme.colors.text}
      py={{ base: 12, md: 16 }}
      px={4}
    >
      <Container maxW="4xl">
        <VStack spacing={6} align="stretch">
          {/* Block Header */}
          {(title || subtitle || description) && (
            <VStack spacing={4} textAlign="center" mb={8}>
              {title && (
                <Heading 
                  size="xl" 
                  color={block.theme?.text || theme.colors.text}
                >
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Heading 
                  size="md" 
                  color={theme.colors.textSecondary}
                  fontWeight="normal"
                >
                  {subtitle}
                </Heading>
              )}
              {description && (
                <Text 
                  fontSize="lg"
                  color={theme.colors.textSecondary}
                  maxW="600px"
                >
                  {description}
                </Text>
              )}
            </VStack>
          )}

          {/* Block Content */}
          {sortedContent.length > 0 ? (
            <VStack spacing={6} align="stretch">
              {sortedContent.map(renderContentItem)}
            </VStack>
          ) : (
            <Box
              p={8}
              textAlign="center"
              border="2px dashed"
              borderColor={theme.colors.border}
              borderRadius="md"
              color={theme.colors.textSecondary}
            >
              <Text>Este bloco não possui conteúdo ainda</Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  )
}