'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { PageRendererConfig, Page, Block } from '../../types'
import { initializeFirebase, loadPage, loadBlocks } from '../../firebase'
import { getMultiLanguageValue } from '../../i18n'
import { darkPurpleTheme, lightPurpleTheme } from '../../themes/dark-purple'
import { BlockRenderer } from './BlockRenderer'

interface PageRendererProps extends PageRendererConfig {
  pageId: string
  className?: string
}

export function PageRenderer({
  pageId,
  firebaseConfig,
  theme = darkPurpleTheme,
  language = 'pt-BR',
  mode = 'dark',
  collection = 'pages',
  onLoad,
  onError,
  className
}: PageRendererProps) {
  // State
  const [page, setPage] = useState<Page | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Determine theme
  const currentTheme = typeof theme === 'string' 
    ? (theme === 'light-purple' ? lightPurpleTheme : darkPurpleTheme)
    : theme

  // Apply mode override
  const finalTheme = mode === 'light' && typeof theme === 'string' && theme.includes('dark')
    ? lightPurpleTheme
    : mode === 'dark' && typeof theme === 'string' && theme.includes('light')
    ? darkPurpleTheme
    : currentTheme

  // Initialize Firebase and load page
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        initializeFirebase(firebaseConfig)
        await loadPageData()
      } catch (error) {
        console.error('Error initializing renderer:', error)
        handleError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAndLoad()
  }, [pageId, collection])

  // Load page data
  const loadPageData = async () => {
    try {
      const pageData = await loadPage(pageId, collection)
      
      if (!pageData) {
        throw new Error(`Página não encontrada: ${pageId}`)
      }

      // Check if page is published (unless in preview mode)
      if (pageData.settings.status !== 'published' && !window.location.search.includes('preview=true')) {
        throw new Error('Página não está publicada')
      }

      const blocksData = await loadBlocks(pageId, collection)
      
      // Filter only active blocks and sort by order
      const activeBlocks = blocksData
        .filter(block => block.active && block.version === 'published')
        .sort((a, b) => a.order - b.order)
      
      setPage(pageData)
      setBlocks(activeBlocks)
      
      onLoad?.(pageData)
    } catch (error) {
      console.error('Error loading page:', error)
      handleError(error as Error)
    }
  }

  // Handle errors
  const handleError = (error: Error) => {
    setError(error.message)
    onError?.(error)
  }

  // Loading state
  if (isLoading) {
    return (
      <Box 
        className={className}
        bg={finalTheme.colors.background}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner 
            size="xl" 
            color={finalTheme.colors.primary}
            thickness="4px"
          />
          <Text color={finalTheme.colors.textSecondary}>
            Carregando página...
          </Text>
        </VStack>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box 
        className={className}
        bg={finalTheme.colors.background}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
      >
        <Alert 
          status="error" 
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          maxW="md"
          bg={finalTheme.colors.surface}
          color={finalTheme.colors.text}
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} color={finalTheme.colors.error} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Erro ao carregar página
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error}
          </AlertDescription>
        </Alert>
      </Box>
    )
  }

  // Empty state
  if (!page || blocks.length === 0) {
    return (
      <Box 
        className={className}
        bg={finalTheme.colors.background}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
      >
        <VStack spacing={4} textAlign="center">
          <Text fontSize="xl" color={finalTheme.colors.text}>
            {getMultiLanguageValue(page?.title || { [language]: 'Página' }, language)}
          </Text>
          <Text color={finalTheme.colors.textSecondary}>
            Esta página ainda não possui conteúdo publicado.
          </Text>
        </VStack>
      </Box>
    )
  }

  // Render page
  return (
    <Box 
      className={className}
      bg={finalTheme.colors.background}
      color={finalTheme.colors.text}
      minH="100vh"
    >
      {/* SEO Meta Tags (would be handled by Next.js Head in actual implementation) */}
      {typeof window !== 'undefined' && page.settings.seo && (
        <>
          {/* This would be handled by next/head in a real implementation */}
        </>
      )}

      {/* Page Content */}
      <VStack spacing={0} align="stretch">
        {blocks.map((block, index) => (
          <BlockRenderer
            key={block.id || index}
            block={block}
            theme={finalTheme}
            language={language}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
          />
        ))}
      </VStack>

      {/* Development Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          position="fixed"
          bottom={4}
          right={4}
          bg={finalTheme.colors.surface}
          color={finalTheme.colors.text}
          p={3}
          borderRadius="md"
          fontSize="xs"
          opacity={0.8}
          zIndex={1000}
        >
          <VStack spacing={1} align="start">
            <Text fontWeight="bold">JovJrx PageBuilder</Text>
            <Text>Page: {pageId}</Text>
            <Text>Blocks: {blocks.length}</Text>
            <Text>Theme: {finalTheme.name}</Text>
            <Text>Language: {language}</Text>
          </VStack>
        </Box>
      )}
    </Box>
  )
}
