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
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { AddIcon, SettingsIcon, ViewIcon } from '@chakra-ui/icons'
import { PageBuilderConfig, Page, Block } from '../../types'
import { initializeFirebase, loadPage, savePage, loadBlocks, generatePageId } from '../../firebase'
import { getTranslation, supportedLanguages } from '../../i18n'
import { darkPurpleTheme } from '../../themes/dark-purple'
import { BlocksList } from './BlocksList'
import { BlockEditor } from './BlockEditor'
import { PageSettings } from './PageSettings'

interface PageBuilderProps extends PageBuilderConfig {
  pageId: string
  className?: string
}

export function PageBuilder({
  pageId,
  firebaseConfig,
  theme = darkPurpleTheme,
  language = 'pt-BR',
  availableLanguages = ['pt-BR', 'en', 'es'],
  collection = 'pages',
  onSave,
  onError,
  onLanguageChange,
  className
}: PageBuilderProps) {
  // State
  const [page, setPage] = useState<Page | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  
  // UI State
  const toast = useToast()
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure()
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure()

  // Initialize Firebase and load page
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        initializeFirebase(firebaseConfig)
        await loadPageData()
      } catch (error) {
        console.error('Error initializing:', error)
        handleError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAndLoad()
  }, [pageId])

  // Load page data
  const loadPageData = async () => {
    try {
      const pageData = await loadPage(pageId, collection)
      const blocksData = await loadBlocks(pageId, collection)
      
      if (pageData) {
        setPage(pageData)
        setBlocks(blocksData)
      } else {
        // Create new page
        const newPage: Page = {
          id: pageId,
          title: { [currentLanguage]: 'Nova Página' },
          slug: pageId,
          blocks: [],
          settings: {
            status: 'draft',
            language: currentLanguage,
          }
        }
        setPage(newPage)
        setBlocks([])
      }
    } catch (error) {
      console.error('Error loading page:', error)
      handleError(error as Error)
    }
  }

  // Save page
  const handleSave = async () => {
    if (!page) return

    setIsSaving(true)
    try {
      const pageData = {
        ...page,
        blocks: blocks, // Save full blocks data
      }
      
      await savePage(pageId, pageData, collection)
      
      // Save blocks individually
      for (const block of blocks) {
        if (block.id) {
          await savePage(`${pageId}/blocks/${block.id}`, block, collection)
        }
      }

      toast({
        title: getTranslation('message.saved', currentLanguage),
        status: 'success',
        duration: 3000,
      })

      onSave?.(page)
    } catch (error) {
      console.error('Error saving page:', error)
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
  const handleAddBlock = (blockType: Block['type']) => {
    const newBlock: Block = {
      id: generatePageId(),
      type: blockType,
      kind: 'section',
      title: { [currentLanguage]: getTranslation(`block.${blockType}`, currentLanguage) },
      content: [],
      order: blocks.length,
      active: true,
      version: 'draft',
    }
    
    setBlocks([...blocks, newBlock])
    setSelectedBlock(newBlock)
  }

  // Update block
  const handleUpdateBlock = (updatedBlock: Block) => {
    setBlocks(blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ))
    setSelectedBlock(updatedBlock)
  }

  // Delete block
  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId))
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null)
    }
  }

  // Reorder blocks
  const handleReorderBlocks = (newBlocks: Block[]) => {
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }))
    setBlocks(reorderedBlocks)
  }

  if (isLoading) {
    return (
      <Box className={className} p={8} textAlign="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" />
          <Text color="gray.400">{getTranslation('message.loading', currentLanguage)}</Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box className={className} bg="gray.900" minH="100vh" color="white">
      {/* Header */}
      <Box bg="gray.800" borderBottom="1px solid" borderColor="gray.700" px={6} py={4}>
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Heading size="md" color="purple.300">
              {getTranslation('editor.title', currentLanguage)}
            </Heading>
            <Badge colorScheme={page?.settings.status === 'published' ? 'green' : 'yellow'}>
              {page?.settings.status === 'published' 
                ? getTranslation('editor.publish', currentLanguage)
                : getTranslation('editor.draft', currentLanguage)
              }
            </Badge>
          </HStack>

          <HStack spacing={3}>
            {/* Language Selector */}
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

            {/* Action Buttons */}
            <IconButton
              aria-label="Settings"
              icon={<SettingsIcon />}
              size="sm"
              variant="ghost"
              onClick={onSettingsOpen}
            />
            
            <IconButton
              aria-label="Preview"
              icon={<ViewIcon />}
              size="sm"
              variant="ghost"
              onClick={onPreviewOpen}
            />

            <Button
              onClick={handleSave}
              isLoading={isSaving}
              loadingText={getTranslation('message.loading', currentLanguage)}
              colorScheme="purple"
              size="sm"
            >
              {getTranslation('editor.save', currentLanguage)}
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Main Content */}
      <HStack align="stretch" spacing={0} h="calc(100vh - 73px)">
        {/* Blocks List */}
        <Box w="300px" bg="gray.800" borderRight="1px solid" borderColor="gray.700" overflowY="auto">
          <VStack spacing={4} p={4} align="stretch">
            <Button
              leftIcon={<AddIcon />}
              colorScheme="purple"
              variant="outline"
              size="sm"
              onClick={() => {/* Open block type selector */}}
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
        <Box flex={1} bg="gray.900" overflowY="auto">
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

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>{getTranslation('editor.settings', currentLanguage)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {page && (
              <PageSettings
                page={page}
                onUpdatePage={setPage}
                language={currentLanguage}
              />
            )}
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
            {/* Preview content would go here */}
            <Box p={8} textAlign="center">
              <Text>Preview functionality coming soon...</Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
