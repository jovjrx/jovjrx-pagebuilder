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

interface ActionsBlockProps {
  block: Block
  theme: PageBuilderTheme
  language: string
}

export function ActionsBlock({ block, theme, language }: ActionsBlockProps) {
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

          {/* Action Buttons */}
          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Button
              size="lg"
              colorScheme="purple"
              as="a"
              href={primary.url}
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
            >
              {getMultiLanguageValue(primary.text, language)}
            </Button>

            {secondary && (
              <Button
                size="lg"
                variant="outline"
                colorScheme="gray"
                as="a"
                href={secondary.url}
              >
                {getMultiLanguageValue(secondary.text, language)}
              </Button>
            )}
          </HStack>

          {/* Benefits */}
          {benefits && benefits.length > 0 && (
            <VStack spacing={2}>
              {benefits.map((benefit, index) => (
                <HStack key={index} spacing={2}>
                  <Box color={theme.colors.primary}>✓</Box>
                  <Text fontSize="sm" color={theme.colors.textSecondary}>
                    {getMultiLanguageValue(benefit, language)}
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
