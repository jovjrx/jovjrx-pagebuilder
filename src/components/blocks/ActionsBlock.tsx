'use client'

import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Text,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Block, PageBuilderTheme, ActionsContent } from '../../types'
import { getMultiLanguageValue } from '../../i18n'
import { ActionRenderer } from '../shared/ActionRenderer'

interface ActionsBlockProps {
  block: Block
  theme: PageBuilderTheme
  language: string
  onPurchase?: (productId: string, productData: any) => void | Promise<void>
  onAddToCart?: (productId: string, productData: any) => void | Promise<void>
  purchaseButton?: any // PurchaseButtonConfig
  customPurchaseButton?: React.ReactNode
}

export function ActionsBlock({ block, theme, language, onPurchase, onAddToCart, purchaseButton, customPurchaseButton }: ActionsBlockProps) {
  const actionsContent = block.content.find(c => c.type === 'actions') as ActionsContent | undefined
  
  if (!actionsContent) return null

  const { primary, secondary, benefits, urgency } = actionsContent
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  const bg = block.theme?.background || theme.colors.surface
  const textColor = block.theme?.text || theme.colors.text

  return (
    <Box bg={bg} py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
      <Container maxW="container.md">
        <VStack spacing={8} textAlign="center">
          {/* Urgency */}
          {urgency && (
            <Badge colorScheme="red" variant="solid" px={4} py={2} fontSize="md">
              {getMultiLanguageValue(urgency.message, language)}
            </Badge>
          )}

          {/* Block Title */}
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              {getMultiLanguageValue(block.title, language)}
            </Text>
            {block.description && (
              <Text color={theme.colors.textSecondary}>
                {getMultiLanguageValue(block.description, language)}
              </Text>
            )}
          </VStack>

          {/* Actions using ActionRenderer */}
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
      </Container>
    </Box>
  )
}
