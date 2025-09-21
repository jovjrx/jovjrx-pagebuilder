'use client'

import React from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

interface HTMLContentProps extends Omit<BoxProps, 'dangerouslySetInnerHTML'> {
  content: string
  fallback?: string
}

/**
 * Componente seguro para renderizar conteúdo HTML
 * Remove scripts e outros elementos perigosos por segurança
 */
export function HTMLContent({ content, fallback = '', ...props }: HTMLContentProps) {
  // Função básica de sanitização (remove scripts e elementos perigosos)
  const sanitizeHTML = (html: string): string => {
    if (!html) return fallback
    
    // Remove scripts, links externos perigosos e outros elementos de segurança
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '') // Remove javascript: links
  }

  const sanitizedContent = sanitizeHTML(content)
  
  // Se não há conteúdo válido, renderiza o fallback como texto simples
  if (!sanitizedContent || sanitizedContent === fallback) {
    return <Box {...props}>{fallback}</Box>
  }

  return (
    <Box 
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      sx={{
        // Estilos para elementos HTML comuns
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          fontWeight: 'bold',
          lineHeight: 'shorter'
        },
        '& h1': { fontSize: '2xl' },
        '& h2': { fontSize: 'xl' },
        '& h3': { fontSize: 'lg' },
        '& p': {
          marginBottom: '1em',
          lineHeight: 'base'
        },
        '& ul, & ol': {
          marginLeft: '1.5em',
          marginBottom: '1em'
        },
        '& li': {
          marginBottom: '0.5em'
        },
        '& a': {
          color: 'purple.400',
          textDecoration: 'underline'
        },
        '& strong, & b': {
          fontWeight: 'bold'
        },
        '& em, & i': {
          fontStyle: 'italic'
        },
        '& u': {
          textDecoration: 'underline'
        },
        ...props.sx
      }}
    />
  )
}

/**
 * Hook para verificar se o conteúdo contém HTML
 */
export function useIsHTML(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content)
}