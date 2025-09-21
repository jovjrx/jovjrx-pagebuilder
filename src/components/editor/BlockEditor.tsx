'use client'

import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Block, Content, TextContent, MediaContentBlock, ListContent, ActionsContent, TimerContent } from '../../types'
import { getTranslation, getMultiLanguageValue, updateMultiLanguageContent } from '../../i18n'
import { HTMLEditor } from '../ui/HTMLEditor'
import { uploadMediaFile } from '../../firebase'

interface BlockEditorProps {
  block: Block
  onUpdateBlock: (block: Block) => void
  language: string
}

export function BlockEditor({ block, onUpdateBlock, language }: BlockEditorProps) {
  const [activeTab, setActiveTab] = useState(3) // 0: Definições, 1: Layout, 2: Tema, 3: Conteúdo
  const [uploadState, setUploadState] = useState<{ index: number | null; progress: number }>({ index: null, progress: 0 })
  const toast = useToast()

  // Update block field
  const updateBlockField = (field: keyof Block, value: any) => {
    const updatedBlock = { ...block, [field]: value }
    onUpdateBlock(updatedBlock)
  }

  // Update multilanguage field
  const updateMultiLanguageField = (field: 'title' | 'subtitle' | 'description', value: string) => {
    const currentContent = (block as any)[field] || {}
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
          order: block.content.length,
        } as TextContent
        break
      case 'media':
        newContent = {
          type: 'media',
          media: { kind: 'image', url: '', alt: '' },
          order: block.content.length,
        } as MediaContentBlock
        break
      case 'list':
        newContent = {
          type: 'list',
          role: 'feature',
          items: [],
          order: block.content.length,
        } as ListContent
        break
      case 'actions':
        newContent = {
          type: 'actions',
          primary: {
            text: { [language]: 'Clique aqui' },
            url: '',
            action: 'link',
            style: 'primary',
          },
          order: block.content.length,
        } as ActionsContent
        break
      case 'timer':
        newContent = {
          type: 'timer',
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          title: { [language]: 'Oferta limitada!' },
          style: 'countdown',
          order: block.content.length,
        } as TimerContent
        break
      default:
        return
    }

    updateBlockField('content', [...block.content, newContent])
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

  // Theme helpers
  const updateThemeField = (key: 'background' | 'text' | 'accent' | 'border' | 'shadow', value: string) => {
    updateBlockField('theme', { ...(block.theme || {}), [key]: value })
  }
  const chakraAccentOptions = ['purple.500','blue.500','teal.500','pink.500','orange.500','red.500','green.500','yellow.500']
  const chakraBgOptions = ['gray.900','gray.800','gray.900','white','black']
  const chakraTextOptions = ['whiteAlpha.900','gray.100','gray.900','blackAlpha.900']
  const chakraBorderOptions = ['gray.700','gray.600','gray.300','gray.200','whiteAlpha.300']

  // Upload handler for media
  const handleUpload = async (file: File, index: number) => {
    try {
      setUploadState({ index, progress: 0 })
      const result = await uploadMediaFile(file, `blocks/${block.id}/media`, (p) => setUploadState({ index, progress: p }))

      const current = block.content[index]
      if (current && current.type === 'media') {
        const updated = { ...(current as MediaContentBlock), media: { ...(current as MediaContentBlock).media, url: result.url } }
        updateContent(index, updated)
      }

      toast({ title: 'Arquivo enviado', status: 'success', duration: 2000 })
    } catch (err: any) {
      console.error(err)
      toast({ title: 'Falha ao enviar arquivo', description: err?.message, status: 'error', duration: 3000 })
    } finally {
      setUploadState({ index: null, progress: 0 })
    }
  }

  const renderContentEditor = (content: Content, index: number) => {
    const commonActions = (
      <HStack gap={1}>
        <IconButton aria-label="Mover para cima" size="xs" variant="ghost" isDisabled={index === 0} onClick={() => moveContent(index, 'up')}>
          <ChevronUpIcon />
        </IconButton>
        <IconButton aria-label="Mover para baixo" size="xs" variant="ghost" isDisabled={index === block.content.length - 1} onClick={() => moveContent(index, 'down')}>
          <ChevronDownIcon />
        </IconButton>
        <IconButton aria-label="Remover" size="xs" variant="ghost" colorScheme="red" onClick={() => deleteContent(index)}>
          <DeleteIcon />
        </IconButton>
      </HStack>
    )

    if (content.type === 'text') {
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
              onChange={(e) => updateContent(index, { ...textContent, variant: e.target.value as any })}
              size="sm"
            >
              <option value="heading">Título</option>
              <option value="subtitle">Subtítulo</option>
              <option value="paragraph">Parágrafo</option>
              <option value="caption">Legenda</option>
              <option value="kpi">KPI/Número</option>
              <option value="list">📋 Lista</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Texto</FormLabel>
            <HTMLEditor
              value={getMultiLanguageValue(textContent.value, language)}
              onChange={(value) => updateContent(index, { ...textContent, value: updateMultiLanguageContent(textContent.value, value, language) })}
              minHeight="80px"
              placeholder="Digite o texto aqui..."
            />
          </FormControl>
        </VStack>
      )
    }

    if (content.type === 'media') {
      const mediaContent = content as MediaContentBlock
      const isUploading = uploadState.index === index
      return (
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Badge colorScheme="purple">Mídia</Badge>
            {commonActions}
          </HStack>

          {/* Dropzone */}
          <Box
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="purple.400"
            borderRadius="md"
            p={4}
            textAlign="center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                handleUpload(file, index)
              } else {
                toast({ title: 'Tipo de arquivo não suportado', status: 'warning' })
              }
            }}
            bg="gray.800"
          >
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.300">Arraste uma imagem/vídeo aqui ou</Text>
              <Button size="xs" onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*,video/*'
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(file, index)
                }
                input.click()
              }}>Enviar arquivo</Button>
              {isUploading && (
                <VStack w="full" spacing={1} pt={2}>
                  <Progress w="full" colorScheme="purple" size="xs" value={uploadState.progress} />
                  <Text fontSize="xs" color="gray.400">Enviando... {uploadState.progress}%</Text>
                </VStack>
              )}
            </VStack>
          </Box>

          <FormControl>
            <FormLabel fontSize="sm">Tipo</FormLabel>
            <Select
              value={mediaContent.media.kind}
              onChange={(e) => updateContent(index, { ...mediaContent, media: { ...mediaContent.media, kind: e.target.value as any } })}
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
              onChange={(e) => updateContent(index, { ...mediaContent, media: { ...mediaContent.media, url: e.target.value } })}
              size="sm"
              placeholder="https://..."
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Texto Alternativo</FormLabel>
            <Input
              value={mediaContent.media.alt || ''}
              onChange={(e) => updateContent(index, { ...mediaContent, media: { ...mediaContent.media, alt: e.target.value } })}
              size="sm"
              placeholder="Descrição da imagem"
            />
          </FormControl>
        </VStack>
      )
    }

    if (content.type === 'actions') {
      const actionsContent = content as ActionsContent
      return (
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Badge colorScheme="red">Ações</Badge>
            {commonActions}
          </HStack>

          <FormControl>
            <FormLabel fontSize="sm">Texto do Botão</FormLabel>
            <HTMLEditor
              value={getMultiLanguageValue(actionsContent.primary.text, language)}
              onChange={(value) => updateContent(index, { ...actionsContent, primary: { ...actionsContent.primary, text: updateMultiLanguageContent(actionsContent.primary.text, value, language) } })}
              minHeight="50px"
              placeholder="Digite o texto do botão..."
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">URL</FormLabel>
            <Input
              value={actionsContent.primary.url}
              onChange={(e) => updateContent(index, { ...actionsContent, primary: { ...actionsContent.primary, url: e.target.value } })}
              size="sm"
              placeholder="https://..."
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Tipo de Ação</FormLabel>
            <Select
              value={actionsContent.primary.action}
              onChange={(e) => updateContent(index, { ...actionsContent, primary: { ...actionsContent.primary, action: e.target.value as any } })}
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
                  onChange={(e) => updateContent(index, { ...actionsContent, primary: { ...actionsContent.primary, price: { amount: parseFloat(e.target.value) || 0, currency: actionsContent.primary.price?.currency || 'BRL', original: actionsContent.primary.price?.original } } })}
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
                  onChange={(e) => updateContent(index, { ...actionsContent, primary: { ...actionsContent.primary, price: { amount: actionsContent.primary.price?.amount || 0, currency: actionsContent.primary.price?.currency || 'BRL', original: e.target.value ? parseFloat(e.target.value) : undefined } } })}
                  size="sm"
                  placeholder="297.00"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs">Moeda</FormLabel>
                <Select
                  value={actionsContent.primary.price?.currency || 'BRL'}
                  onChange={(e) => updateContent(index, { ...actionsContent, primary: { ...actionsContent.primary, price: { amount: actionsContent.primary.price?.amount || 0, currency: e.target.value, original: actionsContent.primary.price?.original } } })}
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
              onChange={(e) => updateContent(index, { ...actionsContent, primary: { ...actionsContent.primary, style: e.target.value as any } })}
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
    }

    // Default
    return (
      <Box p={3} borderWidth="1px" borderColor="gray.600" borderRadius="md">
        <Text fontSize="sm" color="gray.400">Editor para {content.type} em desenvolvimento...</Text>
      </Box>
    )
  }

  return (
    <Box h="full" display="flex" flexDirection="column">
      <Box flex={1} p={6} pb={24}>
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
                  onChange={(e) => onUpdateBlock({ ...block, active: e.target.checked })}
                />
                <Text fontSize="sm" color="gray.400">Ativo</Text>
              </HStack>
            </HStack>
            <Text fontSize="sm" color="gray.400">Edite as configurações e conteúdo do bloco</Text>
          </VStack>

          {/* Tabs */}
          <Tabs index={activeTab} onChange={(i) => setActiveTab(i)} colorScheme="purple" variant="enclosed">
            <TabList>
              <Tab>⚙️ Definições</Tab>
              <Tab>🧩 Layout</Tab>
              <Tab>🎨 Tema</Tab>
              <Tab>🧩 Conteúdo</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  {/* Basic Info */}
                  <Box>
                    <FormControl mb={3}>
                      <FormLabel>Título do Bloco</FormLabel>
                      <HTMLEditor
                        value={getMultiLanguageValue(block.title, language)}
                        onChange={(value) => updateMultiLanguageField('title', value)}
                        minHeight="60px"
                        placeholder="Digite o título do bloco..."
                      />
                    </FormControl>

                    <FormControl mb={3}>
                      <FormLabel>Subtítulo</FormLabel>
                      <HTMLEditor
                        value={getMultiLanguageValue(block.subtitle || {}, language)}
                        onChange={(value) => updateMultiLanguageField('subtitle', value)}
                        minHeight="50px"
                        placeholder="Digite o subtítulo..."
                      />
                    </FormControl>

                    <FormControl mb={3}>
                      <FormLabel>Descrição</FormLabel>
                      <HTMLEditor
                        value={getMultiLanguageValue(block.description || {}, language)}
                        onChange={(value) => updateMultiLanguageField('description', value)}
                        minHeight="80px"
                        placeholder="Digite a descrição do bloco..."
                      />
                    </FormControl>

                    <FormControl>
                      <HStack>
                        <FormLabel mb={0}>Bloco Ativo</FormLabel>
                        <Switch isChecked={block.active} onChange={(e) => updateBlockField('active', e.target.checked)} colorScheme="purple" />
                      </HStack>
                    </FormControl>
                  </Box>

                  <Divider borderColor="gray.600" />
                </VStack>
              </TabPanel>

              {/* Layout Tab */}
              <TabPanel px={0}>
                <Accordion allowToggle>
                  <AccordionItem border="1px solid" borderColor="gray.600" borderRadius="md">
                    <AccordionButton bg="gray.700" _hover={{ bg: 'gray.600' }}>
                      <Box flex="1" textAlign="left" fontWeight="semibold">🧩 Layout</Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} bg="gray.750">
                      <VStack spacing={3} align="stretch">
                        <FormControl>
                          <FormLabel>Variante</FormLabel>
                          <Select
                            value={block.layout?.variant || 'stack'}
                            onChange={(e) => updateBlockField('layout', { ...block.layout, variant: e.target.value as any })}
                            size="sm"
                          >
                            <option value="stack">Empilhado</option>
                            <option value="split">Dividido</option>
                            <option value="grid">Grade</option>
                            <option value="carousel">Carrossel</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Container</FormLabel>
                          <Select
                            value={block.layout?.container || 'boxed'}
                            onChange={(e) => updateBlockField('layout', { ...block.layout, container: e.target.value as any })}
                            size="sm"
                          >
                            <option value="boxed">Boxed (centralizado)</option>
                            <option value="fluid">Fluido (100%)</option>
                            <option value="none">Sem container (template)</option>
                          </Select>
                        </FormControl>

                        {block.layout?.variant === 'grid' && (
                          <HStack>
                            <FormControl>
                              <FormLabel>Colunas (grid)</FormLabel>
                              <Select
                                value={block.layout?.gridColumns || 2}
                                onChange={(e) => updateBlockField('layout', { ...block.layout, gridColumns: parseInt(e.target.value) })}
                                size="sm"
                              >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                              </Select>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Template Columns</FormLabel>
                              <Input
                                value={block.layout?.templateColumns || ''}
                                onChange={(e) => updateBlockField('layout', { ...block.layout, templateColumns: e.target.value })}
                                size="sm"
                                placeholder="ex: 2fr 1fr ou repeat(3, 1fr)"
                              />
                            </FormControl>
                          </HStack>
                        )}

                        <FormControl>
                          <FormLabel>Alinhamento</FormLabel>
                          <Select
                            value={block.layout?.align || 'center'}
                            onChange={(e) => updateBlockField('layout', { ...block.layout, align: e.target.value as any })}
                            size="sm"
                          >
                            <option value="start">Início</option>
                            <option value="center">Centro</option>
                            <option value="end">Fim</option>
                          </Select>
                        </FormControl>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </TabPanel>

              {/* Theme Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.400">Defina as cores do bloco usando <b>tokens do Chakra</b> (ex.: purple.500, gray.900, whiteAlpha.900). Todos os campos aceitam apenas string.</Text>

                  <FormControl>
                    <FormLabel>Accent</FormLabel>
                    <HStack>
                      <Input size="sm" placeholder="purple.500" value={block.theme?.accent || ''} onChange={(e) => updateThemeField('accent', e.target.value)} />
                      {/* Quick picks */}
                      <HStack>
                        {chakraAccentOptions.map(opt => (
                          <Button key={opt} size="xs" onClick={() => updateThemeField('accent', opt)} bg={opt} color="white">{opt.split('.')[0]}</Button>
                        ))}
                      </HStack>
                    </HStack>
                  </FormControl>

                  <HStack align="start">
                    <FormControl>
                      <FormLabel>Background</FormLabel>
                      <Input size="sm" placeholder="gray.900" value={block.theme?.background || ''} onChange={(e) => updateThemeField('background', e.target.value)} />
                      <Box mt={2} h="8" borderRadius="md" bg={block.theme?.background || 'transparent'} border="1px solid" borderColor="gray.600" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Texto</FormLabel>
                      <Input size="sm" placeholder="whiteAlpha.900" value={block.theme?.text || ''} onChange={(e) => updateThemeField('text', e.target.value)} />
                      <HStack mt={2}>
                        <Box w="24" h="8" borderRadius="md" bg={block.theme?.background || 'gray.800'} border="1px solid" borderColor="gray.600" display="flex" alignItems="center" justifyContent="center">
                          <Text fontSize="xs" color={block.theme?.text || 'whiteAlpha.900'}>Aa</Text>
                        </Box>
                      </HStack>
                    </FormControl>
                  </HStack>

                  <HStack align="start">
                    <FormControl>
                      <FormLabel>Border</FormLabel>
                      <Input size="sm" placeholder="gray.700" value={block.theme?.border || ''} onChange={(e) => updateThemeField('border', e.target.value)} />
                      <Box mt={2} h="8" borderRadius="md" borderWidth="2px" borderColor={block.theme?.border || 'gray.700'} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Sombra (shadow)</FormLabel>
                      <Input size="sm" placeholder="ex.: 0 10px 30px rgba(0,0,0,0.3)" value={block.theme?.shadow || ''} onChange={(e) => updateThemeField('shadow', e.target.value)} />
                    </FormControl>
                  </HStack>
                </VStack>
              </TabPanel>

              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="sm">Elementos do Bloco</Heading>
                    <HStack spacing={2}>
                      <Button size="xs" leftIcon={<AddIcon />} onClick={() => addContent('text')} colorScheme="blue" variant="outline">Texto</Button>
                      <Button size="xs" leftIcon={<AddIcon />} onClick={() => addContent('media')} colorScheme="purple" variant="outline">Mídia</Button>
                      <Button size="xs" leftIcon={<AddIcon />} onClick={() => addContent('actions')} colorScheme="red" variant="outline">Ações</Button>
                    </HStack>
                  </HStack>

                  {block.content.length === 0 ? (
                    <Box p={6} textAlign="center" bg="gray.800" borderRadius="md">
                      <Text color="gray.400" mb={3}>Nenhum elemento adicionado</Text>
                      <Button size="sm" leftIcon={<AddIcon />} onClick={() => addContent('text')} colorScheme="purple">Adicionar Primeiro Elemento</Button>
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
                                <Badge size="sm" colorScheme="gray">{content.type}</Badge>
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
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>

      {/* Barra de Ações Fixa (sticky) */}
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
          <Text fontSize="xs" color="gray.400">💾 Auto-salvamento ativo</Text>

          <HStack spacing={3}>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={() => toast({ title: 'Alterações revertidas', status: 'info', duration: 2000, isClosable: true })}
            >
              ↩️ Reverter
            </Button>

            <Button
              size="sm"
              colorScheme="green"
              onClick={() => toast({ title: 'Bloco salvo com sucesso!', status: 'success', duration: 2000, isClosable: true })}
            >
              💾 Salvar
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  )
}
