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
import { BlocksRendererConfig, Block } from '../../types'
import { initializeFirebase, loadBlocksByParentId } from '../../firebase'
import { darkPurpleTheme, lightPurpleTheme } from '../../themes/dark-purple'
import { BlockRenderer } from './BlockRenderer'

export function BlocksRenderer({
  parentId,
  firebaseConfig,
  theme = darkPurpleTheme,
  language = 'pt-BR',
  mode = 'light',
  collection = 'blocks',
  data, // Blocos pré-carregados (SSR/SSG)
  widthContainer = '1200px', // Largura padrão do container
  onLoad,
  onError,
  onPurchase,
  onAddToCart,
  customPurchaseButton,
}: BlocksRendererConfig) {
  // State
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

  // Initialize Firebase and load blocks
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Se dados pré-carregados foram fornecidos, use-os
        if (data && data.length >= 0) {
          const activeBlocks = data
            .filter(block => block.active && block.version === 'published')
            .sort((a, b) => a.order - b.order)
          
          setBlocks(activeBlocks)
          onLoad?.(activeBlocks)
          return
        }
        
        // Caso contrário, busque no Firebase
        if (!firebaseConfig) {
          throw new Error('firebaseConfig é obrigatório quando data não é fornecido')
        }
        
        initializeFirebase(firebaseConfig)
        await loadBlocksData()
      } catch (error) {
        console.error('Error initializing blocks renderer:', error)
        handleError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAndLoad()
  }, [parentId, collection, data])

  // Load blocks data
  const loadBlocksData = async () => {
    try {
      const blocksData = await loadBlocksByParentId(parentId, collection)
      
      // Filter only active and published blocks, sort by order
      const activeBlocks = blocksData
        .filter(block => block.active && block.version === 'published')
        .sort((a, b) => a.order - b.order)
      
      setBlocks(activeBlocks)
      onLoad?.(activeBlocks)
    } catch (error) {
      console.error('Error loading blocks:', error)
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
        bg={finalTheme.colors.background}
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={16}
      >
        <VStack spacing={4}>
          <Spinner 
            size="xl" 
            color={finalTheme.colors.primary}
            thickness="4px"
          />
          <Text color={finalTheme.colors.textSecondary}>
            Carregando conteúdo...
          </Text>
        </VStack>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box py={8}>
        <Alert 
          status="error" 
          variant="subtle"
          borderRadius="md"
          bg={finalTheme.colors.surface}
          color={finalTheme.colors.text}
          borderColor={finalTheme.colors.error}
        >
          <AlertIcon color={finalTheme.colors.error} />
          <Box>
            <AlertTitle>Erro ao carregar conteúdo</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      </Box>
    )
  }

  // No blocks state
  if (blocks.length === 0) {
    return (
      <Box 
        py={16}
        textAlign="center"
        bg={finalTheme.colors.background}
        color={finalTheme.colors.textSecondary}
      >
        <Text fontSize="lg">
          Nenhum conteúdo encontrado para exibir.
        </Text>
      </Box>
    )
  }

  // Render blocks
  return (
    <Box 
      bg={finalTheme.colors.background}
      color={finalTheme.colors.text}
      w="100%"
    >
      {blocks.map((block) => (
        <Box 
          key={block.id}
          w="100%"
          bg={block.theme?.background || 'transparent'}
          css={{
            '&:not(:last-child)': {
              marginBottom: finalTheme.spacing.lg
            }
          }}
        >
          {/* Container centralizado com largura máxima */}
          <Box
            maxW={widthContainer}
            mx="auto"
            px={finalTheme.spacing.md}
            py={finalTheme.spacing.lg}
          >
            <BlockRenderer
              block={block}
              theme={finalTheme}
              language={language}
              onPurchase={onPurchase}
              onAddToCart={onAddToCart}
              customPurchaseButton={customPurchaseButton}
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}