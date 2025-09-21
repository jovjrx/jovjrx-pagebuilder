'use client'

import React from 'react'
import { Box, VStack, Heading, Text, Container, Grid, SimpleGrid, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Avatar } from '@chakra-ui/react'
import { Block, PageBuilderTheme, TextContent, MediaContentBlock, ListContent, ActionsContent, TimerContent, HTMLContentItem } from '../../types'
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
  const renderContentItem = (content: TextContent | MediaContentBlock | ListContent | ActionsContent | TimerContent | HTMLContentItem) => {
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

      case 'list': {
        const role = content.role
        const items = content.items || []

        if (role === 'faq') {
          return (
            <Box key={key} w="100%" mb={6}>
              <Accordion allowMultiple>
                {items.map((it, i) => (
                  <AccordionItem key={i} border="1px solid" borderColor={block.theme?.border || theme.colors.border} borderRadius="md" mb={2}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">{it.qa ? getContent(it.qa.q) : (it.title ? getContent(it.title) : '')}</Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <Text color={theme.colors.textSecondary}>{it.qa ? getContent(it.qa.a) : (it.text ? getContent(it.text) : '')}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          )
        }

        if (role === 'testimonial') {
          return (
            <Box key={key} w="100%" mb={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {items.map((it, i) => (
                  <Box key={i} p={5} borderWidth="1px" borderColor={block.theme?.border || theme.colors.border} borderRadius="md" bg={block.theme?.background || theme.colors.surface}>
                    <Text fontStyle="italic" mb={3}>“{it.text ? getContent(it.text) : ''}”</Text>
                    <Box display="flex" alignItems="center" gap={3}>
                      {it.media?.kind === 'image' && it.media.url ? (
                        <Avatar size="sm" src={it.media.url} name={it.title ? getContent(it.title) : undefined} />
                      ) : null}
                      <Box>
                        <Text fontWeight="bold">{it.title ? getContent(it.title) : ''}</Text>
                        {it.subtitle && <Text fontSize="sm" color={theme.colors.textSecondary}>{getContent(it.subtitle)}</Text>}
                      </Box>
                    </Box>
                    {typeof it.rating === 'number' && (
                      <Text mt={2} fontSize="sm" color={theme.colors.textSecondary}>⭐ {it.rating}</Text>
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )
        }

        if (role === 'plan') {
          return (
            <Box key={key} w="100%" mb={6}>
              <SimpleGrid columns={{ base: 1, md: items.length > 1 ? 2 : 1 }} spacing={6}>
                {items.map((it, i) => (
                  <Box
                    key={i}
                    p={6}
                    borderWidth="2px"
                    borderColor={it.highlighted ? (block.theme?.accent || theme.colors.accent) : (block.theme?.border || theme.colors.border)}
                    borderRadius="lg"
                    bg={block.theme?.background || theme.colors.surface}
                    boxShadow={it.popular ? 'lg' : 'sm'}
                  >
                    {it.title && (
                      <Heading size="md" mb={1} color={block.theme?.text || theme.colors.text}>
                        {getContent(it.title)}
                      </Heading>
                    )}
                    {it.subtitle && (
                      <Text color={theme.colors.textSecondary} mb={4}>
                        {getContent(it.subtitle)}
                      </Text>
                    )}
                    {it.price && (
                      <Box mb={4}>
                        <Text fontSize="3xl" fontWeight="bold" color={block.theme?.accent || theme.colors.accent}>
                          {it.price.currency} {it.price.amount}
                          {it.price.original && (
                            <Text as="span" ml={2} textDecoration="line-through" fontSize="md" opacity={0.6}>
                              {it.price.currency} {it.price.original}
                            </Text>
                          )}
                        </Text>
                      </Box>
                    )}
                    {Array.isArray(it.features) && it.features.length > 0 && (
                      <VStack align="start" spacing={2} mb={4}>
                        {it.features.map((f, idx) => (
                          <Text key={idx} color={theme.colors.textSecondary}>• {getContent(f)}</Text>
                        ))}
                      </VStack>
                    )}
                    {it.cta && (
                      <ActionRenderer
                        actionsContent={{ type: 'actions', primary: it.cta, order: i + 1 } as ActionsContent}
                        block={block}
                        theme={theme}
                        language={language}
                        onPurchase={onPurchase}
                        onAddToCart={onAddToCart}
                        purchaseButton={purchaseButton}
                        customPurchaseButton={customPurchaseButton}
                        align="center"
                        direction="row"
                        spacing={3}
                      />
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )
        }

        if (role === 'feature') {
          return (
            <Box key={key} w="100%" mb={6}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {items.map((it, i) => (
                  <Box key={i} p={5} borderWidth="1px" borderColor={block.theme?.border || theme.colors.border} borderRadius="md" bg={block.theme?.background || theme.colors.surface}>
                    <Text fontSize="2xl" mb={2}>{(it.meta && it.meta.icon) || '✨'}</Text>
                    {it.title && <Heading size="sm" mb={1} color={block.theme?.text || theme.colors.text}>{getContent(it.title)}</Heading>}
                    {it.text && <Text color={theme.colors.textSecondary}>{getContent(it.text)}</Text>}
                    {it.stat?.value && (
                      <Text mt={2} fontWeight="bold" color={it.stat.color || block.theme?.accent || theme.colors.accent}>{it.stat.value}</Text>
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )
        }

        if (role === 'benefit') {
          return (
            <Box key={key} w="100%" mb={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {items.map((it, i) => (
                  <Box key={i} p={4} borderWidth="1px" borderColor={block.theme?.border || theme.colors.border} borderRadius="md" bg={block.theme?.background || theme.colors.surface}>
                    {it.title && <Text fontWeight="medium" color={block.theme?.text || theme.colors.text}>{getContent(it.title)}</Text>}
                    {Array.isArray(it.tags) && it.tags.length > 0 && (
                      <Text mt={1} fontSize="sm" color={theme.colors.textSecondary}>#{it.tags.join(' #')}</Text>
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )
        }

        if (role === 'stat') {
          return (
            <Box key={key} w="100%" mb={6}>
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
                {items.map((it, i) => (
                  <Box key={i} p={4} textAlign="center" borderRadius="md" borderWidth="1px" borderColor={block.theme?.border || theme.colors.border}>
                    <Text fontSize="3xl" fontWeight="bold" color={it.stat?.color || block.theme?.accent || theme.colors.accent}>
                      {it.stat?.value || ''}
                    </Text>
                    {it.title && <Text fontSize="sm" color={theme.colors.textSecondary}>{getContent(it.title)}</Text>}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )
        }

        if (role === 'detail') {
          return (
            <Box key={key} w="100%" mb={6}>
              <VStack spacing={4} align="stretch">
                {items.map((it, i) => (
                  <Box key={i} p={4} borderWidth="1px" borderColor={block.theme?.border || theme.colors.border} borderRadius="md" bg={block.theme?.background || theme.colors.surface}>
                    {it.title && <Heading size="sm" mb={1} color={block.theme?.text || theme.colors.text}>{getContent(it.title)}</Heading>}
                    {it.text && <Text color={theme.colors.textSecondary}>{getContent(it.text)}</Text>}
                  </Box>
                ))}
              </VStack>
            </Box>
          )
        }

        // Fallback generic list item renderer
        return (
          <Box key={key} w="100%" mb={6}>
            {items.map((item, index) => (
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