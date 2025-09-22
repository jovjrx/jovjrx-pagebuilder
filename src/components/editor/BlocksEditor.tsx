'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  useToast,
  Spinner,
  Text,
  Select,
  IconButton,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { AddIcon, ViewIcon } from '@chakra-ui/icons'
import { BlocksEditorConfig, Block } from '../../types'
import { 
  initializeFirebase, 
  loadBlocksByParentId, 
  saveBlockStandalone, 
  deleteBlockStandalone,
  reorderBlocksByParentId,
  generateBlockId,
  ensureAnonymousAuth 
} from '../../firebase'
import { getTranslation, supportedLanguages } from '../../i18n'
import { darkPurpleTheme } from '../../themes/dark-purple'
import { BlocksList } from './BlocksList'
import { BlockEditor } from './BlockEditor'

export function BlocksEditor({
  parentId,
  firebaseConfig,
  theme = darkPurpleTheme,
  language = 'pt-BR',
  availableLanguages = ['pt-BR', 'en', 'es'],
  collection = 'blocks',
  onBlocksChange,
  onSave,
  onError,
  onLanguageChange,
  // Customization options
  hideHeader = false,
  hideSaveButton = false,
  hidePreviewButton = false,
  hideLanguageSelector = false,
  autoSave = false,
  customActions,
  saveButtonText,
  saveButtonColor = 'green',
  saveButtonSize = 'sm',
}: BlocksEditorConfig) {
  
  // State
  const [blocks, setBlocks] = useState<Block[]>([])
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  
  // Debounce refs
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasPendingAutoSaveRef = useRef(false)
  
  // UI State
  const toast = useToast()
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure()
  const { isOpen: isBlockTypeModalOpen, onOpen: onBlockTypeModalOpen, onClose: onBlockTypeModalClose } = useDisclosure()
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Initialize Firebase and load blocks
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        initializeFirebase(firebaseConfig)
        // Attempt anonymous auth so Storage rules that require auth will allow uploads
        await ensureAnonymousAuth()
        await loadBlocksData()
      } catch (error) {
        console.error('Error initializing:', error)
        handleError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAndLoad()
  }, [parentId])

  // Cleanup effect for timeouts
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  // Load blocks data
  const loadBlocksData = async () => {
    try {
      const blocksData = await loadBlocksByParentId(parentId, collection)
      setBlocks(blocksData)
      // Auto-select first block on initial load
      if (blocksData.length > 0) {
        setSelectedBlock((prev) => {
          if (!prev) return blocksData[0]
          const stillExists = blocksData.find(b => b.id === prev.id)
          return stillExists || blocksData[0]
        })
      } else {
        setSelectedBlock(null)
      }
      onBlocksChange?.(blocksData)
    } catch (error) {
      console.error('Error loading blocks:', error)
      handleError(error as Error)
    }
  }

  // Save all blocks
  const handleSave = useCallback(async () => {
    // Clear any pending autosave
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
      autoSaveTimeoutRef.current = null
      hasPendingAutoSaveRef.current = false
    }

    setIsSaving(true)
    try {
      // Save each block individually
      for (const block of blocks) {
        await saveBlockStandalone({
          ...block,
          parentId,
        }, collection)
      }

      toast({
        title: getTranslation('message.saved', currentLanguage),
        status: 'success',
        duration: 3000,
      })

      onSave?.(blocks)
    } catch (error) {
      console.error('Error saving blocks:', error)
      handleError(error as Error)
    } finally {
      setIsSaving(false)
    }
  }, [blocks, parentId, collection, currentLanguage, toast, onSave])

  // Handle errors
  const handleError = (error: Error) => {
    toast({
      title: getTranslation('message.error', currentLanguage),
      description: error.message,
      status: 'error',
      duration: 5000,
    })
    onError?.(error)
  }

  // Language change
  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage)
    onLanguageChange?.(newLanguage)
  }

  // Add new block
  const handleAddBlock = async (blockType: Block['type']) => {
    const newBlock: Block = {
      id: generateBlockId(),
      type: blockType,
      kind: 'section',
      title: { [currentLanguage]: getTranslation(`block.${blockType}`, currentLanguage) },
      content: [],
      order: blocks.length,
      active: true,
      version: 'draft',
      parentId,
    }
    
    try {
      // Save immediately to Firebase
      await saveBlockStandalone(newBlock, collection)
      
      const updatedBlocks = [...blocks, newBlock]
      setBlocks(updatedBlocks)
      setSelectedBlock(newBlock)
      onBlocksChange?.(updatedBlocks)
      
      toast({
        title: `${getTranslation(`block.${blockType}`, currentLanguage)} adicionado`,
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      console.error('Error adding block:', error)
      handleError(error as Error)
    }
  }

  // Update block with debounced autosave
  const handleUpdateBlock = useCallback(async (updatedBlock: Block) => {
    try {
      // Update state immediately for responsive UI
      const updatedBlocks = blocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      )
      setBlocks(updatedBlocks)
      setSelectedBlock(updatedBlock)
      onBlocksChange?.(updatedBlocks)
      
      // Handle autosave with debounce
      if (autoSave) {
        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current)
        }
        
        // Set pending flag
        hasPendingAutoSaveRef.current = true
        
        // Setup debounced save (1.5 seconds)
        autoSaveTimeoutRef.current = setTimeout(async () => {
          try {
            await saveBlockStandalone({
              ...updatedBlock,
              parentId,
            }, collection)
            
            toast({
              title: 'Auto-salvo',
              status: 'success',
              duration: 1000,
            })
          } catch (error) {
            console.error('Error in autosave:', error)
            handleError(error as Error)
          } finally {
            hasPendingAutoSaveRef.current = false
            autoSaveTimeoutRef.current = null
          }
        }, 1500) // 1.5 second debounce
      }
    } catch (error) {
      console.error('Error updating block:', error)
      handleError(error as Error)
    }
  }, [blocks, autoSave, parentId, collection, onBlocksChange, toast])

  // Delete block
  const handleDeleteBlock = async (blockId: string) => {
    try {
      // Delete from Firebase
      await deleteBlockStandalone(blockId, collection)
      
      const updatedBlocks = blocks.filter(block => block.id !== blockId)
      setBlocks(updatedBlocks)
      onBlocksChange?.(updatedBlocks)
      
      if (selectedBlock?.id === blockId) {
        setSelectedBlock(null)
      }
      
      toast({
        title: 'Bloco removido',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      console.error('Error deleting block:', error)
      handleError(error as Error)
    }
  }

  // Reorder blocks
  const handleReorderBlocks = async (newBlocks: Block[]) => {
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }))
    
    try {
      // Update order in Firebase
      await reorderBlocksByParentId(parentId, reorderedBlocks, collection)
      
      setBlocks(reorderedBlocks)
      onBlocksChange?.(reorderedBlocks)
    } catch (error) {
      console.error('Error reordering blocks:', error)
      handleError(error as Error)
    }
  }

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" />
          <Text color="gray.400">{getTranslation('message.loading', currentLanguage)}</Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box bg="gray.900" minH="100vh" color="white">
      {/* Header */}
      {!hideHeader && (
        <Box bg="gray.800" borderBottom="1px solid" borderColor="gray.700" px={6} py={4}>
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Heading size="md" color="purple.300">
                {getTranslation('editor.blocks', currentLanguage)} - {parentId}
              </Heading>
            </HStack>

            <HStack spacing={3}>
              {/* Preview/Edit Toggle */}
              <Button
                size="sm"
                leftIcon={<ViewIcon />}
                colorScheme={isPreviewMode ? 'green' : 'gray'}
                variant={isPreviewMode ? 'solid' : 'outline'}
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? 'Visualização' : 'Edição'}
              </Button>

              {/* Language Selector */}
              {!hideLanguageSelector && (
                <Select
                  value={currentLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  size="sm"
                  w="150px"
                  bg="gray.700"
                  borderColor="gray.600"
                >
                  {availableLanguages.map(lang => (
                    <option key={lang} value={lang}>
                      {supportedLanguages[lang as keyof typeof supportedLanguages]}
                    </option>
                  ))}
                </Select>
              )}

              {/* Action Buttons */}
              {!hidePreviewButton && (
                <IconButton
                  aria-label="Preview"
                  icon={<ViewIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={onPreviewOpen}
                />
              )}

              {!hideSaveButton && !autoSave && (
                <Button
                  onClick={handleSave}
                  isLoading={isSaving}
                  loadingText={getTranslation('message.loading', currentLanguage)}
                  colorScheme={saveButtonColor}
                  size={saveButtonSize}
                >
                  {saveButtonText || getTranslation('editor.save', currentLanguage)}
                </Button>
              )}

              {/* Custom Actions */}
              {customActions}
            </HStack>
          </HStack>
        </Box>
      )}

  {/* Main Content - Vertical layout with top carousel and editor below (page scroll enabled) */}
  <VStack align="stretch" spacing={4} p={4}>
        {/* Horizontal Blocks Carousel */}
        <Box position="relative">
          {/* Edge fade */}
          <Box position="absolute" left={0} top={0} bottom={0} w="32px" bgGradient="linear(to-r, rgba(17,24,39,1), rgba(17,24,39,0))" pointerEvents="none" zIndex={1} />
          <Box position="absolute" right={0} top={0} bottom={0} w="32px" bgGradient="linear(to-l, rgba(17,24,39,1), rgba(17,24,39,0))" pointerEvents="none" zIndex={1} />

          <HStack
            spacing={3}
            overflowX="auto"
            py={3}
            px={2}
            sx={{
              scrollSnapType: 'x mandatory',
              '& > *': { scrollSnapAlign: 'start' },
              '::-webkit-scrollbar': { height: '8px' },
              '::-webkit-scrollbar-thumb': { background: '#3b3b3b', borderRadius: '999px' },
              '::-webkit-scrollbar-track': { background: '#1f2937' },
            }}
          >
            {blocks.map((block) => (
              <Box
                key={block.id}
                minW="240px"
                maxW="240px"
                bg={selectedBlock?.id === block.id ? 'purple.700' : 'gray.800'}
                border="1px solid"
                borderColor={selectedBlock?.id === block.id ? 'purple.400' : 'gray.700'}
                borderRadius="lg"
                p={4}
                cursor="pointer"
                onClick={() => setSelectedBlock(block)}
                _hover={{ borderColor: 'purple.300' }}
              >
                <HStack justify="space-between" mb={2}>
                  <Heading size="sm" noOfLines={1}>
                    {block.title?.[currentLanguage] || Object.values(block.title || {})[0] || 'Sem título'}
                  </Heading>
                  <Text fontSize="xs" opacity={0.8}>
                    {block.type.toUpperCase()}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.300" noOfLines={2}>
                  {block.description?.[currentLanguage] || block.subtitle?.[currentLanguage] || ''}
                </Text>
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Full-width Add Block bar below carousel */}
        <Box>
          <Button
            w="full"
            leftIcon={<AddIcon />}
            colorScheme="purple"
            variant="solid"
            size="sm"
            onClick={onBlockTypeModalOpen}
          >
            {getTranslation('editor.addBlock', currentLanguage)}
          </Button>
        </Box>

        {/* Block Editor */}
        <Box flex={1} bg="gray.900">
          {selectedBlock ? (
            <BlockEditor
              block={selectedBlock}
              onUpdateBlock={handleUpdateBlock}
              language={currentLanguage}
            />
          ) : (
            <Box p={8} textAlign="center">
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.400">
                  {blocks.length === 0 
                    ? getTranslation('message.noBlocks', currentLanguage)
                    : 'Selecione um bloco para editar'
                  }
                </Text>
                
                {blocks.length === 0 && (
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="purple"
                    onClick={() => handleAddBlock('hero')}
                  >
                    {getTranslation('editor.addBlock', currentLanguage)}
                  </Button>
                )}
              </VStack>
            </Box>
          )}
        </Box>
      </VStack>

      {/* Block Type Selection Modal */}
      <Modal isOpen={isBlockTypeModalOpen} onClose={onBlockTypeModalClose} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Escolher Tipo de Bloco</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={3}>
              <Button
                w="full"
                leftIcon={<Text fontSize="lg">🚀</Text>}
                onClick={() => { handleAddBlock('hero'); onBlockTypeModalClose() }}
                colorScheme="purple"
                justifyContent="flex-start"
              >
                Hero - Seção principal/banner
              </Button>
              <Button
                w="full"
                leftIcon={<Text fontSize="lg">⭐</Text>}
                onClick={() => { handleAddBlock('content'); onBlockTypeModalClose() }}
                colorScheme="green"
                justifyContent="flex-start"
              >
                Features - Lista de recursos (Conteúdo)
              </Button>
              <Button
                w="full"
                leftIcon={<Text fontSize="lg">🎯</Text>}
                onClick={() => { handleAddBlock('cta'); onBlockTypeModalClose() }}
                colorScheme="yellow"
                justifyContent="flex-start"
              >
                CTA - Call to Action
              </Button>
              <Button
                w="full"
                leftIcon={<Text fontSize="lg">📝</Text>}
                onClick={() => { handleAddBlock('content'); onBlockTypeModalClose() }}
                colorScheme="blue"
                justifyContent="flex-start"
              >
                Conteúdo - Bloco genérico flexível
              </Button>
              {/* Timer is handled as a content element inside blocks, not as a standalone block type */}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="full">
        <ModalOverlay />
        <ModalContent bg="white">
          <ModalHeader bg="gray.800" color="white">
            {getTranslation('editor.preview', currentLanguage)}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={0}>
            <Box p={8} textAlign="center">
              <Text>Preview functionality coming soon...</Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}