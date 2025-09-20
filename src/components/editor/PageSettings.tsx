'use client'

import React from 'react'
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  HStack,
  Text,
  Divider,
  Box,
  Badge,
} from '@chakra-ui/react'
import { Page } from '../../types'
import { getMultiLanguageValue, updateMultiLanguageContent } from '../../i18n'

interface PageSettingsProps {
  page: Page
  onUpdatePage: (page: Page) => void
  language: string
}

export function PageSettings({ page, onUpdatePage, language }: PageSettingsProps) {
  // Update page field
  const updatePageField = (field: keyof Page, value: any) => {
    const updatedPage = { ...page, [field]: value }
    onUpdatePage(updatedPage)
  }

  // Update multilanguage field
  const updateMultiLanguageField = (field: 'title' | 'description', value: string) => {
    const currentContent = page[field] || {}
    const updatedContent = updateMultiLanguageContent(currentContent, value, language)
    updatePageField(field, updatedContent)
  }

  // Update SEO field
  const updateSEOField = (field: 'title' | 'description', value: string) => {
    const currentSEO = page.settings.seo || {}
    const currentContent = currentSEO[field] || {}
    const updatedContent = updateMultiLanguageContent(currentContent, value, language)
    
    updatePageField('settings', {
      ...page.settings,
      seo: {
        ...currentSEO,
        [field]: updatedContent
      }
    })
  }

  // Update settings field
  const updateSettingsField = (field: string, value: any) => {
    updatePageField('settings', {
      ...page.settings,
      [field]: value
    })
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Basic Information */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4} color="purple.300">
          Informações Básicas
        </Text>
        
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Título da Página</FormLabel>
            <Input
              value={getMultiLanguageValue(page.title, language)}
              onChange={(e) => updateMultiLanguageField('title', e.target.value)}
              placeholder="Digite o título da página"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Slug/URL</FormLabel>
            <Input
              value={page.slug}
              onChange={(e) => updatePageField('slug', e.target.value)}
              placeholder="minha-pagina"
            />
            <Text fontSize="xs" color="gray.400" mt={1}>
              URL amigável para a página (sem espaços ou caracteres especiais)
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              value={getMultiLanguageValue(page.description || {}, language)}
              onChange={(e) => updateMultiLanguageField('description', e.target.value)}
              placeholder="Descrição da página"
              rows={3}
            />
          </FormControl>

          <FormControl>
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <FormLabel mb={0}>Status da Página</FormLabel>
                <Text fontSize="sm" color="gray.400">
                  Controla se a página está visível publicamente
                </Text>
              </VStack>
              <Select
                value={page.settings.status}
                onChange={(e) => updateSettingsField('status', e.target.value)}
                w="150px"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicada</option>
                <option value="archived">Arquivada</option>
              </Select>
            </HStack>
          </FormControl>
        </VStack>
      </Box>

      <Divider borderColor="gray.600" />

      {/* SEO Settings */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4} color="purple.300">
          Configurações de SEO
        </Text>
        
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Título SEO</FormLabel>
            <Input
              value={getMultiLanguageValue(page.settings.seo?.title || {}, language)}
              onChange={(e) => updateSEOField('title', e.target.value)}
              placeholder="Título otimizado para mecanismos de busca"
            />
            <Text fontSize="xs" color="gray.400" mt={1}>
              Recomendado: 50-60 caracteres
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Descrição SEO</FormLabel>
            <Textarea
              value={getMultiLanguageValue(page.settings.seo?.description || {}, language)}
              onChange={(e) => updateSEOField('description', e.target.value)}
              placeholder="Descrição que aparece nos resultados de busca"
              rows={3}
            />
            <Text fontSize="xs" color="gray.400" mt={1}>
              Recomendado: 150-160 caracteres
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Palavras-chave</FormLabel>
            <Input
              value={page.settings.seo?.keywords?.join(', ') || ''}
              onChange={(e) => updatePageField('settings', {
                ...page.settings,
                seo: {
                  ...page.settings.seo,
                  keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                }
              })}
              placeholder="palavra1, palavra2, palavra3"
            />
            <Text fontSize="xs" color="gray.400" mt={1}>
              Separe as palavras-chave com vírgulas
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Imagem Open Graph</FormLabel>
            <Input
              value={page.settings.seo?.ogImage || ''}
              onChange={(e) => updatePageField('settings', {
                ...page.settings,
                seo: {
                  ...page.settings.seo,
                  ogImage: e.target.value
                }
              })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <Text fontSize="xs" color="gray.400" mt={1}>
              Imagem que aparece quando a página é compartilhada nas redes sociais
            </Text>
          </FormControl>
        </VStack>
      </Box>

      <Divider borderColor="gray.600" />

      {/* Advanced Settings */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4} color="purple.300">
          Configurações Avançadas
        </Text>
        
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Tema</FormLabel>
            <Select
              value={page.settings.theme || 'dark-purple'}
              onChange={(e) => updateSettingsField('theme', e.target.value)}
            >
              <option value="dark-purple">Dark Purple</option>
              <option value="light-purple">Light Purple</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Idioma Principal</FormLabel>
            <Select
              value={page.settings.language || 'pt-BR'}
              onChange={(e) => updateSettingsField('language', e.target.value)}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </Select>
          </FormControl>
        </VStack>
      </Box>

      {/* Page Statistics */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4} color="purple.300">
          Estatísticas
        </Text>
        
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.400">Total de Blocos:</Text>
            <Badge colorScheme="blue">{page.blocks.length}</Badge>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.400">Status:</Text>
            <Badge 
              colorScheme={
                page.settings.status === 'published' ? 'green' : 
                page.settings.status === 'draft' ? 'yellow' : 'gray'
              }
            >
              {page.settings.status === 'published' ? 'Publicada' :
               page.settings.status === 'draft' ? 'Rascunho' : 'Arquivada'}
            </Badge>
          </HStack>
          
          {page.created_at && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.400">Criada em:</Text>
              <Text fontSize="sm" color="gray.300">
                {new Date(page.created_at).toLocaleDateString('pt-BR')}
              </Text>
            </HStack>
          )}
          
          {page.updated_at && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.400">Última atualização:</Text>
              <Text fontSize="sm" color="gray.300">
                {new Date(page.updated_at).toLocaleDateString('pt-BR')}
              </Text>
            </HStack>
          )}
        </VStack>
      </Box>
    </VStack>
  )
}
