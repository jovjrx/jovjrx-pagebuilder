'use client'

import React from 'react'
import {
  VStack,
  Box,
  Text,
  IconButton,
  HStack,
  Badge,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Block } from '../../types'
import { getTranslation, getMultiLanguageValue } from '../../i18n'

interface BlocksListProps {
  blocks: Block[]
  selectedBlock: Block | null
  onSelectBlock: (block: Block) => void
  onDeleteBlock: (blockId: string) => void
  onReorderBlocks: (blocks: Block[]) => void
  language: string
}

export function BlocksList({
  blocks,
  selectedBlock,
  onSelectBlock,
  onDeleteBlock,
  onReorderBlocks,
  language
}: BlocksListProps) {
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, movedBlock)
    onReorderBlocks(newBlocks)
  }

  const getBlockIcon = (blockType: Block['type']) => {
    const icons = {
      hero: '🚀',
      features: '✨',
      testimonials: '💬',
      pricing: '💰',
      faq: '❓',
      stats: '📊',
      cta: '�',
      content: '📝',
      timer: '⏰',
    }
    return icons[blockType] || '📄'
  }

  const getBlockColor = (blockType: Block['type']) => {
    const colors = {
      hero: 'purple',
      features: 'blue',
      testimonials: 'green',
      pricing: 'orange',
      faq: 'cyan',
      stats: 'pink',
      cta: 'yellow',
      content: 'gray',
      timer: 'purple',
    }
    return colors[blockType] || 'gray'
  }

  if (blocks.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500" fontSize="sm">
          {getTranslation('message.noBlocks', language)}
        </Text>
      </Box>
    )
  }

  return (
    <VStack gap={2} align="stretch">
      {blocks.map((block, index) => (
        <Box
          key={block.id || index}
          bg={selectedBlock?.id === block.id ? 'purple.900' : 'gray.800'}
          borderRadius="md"
          p={3}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            bg: selectedBlock?.id === block.id ? 'purple.800' : 'gray.700',
            transform: 'translateY(-1px)',
          }}
          border="2px solid"
          borderColor={selectedBlock?.id === block.id ? 'purple.500' : 'transparent'}
          onClick={() => onSelectBlock(block)}
        >
          <HStack gap={3}>
            {/* Move Controls */}
            <VStack gap={0}>
              <IconButton
                aria-label="Move up"
                size="xs"
                variant="ghost"
                isDisabled={index === 0}
                onClick={(e) => {
                  e.stopPropagation()
                  moveBlock(index, 'up')
                }}
              >
                <ChevronUpIcon />
              </IconButton>
              <IconButton
                aria-label="Move down"
                size="xs"
                variant="ghost"
                isDisabled={index === blocks.length - 1}
                onClick={(e) => {
                  e.stopPropagation()
                  moveBlock(index, 'down')
                }}
              >
                <ChevronDownIcon />
              </IconButton>
            </VStack>

            {/* Block Icon */}
            <Text fontSize="lg">{getBlockIcon(block.type)}</Text>

            {/* Block Info */}
            <VStack gap={1} align="start" flex={1}>
              <HStack gap={2}>
                <Text fontSize="sm" fontWeight="semibold" color="white" noOfLines={1}>
                  {getMultiLanguageValue(block.title, language)}
                </Text>
                <Badge
                  size="sm"
                  colorScheme={getBlockColor(block.type)}
                  variant="subtle"
                >
                  {block.type}
                </Badge>
              </HStack>
              
              <HStack gap={2}>
                <Badge
                  size="xs"
                  colorScheme={block.active ? 'green' : 'red'}
                  variant="solid"
                >
                  {block.active ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge
                  size="xs"
                  colorScheme={block.version === 'published' ? 'blue' : 'yellow'}
                  variant="outline"
                >
                  {block.version === 'published' ? 'Publicado' : 'Rascunho'}
                </Badge>
              </HStack>
            </VStack>

            {/* Actions */}
            <VStack gap={1}>
              <IconButton
                aria-label="Edit block"
                size="xs"
                variant="ghost"
                colorScheme="blue"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectBlock(block)
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="Delete block"
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation()
                  if (block.id && confirm('Tem certeza que deseja excluir este bloco?')) {
                    onDeleteBlock(block.id)
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </VStack>
          </HStack>

          {/* Block Content Info */}
          {block.content.length > 0 && (
            <Box mt={2} pt={2} borderTop="1px solid" borderColor="gray.600">
              <Text fontSize="xs" color="gray.400">
                {block.content.length} elemento{block.content.length !== 1 ? 's' : ''}
              </Text>
            </Box>
          )}
        </Box>
      ))}
    </VStack>
  )
}
