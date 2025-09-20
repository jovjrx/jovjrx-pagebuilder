'use client'

import React from 'react'
import {
  VStack,
  Box,
  Text,
  IconButton,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { DeleteIcon, DragHandleIcon, EditIcon } from '@chakra-ui/icons'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
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
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(blocks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onReorderBlocks(items)
  }

  const getBlockIcon = (blockType: Block['type']) => {
    const icons = {
      hero: '🚀',
      features: '✨',
      testimonials: '💬',
      pricing: '💰',
      faq: '❓',
      stats: '📊',
      text: '📝',
      media: '🎬',
      list: '📋',
      actions: '🎯',
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
      text: 'gray',
      media: 'red',
      list: 'teal',
      actions: 'yellow',
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="blocks">
        {(provided) => (
          <VStack
            {...provided.droppableProps}
            ref={provided.innerRef}
            spacing={2}
            align="stretch"
          >
            {blocks.map((block, index) => (
              <Draggable key={block.id || index} draggableId={block.id || `block-${index}`} index={index}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    bg={selectedBlock?.id === block.id ? 'purple.700' : 'gray.700'}
                    borderRadius="md"
                    p={3}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      bg: selectedBlock?.id === block.id ? 'purple.600' : 'gray.600',
                      transform: 'translateY(-1px)',
                    }}
                    border="2px solid"
                    borderColor={selectedBlock?.id === block.id ? 'purple.500' : 'transparent'}
                    opacity={snapshot.isDragging ? 0.8 : 1}
                    transform={snapshot.isDragging ? 'rotate(5deg)' : 'none'}
                    onClick={() => onSelectBlock(block)}
                  >
                    <HStack spacing={3}>
                      {/* Drag Handle */}
                      <Box {...provided.dragHandleProps}>
                        <DragHandleIcon color="gray.400" boxSize={4} />
                      </Box>

                      {/* Block Icon */}
                      <Text fontSize="lg">{getBlockIcon(block.type)}</Text>

                      {/* Block Info */}
                      <VStack spacing={1} align="start" flex={1}>
                        <HStack spacing={2}>
                          <Text fontSize="sm" fontWeight="semibold" color="white">
                            {getMultiLanguageValue(block.title, language)}
                          </Text>
                          <Badge
                            size="sm"
                            colorScheme={getBlockColor(block.type)}
                            variant="subtle"
                          >
                            {getTranslation(`block.${block.type}`, language)}
                          </Badge>
                        </HStack>
                        
                        <HStack spacing={2}>
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
                      <VStack spacing={1}>
                        <IconButton
                          aria-label="Edit block"
                          icon={<EditIcon />}
                          size="xs"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectBlock(block)
                          }}
                        />
                        <IconButton
                          aria-label="Delete block"
                          icon={<DeleteIcon />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (block.id && confirm('Tem certeza que deseja excluir este bloco?')) {
                              onDeleteBlock(block.id)
                            }
                          }}
                        />
                      </VStack>
                    </HStack>

                    {/* Block Preview Info */}
                    {block.content.length > 0 && (
                      <Box mt={2} pt={2} borderTop="1px solid" borderColor="gray.600">
                        <Text fontSize="xs" color="gray.400">
                          {block.content.length} elemento{block.content.length !== 1 ? 's' : ''}
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </VStack>
        )}
      </Droppable>
    </DragDropContext>
  )
}
