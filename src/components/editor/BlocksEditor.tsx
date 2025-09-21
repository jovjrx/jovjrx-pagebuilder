'use client'

import React, { useState, useEffect } from 'react'
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
  generateBlockId 
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
}: BlocksEditorConfig) {
  
  // State
  const [blocks, setBlocks] = useState<Block[]>([])
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  
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

  // Load blocks data
  const loadBlocksData = async () => {
    try {
      const blocksData = await loadBlocksByParentId(parentId, collection)
      setBlocks(blocksData)
      onBlocksChange?.(blocksData)
    } catch (error) {
      console.error('Error loading blocks:', error)
      handleError(error as Error)
    }
  }

  // Save all blocks
  const handleSave = async () => {
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
  }

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

  // Update block
  const handleUpdateBlock = async (updatedBlock: Block) => {
    try {
      // Save immediately to Firebase if autoSave is enabled
      if (autoSave) {
        await saveBlockStandalone({
          ...updatedBlock,
          parentId,
        }, collection)
      }
      
      const updatedBlocks = blocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      )
      setBlocks(updatedBlocks)
      setSelectedBlock(updatedBlock)
      onBlocksChange?.(updatedBlocks)
      
      if (autoSave) {
        toast({
          title: 'Auto-salvo',
          status: 'success',
          duration: 1000,
        })
      }
    } catch (error) {
      console.error('Error updating block:', error)
      handleError(error as Error)
    }
  }

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
                  size="sm"
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

      {/* Main Content */}
      <HStack align="stretch" spacing={0} h={hideHeader ? "100vh" : "calc(100vh - 73px)"}>
        {/* Blocks List */}
        <Box w="300px" bg="gray.800" borderRadius="lg" m={2}>
          <VStack spacing={4} p={4} align="stretch">
            <Button
              leftIcon={<AddIcon />}
              colorScheme="purple"
              variant="outline"
              size="sm"
              onClick={onBlockTypeModalOpen}
            >
              {getTranslation('editor.addBlock', currentLanguage)}
            </Button>

            <Divider borderColor="gray.600" />

            <BlocksList
              blocks={blocks}
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
              onDeleteBlock={handleDeleteBlock}
              onReorderBlocks={handleReorderBlocks}
              language={currentLanguage}
            />
          </VStack>
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
      </HStack>

      {/* Block Type Selection Modal */}
      <Modal isOpen={isBlockTypeModalOpen} onClose={onBlockTypeModalClose}>
        <ModalOverlay />
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
                leftIcon={<Text fontSize="lg">📝</Text>}
                onClick={() => { handleAddBlock('text'); onBlockTypeModalClose() }}
                colorScheme="blue"
                justifyContent="flex-start"
              >
                Texto - Conteúdo textual
              </Button>
              <Button
                w="full"
                leftIcon={<Text fontSize="lg">⭐</Text>}
                onClick={() => { handleAddBlock('features'); onBlockTypeModalClose() }}
                colorScheme="green"
                justifyContent="flex-start"
              >
                Features - Lista de recursos
              </Button>
              <Button
                w="full"
                leftIcon={<Text fontSize="lg">🎬</Text>}
                onClick={() => { handleAddBlock('media'); onBlockTypeModalClose() }}
                colorScheme="orange"
                justifyContent="flex-start"
              >
                Mídia - Imagem/vídeo
              </Button>
              <Button
                w="full"
                leftIcon={<Text fontSize="lg">🛒</Text>}
                onClick={() => { handleAddBlock('actions'); onBlockTypeModalClose() }}
                colorScheme="red"
                justifyContent="flex-start"
              >
                Actions - Botões/CTAs/Compra
              </Button>
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