'use client'

import React from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Block, PageBuilderTheme, TextContent } from '../../types'
import { getMultiLanguageValue } from '../../i18n'

interface TextBlockProps {
  block: Block
  theme: PageBuilderTheme
  language: string
}

export function TextBlock({ block, theme, language }: TextBlockProps) {
  const textContent = block.content.filter(c => c.type === 'text') as TextContent[]
  
  const containerMaxW = useBreakpointValue({ base: 'container.sm', md: 'container.md' })
  const textAlign = block.layout?.align || 'center'
  
  const bg = block.theme?.background || 'transparent'
  const textColor = block.theme?.text || theme.colors.text

  return (
    <Box bg={bg} py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
      <Container maxW={containerMaxW}>
        <VStack spacing={6} textAlign={textAlign as any}>
          {textContent.map((content, index) => {
            const text = getMultiLanguageValue(content.value, language)
            
            switch (content.variant) {
              case 'heading':
                return (
                  <Heading key={index} size="xl" color={textColor}>
                    {text}
                  </Heading>
                )
              case 'subtitle':
                return (
                  <Heading key={index} size="lg" color={theme.colors.primary}>
                    {text}
                  </Heading>
                )
              case 'paragraph':
                return (
                  <Text key={index} fontSize="lg" color={theme.colors.textSecondary} lineHeight="tall">
                    {text}
                  </Text>
                )
              case 'caption':
                return (
                  <Text key={index} fontSize="sm" color={theme.colors.textSecondary}>
                    {text}
                  </Text>
                )
              case 'kpi':
                return (
                  <Text key={index} fontSize="4xl" fontWeight="bold" color={theme.colors.primary}>
                    {text}
                  </Text>
                )
              default:
                return (
                  <Text key={index} color={textColor}>
                    {text}
                  </Text>
                )
            }
          })}
        </VStack>
      </Container>
    </Box>
  )
}
