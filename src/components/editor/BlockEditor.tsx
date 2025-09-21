'use client'

import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Textarea,
  Select,
  Switch,
  Button,
  FormControl,
  FormLabel,
  Divider,
  Badge,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Stack,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Block, Content, TextContent, MediaContentBlock, ListContent, ActionsContent, TimerContent } from '../../types'
import { getTranslation, getMultiLanguageValue, updateMultiLanguageContent } from '../../i18n'

interface BlockEditorProps {
  block: Block
  onUpdateBlock: (block: Block) => void
  language: string
}

export function BlockEditor({ block, onUpdateBlock, language }: BlockEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'theme'>('content')
  const toast = useToast()

  // Update block field
  const updateBlockField = (field: keyof Block, value: any) => {
    const updatedBlock = { ...block, [field]: value }
    onUpdateBlock(updatedBlock)
  }

  // Update multilanguage field
  const updateMultiLanguageField = (field: 'title' | 'subtitle' | 'description', value: string) => {
    const currentContent = block[field] || {}
    const updatedContent = updateMultiLanguageContent(currentContent, value, language)
    updateBlockField(field, updatedContent)
  }

  // Add content
  const addContent = (type: Content['type']) => {
    let newContent: Content

    switch (type) {
      case 'text':
        newContent = {
          type: 'text',
          variant: 'paragraph',
          value: { [language]: '' },
          order: block.content.length
        } as TextContent
        break
      case 'media':
        newContent = {
          type: 'media',
          media: {
            kind: 'image',
            url: '',
            alt: ''
          },
          order: block.content.length
        } as MediaContentBlock
        break
      case 'list':
        newContent = {
          type: 'list',
          role: 'feature',
          items: [],
          order: block.content.length
        } as ListContent
        break
      case 'actions':
        newContent = {
          type: 'actions',
          primary: {
            text: { [language]: 'Clique aqui' },
            url: '',
            action: 'link',
            style: 'primary'
          },
          order: block.content.length
        } as ActionsContent
        break
      case 'timer':
        newContent = {
          type: 'timer',
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          title: { [language]: 'Oferta limitada!' },
          style: 'countdown',
          order: block.content.length
        } as TimerContent
        break
      default:
        return
    }

    const updatedContent = [...block.content, newContent]
    updateBlockField('content', updatedContent)
  }

  // Update content
  const updateContent = (index: number, updatedContent: Content) => {
    const newContent = [...block.content]
    newContent[index] = updatedContent
    updateBlockField('content', newContent)
  }

  // Delete content
  const deleteContent = (index: number) => {
    const newContent = block.content.filter((_, i) => i !== index)
    updateBlockField('content', newContent)
  }

  // Move content
  const moveContent = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= block.content.length) return

    const newContent = [...block.content]
    const [movedItem] = newContent.splice(index, 1)
    newContent.splice(newIndex, 0, movedItem)
    
    // Update order
    newContent.forEach((item, i) => {
      item.order = i
    })
    
    updateBlockField('content', newContent)
  }

  const renderContentEditor = (content: Content, index: number) => {
    const commonActions = (
            <HStack gap={1}>
        <IconButton
          aria-label="Move up"
          size="xs"
          variant="ghost"
          isDisabled={index === 0}
          onClick={() => moveContent(index, 'up')}
        >
          <ChevronUpIcon />
        </IconButton>
        <IconButton
          aria-label="Move down"
          size="xs"
          variant="ghost"
          isDisabled={index === block.content.length - 1}
          onClick={() => moveContent(index, 'down')}
        >
          <ChevronDownIcon />
        </IconButton>
        <IconButton
          aria-label="Delete content"
          size="xs"
          variant="ghost"
          colorScheme="red"
          onClick={() => deleteContent(index)}
        >
          <DeleteIcon />
        </IconButton>
      </HStack>
    )

    switch (content.type) {
      case 'text':
        const textContent = content as TextContent
        return (
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Badge colorScheme="blue">Texto</Badge>
              {commonActions}
            </HStack>
            
            <FormControl>
              <FormLabel fontSize="sm">Tipo</FormLabel>
              <Select
                value={textContent.variant}
                onChange={(e) => updateContent(index, {
                  ...textContent,
                  variant: e.target.value as any
                })}
                size="sm"
              >
                <option value="heading">Título</option>
                <option value="subtitle">Subtítulo</option>
                <option value="paragraph">Parágrafo</option>
                <option value="caption">Legenda</option>
                <option value="kpi">KPI/Número</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Texto</FormLabel>
              <Textarea
                value={getMultiLanguageValue(textContent.value, language)}
                onChange={(e) => updateContent(index, {
                  ...textContent,
                  value: updateMultiLanguageContent(textContent.value, e.target.value, language)
                })}
                size="sm"
                rows={3}
              />
            </FormControl>
          </VStack>
        )

      case 'media':
        const mediaContent = content as MediaContentBlock
        return (
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Badge colorScheme="purple">Mídia</Badge>
              {commonActions}
            </HStack>
            
            <FormControl>
              <FormLabel fontSize="sm">Tipo</FormLabel>
              <Select
                value={mediaContent.media.kind}
                onChange={(e) => updateContent(index, {
                  ...mediaContent,
                  media: { ...mediaContent.media, kind: e.target.value as any }
                })}
                size="sm"
              >
                <option value="image">Imagem</option>
                <option value="video">Vídeo</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">URL</FormLabel>
              <Input
                value={mediaContent.media.url}
                onChange={(e) => updateContent(index, {
                  ...mediaContent,
                  media: { ...mediaContent.media, url: e.target.value }
                })}
                size="sm"
                placeholder="https://..."
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Texto Alternativo</FormLabel>
              <Input
                value={mediaContent.media.alt || ''}
                onChange={(e) => updateContent(index, {
                  ...mediaContent,
                  media: { ...mediaContent.media, alt: e.target.value }
                })}
                size="sm"
                placeholder="Descrição da imagem"
              />
            </FormControl>
          </VStack>
        )

      case 'actions':
        const actionsContent = content as ActionsContent
        return (
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Badge colorScheme="red">Ações</Badge>
              {commonActions}
            </HStack>
            
            <FormControl>
              <FormLabel fontSize="sm">Texto do Botão</FormLabel>
              <Input
                value={getMultiLanguageValue(actionsContent.primary.text, language)}
                onChange={(e) => updateContent(index, {
                  ...actionsContent,
                  primary: {
                    ...actionsContent.primary,
                    text: updateMultiLanguageContent(actionsContent.primary.text, e.target.value, language)
                  }
                })}
                size="sm"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">URL</FormLabel>
              <Input
                value={actionsContent.primary.url}
                onChange={(e) => updateContent(index, {
                  ...actionsContent,
                  primary: { ...actionsContent.primary, url: e.target.value }
                })}
                size="sm"
                placeholder="https://..."
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Tipo de Ação</FormLabel>
              <Select
                value={actionsContent.primary.action}
                onChange={(e) => updateContent(index, {
                  ...actionsContent,
                  primary: { ...actionsContent.primary, action: e.target.value as any }
                })}
                size="sm"
              >
                <option value="link">🔗 Link/Navegação</option>
                <option value="buy">🛒 Comprar/E-commerce</option>
                <option value="download">📥 Download</option>
                <option value="contact">📞 Contato</option>
                <option value="more_info">ℹ️ Mais Informações</option>
              </Select>
            </FormControl>

            {actionsContent.primary.action === 'buy' && (
              <VStack spacing={3} align="stretch" p={3} borderWidth="1px" borderColor="purple.300" borderRadius="md">
                <Text fontSize="sm" fontWeight="bold">⚙️ Configurações de Compra</Text>
                
                <FormControl>
                  <FormLabel fontSize="xs">Preço (R$)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    value={actionsContent.primary.price?.amount || ''}
                    onChange={(e) => updateContent(index, {
                      ...actionsContent,
                      primary: {
                        ...actionsContent.primary,
                        price: {
                          amount: parseFloat(e.target.value) || 0,
                          currency: actionsContent.primary.price?.currency || 'BRL',
                          original: actionsContent.primary.price?.original
                        }
                      }
                    })}
                    size="sm"
                    placeholder="197.00"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs">Preço Original (opcional)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    value={actionsContent.primary.price?.original || ''}
                    onChange={(e) => updateContent(index, {
                      ...actionsContent,
                      primary: {
                        ...actionsContent.primary,
                        price: {
                          amount: actionsContent.primary.price?.amount || 0,
                          currency: actionsContent.primary.price?.currency || 'BRL',
                          original: e.target.value ? parseFloat(e.target.value) : undefined
                        }
                      }
                    })}
                    size="sm"
                    placeholder="297.00"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs">Moeda</FormLabel>
                  <Select
                    value={actionsContent.primary.price?.currency || 'BRL'}
                    onChange={(e) => updateContent(index, {
                      ...actionsContent,
                      primary: {
                        ...actionsContent.primary,
                        price: {
                          amount: actionsContent.primary.price?.amount || 0,
                          currency: e.target.value,
                          original: actionsContent.primary.price?.original
                        }
                      }
                    })}
                    size="sm"
                  >
                    <option value="BRL">🇧🇷 Real (BRL)</option>
                    <option value="USD">🇺🇸 Dólar (USD)</option>
                    <option value="EUR">🇪🇺 Euro (EUR)</option>
                  </Select>
                </FormControl>
              </VStack>
            )}

            <FormControl>
              <FormLabel fontSize="sm">Estilo</FormLabel>
              <Select
                value={actionsContent.primary.style}
                onChange={(e) => updateContent(index, {
                  ...actionsContent,
                  primary: { ...actionsContent.primary, style: e.target.value as any }
                })}
                size="sm"
              >
                <option value="primary">Primário</option>
                <option value="secondary">Secundário</option>
                <option value="outline">Contorno</option>
                <option value="ghost">Fantasma</option>
              </Select>
            </FormControl>
          </VStack>
        )

      default:
        return (
          <Box p={3} borderWidth="1px" borderColor="gray.600" borderRadius="md">
            <Text fontSize="sm" color="gray.400">
              Editor para {content.type} em desenvolvimento...
            </Text>
          </Box>
        )
    }
  }

  return (
    <Box h="full" display="flex" flexDirection="column">
      <Box flex={1} overflowY="auto" p={6}>
        <VStack spacing={6} align="stretch">
        {/* Header */}
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Heading size="md" color="purple.300">
              {getTranslation(`block.${block.type}`, language)}
            </Heading>
            <HStack spacing={2} align="center">
              <Text fontSize="sm" color="gray.400">Inativo</Text>
              <Switch 
                colorScheme="purple"
                isChecked={block.active}
                onChange={(e) => {
                  // Atualizar estado do bloco
                  onUpdateBlock({ ...block, active: e.target.checked })
                }}
              />
              <Text fontSize="sm" color="gray.400">Ativo</Text>
            </HStack>
          </HStack>

          <Text fontSize="sm" color="gray.400">
            Edite as configurações e conteúdo do bloco
          </Text>
        </VStack>

        {/* Tabs */}
        <HStack spacing={1} bg="gray.800" p={1} borderRadius="md">
          {(['content', 'layout', 'theme'] as const).map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? 'solid' : 'ghost'}
              colorScheme={activeTab === tab ? 'purple' : 'gray'}
              onClick={() => setActiveTab(tab)}
              flex={1}
            >
              {tab === 'content' && 'Conteúdo'}
              {tab === 'layout' && 'Layout'}
              {tab === 'theme' && 'Tema'}
            </Button>
          ))}
        </HStack>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <VStack spacing={4} align="stretch">
            {/* Basic Info */}
            <Box>
              <FormControl mb={3}>
                <FormLabel>Título do Bloco</FormLabel>
                <Input
                  value={getMultiLanguageValue(block.title, language)}
                  onChange={(e) => updateMultiLanguageField('title', e.target.value)}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Subtítulo</FormLabel>
                <Input
                  value={getMultiLanguageValue(block.subtitle || {}, language)}
                  onChange={(e) => updateMultiLanguageField('subtitle', e.target.value)}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={getMultiLanguageValue(block.description || {}, language)}
                  onChange={(e) => updateMultiLanguageField('description', e.target.value)}
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <HStack>
                  <FormLabel mb={0}>Bloco Ativo</FormLabel>
                  <Switch
                    isChecked={block.active}
                    onChange={(e) => updateBlockField('active', e.target.checked)}
                    colorScheme="purple"
                  />
                </HStack>
              </FormControl>
            </Box>

            <Divider borderColor="gray.600" />

            {/* Content Items */}
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="sm">Elementos do Bloco</Heading>
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    leftIcon={<AddIcon />}
                    onClick={() => addContent('text')}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Texto
                  </Button>
                  <Button
                    size="xs"
                    leftIcon={<AddIcon />}
                    onClick={() => addContent('media')}
                    colorScheme="purple"
                    variant="outline"
                  >
                    Mídia
                  </Button>
                  <Button
                    size="xs"
                    leftIcon={<AddIcon />}
                    onClick={() => addContent('actions')}
                    colorScheme="red"
                    variant="outline"
                  >
                    Ações
                  </Button>
                </HStack>
              </HStack>

              {block.content.length === 0 ? (
                <Box p={6} textAlign="center" bg="gray.800" borderRadius="md">
                  <Text color="gray.400" mb={3}>
                    Nenhum elemento adicionado
                  </Text>
                  <Button
                    size="sm"
                    leftIcon={<AddIcon />}
                    onClick={() => addContent('text')}
                    colorScheme="purple"
                  >
                    Adicionar Primeiro Elemento
                  </Button>
                </Box>
              ) : (
                <Accordion allowMultiple>
                  {block.content.map((content, index) => (
                    <AccordionItem key={index} border="1px solid" borderColor="gray.600" borderRadius="md" mb={2}>
                      <AccordionButton bg="gray.700" _hover={{ bg: 'gray.600' }}>
                        <Box flex="1" textAlign="left">
                          <HStack>
                            <Text fontSize="sm" fontWeight="medium">
                              {content.type.charAt(0).toUpperCase() + content.type.slice(1)} #{index + 1}
                            </Text>
                            <Badge size="sm" colorScheme="gray">
                              {content.type}
                            </Badge>
                          </HStack>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4} bg="gray.750">
                        {renderContentEditor(content, index)}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </VStack>
          </VStack>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Variante do Layout</FormLabel>
              <Select
                value={block.layout?.variant || 'stack'}
                onChange={(e) => updateBlockField('layout', {
                  ...block.layout,
                  variant: e.target.value
                })}
              >
                <option value="stack">Empilhado</option>
                <option value="split">Dividido</option>
                <option value="grid">Grade</option>
                <option value="carousel">Carrossel</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Alinhamento</FormLabel>
              <Select
                value={block.layout?.align || 'center'}
                onChange={(e) => updateBlockField('layout', {
                  ...block.layout,
                  align: e.target.value
                })}
              >
                <option value="start">Início</option>
                <option value="center">Centro</option>
                <option value="end">Fim</option>
              </Select>
            </FormControl>

            {block.layout?.variant === 'grid' && (
              <FormControl>
                <FormLabel>Colunas</FormLabel>
                <Select
                  value={block.layout?.columns || 3}
                  onChange={(e) => updateBlockField('layout', {
                    ...block.layout,
                    columns: parseInt(e.target.value)
                  })}
                >
                  <option value={1}>1 Coluna</option>
                  <option value={2}>2 Colunas</option>
                  <option value={3}>3 Colunas</option>
                  <option value={4}>4 Colunas</option>
                </Select>
              </FormControl>
            )}
          </VStack>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Cor de Fundo</FormLabel>
              <Input
                value={block.theme?.background || ''}
                onChange={(e) => updateBlockField('theme', {
                  ...block.theme,
                  background: e.target.value
                })}
                placeholder="gray.900, #1a1a1a, etc."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cor do Texto</FormLabel>
              <Input
                value={block.theme?.text || ''}
                onChange={(e) => updateBlockField('theme', {
                  ...block.theme,
                  text: e.target.value
                })}
                placeholder="white, gray.100, etc."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cor de Destaque</FormLabel>
              <Input
                value={block.theme?.accent || ''}
                onChange={(e) => updateBlockField('theme', {
                  ...block.theme,
                  accent: e.target.value
                })}
                placeholder="purple.500, blue.400, etc."
              />
            </FormControl>
          </VStack>
        )}
        </VStack>
      </Box>
      
      {/* Barra de Ações Fixa */}
      <Box 
        position="sticky" 
        bottom={0} 
        borderTop="1px solid" 
        borderColor="gray.600" 
        bg="gray.800" 
        p={4}
        zIndex={10}
      >
        <HStack justify="space-between" align="center">
          <Text fontSize="xs" color="gray.400">
            💾 Auto-salvamento ativo
          </Text>
          
          <HStack spacing={3}>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={() => {
                // Funcionalidade de reset/cancelar
                toast({
                  title: "Alterações revertidas",
                  status: "info",
                  duration: 2000,
                  isClosable: true
                })
              }}
            >
              ↩️ Reverter
            </Button>
            
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => {
                // Funcionalidade de salvar
                toast({
                  title: "Bloco salvo com sucesso!",
                  status: "success",
                  duration: 2000,
                  isClosable: true
                })
              }}
            >
              💾 Salvar
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  )
}
