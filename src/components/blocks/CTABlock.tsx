'use client'

import React from 'react'
import { Box, VStack, HStack, Heading, Text, Button, Container } from '@chakra-ui/react'
import { Block, PageBuilderTheme, TextContent, ActionsContent, ActionContent } from '../../types'
import { HTMLContent } from '../ui/HTMLContent'

interface CTABlockProps {
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

export const CTABlock: React.FC<CTABlockProps> = ({
  block,
  theme,
  language,
  onPurchase,
  onAddToCart,
  purchaseButton,
  customPurchaseButton,
}) => {
  // Get text and actions content
  const textContent = block.content.find(c => c.type === 'text') as TextContent
  const actionsContent = block.content.find(c => c.type === 'actions') as ActionsContent

  // Get multilingual content
  const getContent = (content: any) => {
    if (!content) return ''
    return typeof content === 'string' ? content : content[language] || content['pt'] || ''
  }

  const title = getContent(block.title)
  const subtitle = getContent(block.subtitle)
  const description = getContent(block.description)
  const textData = textContent ? getContent(textContent.value) : ''

  // Handle button actions
  const handleAction = async (action: ActionContent) => {
    if (action.action === 'buy' && onPurchase && action.price) {
      await onPurchase('default', { price: action.price })
    } else if (action.action === 'link' && action.url) {
      window.open(action.url, '_self')
    }
  }

  return (
    <Box
      bg={block.theme?.background || theme.colors.primary}
      color={block.theme?.text || theme.colors.text}
      py={{ base: 16, md: 24 }}
      px={4}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient: `linear(135deg, ${block.theme?.background || theme.colors.primary}BB, ${theme.colors.secondary}DD)`,
        zIndex: 0,
      }}
    >
      <Container maxW="4xl" position="relative" zIndex={1}>
        <VStack spacing={8} textAlign="center">
          {/* Title */}
          {title && (
            <Heading
              size="2xl"
              fontWeight="bold"
              lineHeight="shorter"
              maxW="800px"
            >
              {title}
            </Heading>
          )}

          {/* Subtitle */}
          {subtitle && (
            <Heading
              size="lg"
              fontWeight="medium"
              opacity={0.9}
              maxW="600px"
            >
              {subtitle}
            </Heading>
          )}

          {/* Description */}
          {description && (
            <Text
              fontSize="lg"
              opacity={0.8}
              maxW="500px"
              lineHeight="tall"
            >
              {description}
            </Text>
          )}

          {/* Text Content */}
          {textData && (
            <Box maxW="600px" opacity={0.9}>
              <HTMLContent content={textData} />
            </Box>
          )}

          {/* Actions */}
          {actionsContent && (
            <VStack spacing={4}>
              <HStack 
                spacing={4} 
                flexWrap="wrap" 
                justify="center"
                align="center"
              >
                {/* Primary Action */}
                {actionsContent.primary && (
                  <Box>
                    {actionsContent.primary.action === 'buy' && customPurchaseButton ? (
                      <Box onClick={() => handleAction(actionsContent.primary)}>
                        {customPurchaseButton}
                      </Box>
                    ) : (
                      <Button
                        size="lg"
                        px={8}
                        py={6}
                        fontSize="lg"
                        fontWeight="bold"
                        borderRadius="xl"
                        bg={actionsContent.primary.style === 'primary' ? 
                          (block.theme?.accent || theme.colors.accent) : 
                          'transparent'
                        }
                        color={actionsContent.primary.style === 'primary' ? 
                          theme.colors.background : 
                          'inherit'
                        }
                        border="2px solid"
                        borderColor={actionsContent.primary.style === 'primary' ? 
                          'transparent' : 
                          (block.theme?.accent || theme.colors.accent)
                        }
                        _hover={{
                          bg: actionsContent.primary.style === 'primary' ? 
                            theme.colors.background : 
                            (block.theme?.accent || theme.colors.accent),
                          color: actionsContent.primary.style === 'primary' ? 
                            (block.theme?.accent || theme.colors.accent) : 
                            theme.colors.background,
                          transform: 'translateY(-2px)',
                          boxShadow: 'xl',
                        }}
                        transition="all 0.3s ease"
                        onClick={() => handleAction(actionsContent.primary)}
                      >
                        {getContent(actionsContent.primary.text)}
                        {actionsContent.primary.price && (
                          <Text as="span" ml={2} fontWeight="normal">
                            - {actionsContent.primary.price.currency} {actionsContent.primary.price.amount}
                          </Text>
                        )}
                      </Button>
                    )}
                  </Box>
                )}

                {/* Secondary Action */}
                {actionsContent.secondary && (
                  <Button
                    size="lg"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="xl"
                    bg="transparent"
                    color="inherit"
                    border="2px solid"
                    borderColor="currentColor"
                    _hover={{
                      bg: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.3s ease"
                    onClick={() => actionsContent.secondary && handleAction(actionsContent.secondary)}
                  >
                    {getContent(actionsContent.secondary.text)}
                  </Button>
                )}
              </HStack>

              {/* Benefits */}
              {actionsContent.benefits && actionsContent.benefits.length > 0 && (
                <VStack spacing={2} mt={4}>
                  {actionsContent.benefits.map((benefit, index) => (
                    <Text key={index} fontSize="sm" opacity={0.8} textAlign="center">
                      ✓ {getContent(benefit)}
                    </Text>
                  ))}
                </VStack>
              )}

              {/* Urgency */}
              {actionsContent.urgency && (
                <Box
                  bg="rgba(255,255,255,0.1)"
                  px={4}
                  py={2}
                  borderRadius="md"
                  mt={4}
                >
                  <Text fontSize="sm" fontWeight="bold" textAlign="center">
                    {getContent(actionsContent.urgency.message)}
                  </Text>
                </Box>
              )}

              {/* Purchase button config disclaimer */}
              {purchaseButton && actionsContent.primary?.action === 'buy' && (
                <Text fontSize="sm" opacity={0.7}>
                  {getContent(purchaseButton.disclaimer) || 'Compra segura garantida'}
                </Text>
              )}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  )
}