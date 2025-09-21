'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
  Box,
  HStack,
  IconButton,
  Tooltip,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react'

interface HTMLEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  isDisabled?: boolean
}

export function HTMLEditor({ 
  value, 
  onChange, 
  placeholder = "Digite seu texto aqui...",
  minHeight = "100px",
  isDisabled = false
}: HTMLEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const focusedBorderColor = useColorModeValue('purple.500', 'purple.300')
  const bgColor = useColorModeValue('white', 'gray.700')

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertLink = () => {
    const url = prompt('Digite a URL do link:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag)
  }

  return (
    <Box 
      borderWidth="1px" 
      borderColor={isFocused ? focusedBorderColor : borderColor}
      borderRadius="md"
      bg={bgColor}
      transition="border-color 0.2s"
    >
      {/* Toolbar */}
      <HStack 
        spacing={1} 
        p={2} 
        borderBottom="1px solid" 
        borderColor={borderColor}
        wrap="wrap"
      >
        <Tooltip label="Negrito">
          <IconButton
            aria-label="Bold"
            icon={<strong>B</strong>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              execCommand('bold')
            }}
          />
        </Tooltip>

        <Tooltip label="Itálico">
          <IconButton
            aria-label="Italic"
            icon={<em>I</em>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              execCommand('italic')
            }}
          />
        </Tooltip>

        <Tooltip label="Sublinhado">
          <IconButton
            aria-label="Underline"
            icon={<u>U</u>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              execCommand('underline')
            }}
          />
        </Tooltip>

        <Divider orientation="vertical" h="20px" />

        <Tooltip label="Título 1">
          <IconButton
            aria-label="H1"
            icon={<strong>H1</strong>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              formatBlock('h1')
            }}
          />
        </Tooltip>

        <Tooltip label="Título 2">
          <IconButton
            aria-label="H2"
            icon={<strong>H2</strong>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              formatBlock('h2')
            }}
          />
        </Tooltip>

        <Tooltip label="Parágrafo">
          <IconButton
            aria-label="Paragraph"
            icon={<span>P</span>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              formatBlock('p')
            }}
          />
        </Tooltip>

        <Divider orientation="vertical" h="20px" />

        <Tooltip label="Lista com bullets">
          <IconButton
            aria-label="Bullet List"
            icon={<span>•</span>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              execCommand('insertUnorderedList')
            }}
          />
        </Tooltip>

        <Tooltip label="Lista numerada">
          <IconButton
            aria-label="Numbered List"
            icon={<span>1.</span>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              execCommand('insertOrderedList')
            }}
          />
        </Tooltip>

        <Divider orientation="vertical" h="20px" />

        <Tooltip label="Link">
          <IconButton
            aria-label="Link"
            icon={<span>🔗</span>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              insertLink()
            }}
          />
        </Tooltip>

        <Tooltip label="Remover formatação">
          <IconButton
            aria-label="Clear Format"
            icon={<span>🧹</span>}
            size="sm"
            variant="ghost"
            onMouseDown={(e) => {
              e.preventDefault()
              execCommand('removeFormat')
            }}
          />
        </Tooltip>
      </HStack>

      {/* Editor Area */}
      <Box
        ref={editorRef}
        contentEditable={!isDisabled}
        suppressContentEditableWarning={true}
        minHeight={minHeight}
        p={3}
        outline="none"
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{
          '&:empty:before': {
            content: `"${placeholder}"`,
            color: 'gray.400',
            fontStyle: 'italic'
          }
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </Box>
  )
}