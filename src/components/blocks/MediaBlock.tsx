'use client'

import React from 'react'
import { Box, Container, AspectRatio, Image } from '@chakra-ui/react'
import { Block, PageBuilderTheme, MediaContentBlock } from '../../types'

interface MediaBlockProps {
  block: Block
  theme: PageBuilderTheme
  language: string
}

export function MediaBlock({ block, theme }: MediaBlockProps) {
  const mediaContent = block.content.find(c => c.type === 'media') as MediaContentBlock | undefined
  
  if (!mediaContent) return null

  const { media } = mediaContent
  const bg = block.theme?.background || 'transparent'

  return (
    <Box bg={bg} py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
      <Container maxW="container.lg">
        <AspectRatio ratio={16/9}>
          {media.kind === 'image' ? (
            <Image
              src={media.url}
              alt={media.alt}
              objectFit="cover"
              borderRadius={theme.borderRadius.lg}
            />
          ) : (
            <Box
              as="video"
              controls
              src={media.url}
              borderRadius={theme.borderRadius.lg}
            />
          )}
        </AspectRatio>
      </Container>
    </Box>
  )
}

// Create other basic blocks
export function TestimonialsBlock({ block, theme, language }: { block: Block, theme: PageBuilderTheme, language: string }) {
  return (
    <Box bg={block.theme?.background || theme.colors.surface} py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
      <Container maxW="container.lg">
        <Box textAlign="center" color={theme.colors.text}>
          Testimonials Block - Em desenvolvimento
        </Box>
      </Container>
    </Box>
  )
}

export function PricingBlock({ block, theme, language }: { block: Block, theme: PageBuilderTheme, language: string }) {
  return (
    <Box bg={block.theme?.background || theme.colors.surface} py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
      <Container maxW="container.lg">
        <Box textAlign="center" color={theme.colors.text}>
          Pricing Block - Em desenvolvimento
        </Box>
      </Container>
    </Box>
  )
}

export function FAQBlock({ block, theme, language }: { block: Block, theme: PageBuilderTheme, language: string }) {
  return (
    <Box bg={block.theme?.background || theme.colors.surface} py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
      <Container maxW="container.lg">
        <Box textAlign="center" color={theme.colors.text}>
          FAQ Block - Em desenvolvimento
        </Box>
      </Container>
    </Box>
  )
}

export function StatsBlock({ block, theme, language }: { block: Block, theme: PageBuilderTheme, language: string }) {
  return (
    <Box bg={block.theme?.background || theme.colors.surface} py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
      <Container maxW="container.lg">
        <Box textAlign="center" color={theme.colors.text}>
          Stats Block - Em desenvolvimento
        </Box>
      </Container>
    </Box>
  )
}

export function ListBlock({ block, theme, language }: { block: Block, theme: PageBuilderTheme, language: string }) {
  return (
    <Box bg={block.theme?.background || theme.colors.surface} py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
      <Container maxW="container.lg">
        <Box textAlign="center" color={theme.colors.text}>
          List Block - Em desenvolvimento
        </Box>
      </Container>
    </Box>
  )
}

export function TimerBlock({ block, theme, language }: { block: Block, theme: PageBuilderTheme, language: string }) {
  return (
    <Box bg={block.theme?.background || theme.colors.surface} py={{ base: 12, md: 16 }} px={{ base: 4, md: 6 }}>
      <Container maxW="container.lg">
        <Box textAlign="center" color={theme.colors.text}>
          Timer Block - Em desenvolvimento
        </Box>
      </Container>
    </Box>
  )
}
