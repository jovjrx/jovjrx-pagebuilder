'use client'

import React from 'react'
import { Box, VStack, Heading, Text, Container, Grid, SimpleGrid, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { Block, PageBuilderTheme, TextContent, MediaContentBlock, ListContent, ActionsContent, TimerContent, FeaturesContent, StatisticsContent, DetailsContent, TestimonialsContent, HTMLContentItem } from '../../types'
import { HTMLContent } from '../ui/HTMLContent'
import { TextBlock } from './TextBlock'
import { MediaBlock } from './MediaBlock'
import { ActionsBlock } from './ActionsBlock'
import { ActionRenderer } from '../shared/ActionRenderer'

interface ContentBlockProps {
  block: Block
  theme: PageBuilderTheme
  language: string
  isFirst?: boolean
  isLast?: boolean
  hideHeader?: boolean
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
  hideHeader,
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
  const renderContentItem = (content: TextContent | MediaContentBlock | ListContent | ActionsContent | TimerContent | FeaturesContent | StatisticsContent | DetailsContent | TestimonialsContent | HTMLContentItem) => {
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

      case 'features': {
        const items = content.items || []
        return (
          <Box key={key} w="100%" mb={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {items.map((it, i) => (
                <Box key={i} p={5} borderWidth="1px" borderColor={block.theme?.border || theme.colors.border} borderRadius="md" bg={block.theme?.background || theme.colors.surface}>
                  <Text fontSize="2xl" mb={2}>{it.icon || '✨'}</Text>
                  <Heading size="sm" mb={1} color={block.theme?.text || theme.colors.text}>{getContent(it.title)}</Heading>
                  {it.text && <Text color={theme.colors.textSecondary}>{getContent(it.text)}</Text>}
                  {it.badge && (
                    <Box mt={3} as="span" px={2} py={1} borderRadius="md" border="1px solid" borderColor={block.theme?.border || theme.colors.border} fontSize="xs">
                      {getContent(it.badge)}
                    </Box>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )
      }

      case 'statistics': {
        const items = content.items || []
        return (
          <Box key={key} w="100%" mb={6}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              {items.map((it, i) => (
                <Box key={i} p={4} textAlign="center" borderRadius="md" borderWidth="1px" borderColor={block.theme?.border || theme.colors.border}>
                  <Text fontSize="3xl" fontWeight="bold" color={it.color || block.theme?.accent || theme.colors.accent}>{it.value}{it.unit ? ` ${it.unit}` : ''}</Text>
                  <Text fontSize="sm" color={theme.colors.textSecondary}>{getContent(it.label)}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )
      }

      case 'details': {
        const items = content.items || []
        const useAccordion = content.accordion
        return (
          <Box key={key} w="100%" mb={6}>
            {useAccordion ? (
              <Accordion allowMultiple>
                {items.map((it, i) => (
                  <AccordionItem key={i} border="1px solid" borderColor={block.theme?.border || theme.colors.border} borderRadius="md" mb={2}>
                    <AccordionButton bg="gray.700" _hover={{ bg: 'gray.600' }}>
                      <Box flex="1" textAlign="left">{getContent(it.term)}</Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} bg="gray.750">
                      <Text color={theme.colors.textSecondary}>{getContent(it.description)}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <VStack spacing={4} align="stretch">
                {items.map((it, i) => (
                  <Box key={i}>
                    <Heading size="sm" mb={1} color={block.theme?.text || theme.colors.text}>{getContent(it.term)}</Heading>
                    <Text color={theme.colors.textSecondary}>{getContent(it.description)}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        )
      }

      case 'testimonials': {
        const items = content.items || []
        return (
          <Box key={key} w="100%" mb={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {items.map((it, i) => (
                <Box key={i} p={5} borderWidth="1px" borderColor={block.theme?.border || theme.colors.border} borderRadius="md" bg={block.theme?.background || theme.colors.surface}>
                  <Text fontStyle="italic" mb={3}>“{getContent(it.quote)}”</Text>
                  <Text fontWeight="bold">{it.authorName}</Text>
                  {it.authorRole && <Text fontSize="sm" color={theme.colors.textSecondary}>{it.authorRole}</Text>}
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )
      }

      case 'html': {
        const value = typeof content.value === 'string' ? content.value : getContent(content.value)
        return (
          <Box key={key} w="100%" mb={4}>
            <HTMLContent content={value} />
          </Box>
        )
      }

      case 'actions':
        return (
          <Box key={key} w="100%" mb={4}>
            <ActionRenderer
              actionsContent={content as ActionsContent}
              block={block}
              theme={theme}
              language={language}
              onPurchase={onPurchase}
              onAddToCart={onAddToCart}
              purchaseButton={purchaseButton}
              customPurchaseButton={customPurchaseButton}
              align="center"
              direction="row"
              spacing={4}
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

  // Layout helpers
  const containerMode: 'boxed' | 'fluid' | 'none' = (block.layout?.container as any) || 'boxed'
  const isGrid = block.layout?.variant === 'grid'
  const gapValue = block.layout?.gap || 6

  const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (containerMode === 'none') {
      return <>{children}</>
    }
    if (containerMode === 'fluid') {
      return (
        <Box maxW="100%" mx="auto">
          {children}
        </Box>
      )
    }
    return <Container maxW="4xl">{children}</Container>
  }

  return (
    <Box
      bg={block.theme?.background || theme.colors.background}
      color={block.theme?.text || theme.colors.text}
      py={containerMode === 'none' ? 0 : { base: 12, md: 16 }}
      px={containerMode === 'none' ? 0 : 4}
    >
      <ContentWrapper>
        <VStack spacing={6} align="stretch">
          {/* Block Header */}
          {!hideHeader && (title || subtitle || description) && (
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
            isGrid ? (
              block.layout?.templateColumns ? (
                <Grid templateColumns={block.layout.templateColumns} gap={gapValue}>
                  {sortedContent.map(renderContentItem)}
                </Grid>
              ) : (
                <SimpleGrid columns={block.layout?.gridColumns || 2} spacing={gapValue}>
                  {sortedContent.map(renderContentItem)}
                </SimpleGrid>
              )
            ) : (
              <VStack spacing={6} align="stretch">
                {sortedContent.map(renderContentItem)}
              </VStack>
            )
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
      </ContentWrapper>
    </Box>
  )
}