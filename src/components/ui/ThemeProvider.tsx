'use client'

import React from 'react'
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { PageBuilderTheme } from '../../types'
import { darkPurpleTheme, lightPurpleTheme } from '../../themes/dark-purple'

// Convert PageBuilderTheme to Chakra theme
function convertToChakraTheme(pageBuilderTheme: PageBuilderTheme) {
  const config: ThemeConfig = {
    initialColorMode: pageBuilderTheme.name.includes('dark') ? 'dark' : 'light',
    useSystemColorMode: false,
  }

  return extendTheme({
    config,
    colors: {
      // Map PageBuilder colors to Chakra color scheme
      primary: {
        50: '#F3E8FF',
        100: '#E9D5FF',
        200: '#D8B4FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: pageBuilderTheme.colors.primary,
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
      },
      secondary: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: pageBuilderTheme.colors.secondary,
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
      },
      accent: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: pageBuilderTheme.colors.accent,
        400: '#A78BFA',
        500: '#8B5CF6',
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
      },
      // Custom colors
      pageBuilder: {
        background: pageBuilderTheme.colors.background,
        surface: pageBuilderTheme.colors.surface,
        text: pageBuilderTheme.colors.text,
        textSecondary: pageBuilderTheme.colors.textSecondary,
        border: pageBuilderTheme.colors.border,
        success: pageBuilderTheme.colors.success,
        warning: pageBuilderTheme.colors.warning,
        error: pageBuilderTheme.colors.error,
      }
    },
    fonts: {
      heading: pageBuilderTheme.fonts.heading,
      body: pageBuilderTheme.fonts.body,
    },
    space: {
      xs: pageBuilderTheme.spacing.xs,
      sm: pageBuilderTheme.spacing.sm,
      md: pageBuilderTheme.spacing.md,
      lg: pageBuilderTheme.spacing.lg,
      xl: pageBuilderTheme.spacing.xl,
    },
    radii: {
      sm: pageBuilderTheme.borderRadius.sm,
      md: pageBuilderTheme.borderRadius.md,
      lg: pageBuilderTheme.borderRadius.lg,
      xl: pageBuilderTheme.borderRadius.xl,
    },
    styles: {
      global: (props: any) => ({
        body: {
          bg: pageBuilderTheme.colors.background,
          color: pageBuilderTheme.colors.text,
        },
        // Custom scrollbar for dark theme
        '*::-webkit-scrollbar': {
          width: '8px',
        },
        '*::-webkit-scrollbar-track': {
          bg: pageBuilderTheme.colors.surface,
        },
        '*::-webkit-scrollbar-thumb': {
          bg: pageBuilderTheme.colors.border,
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          bg: pageBuilderTheme.colors.primary,
        },
      }),
    },
    components: {
      // Customize components for dark purple theme
      Button: {
        defaultProps: {
          colorScheme: 'primary',
        },
        variants: {
          solid: (props: any) => ({
            bg: pageBuilderTheme.colors.primary,
            color: 'white',
            _hover: {
              bg: pageBuilderTheme.colors.secondary,
              transform: 'translateY(-1px)',
            },
            _active: {
              transform: 'translateY(0)',
            },
          }),
          outline: (props: any) => ({
            borderColor: pageBuilderTheme.colors.primary,
            color: pageBuilderTheme.colors.primary,
            _hover: {
              bg: pageBuilderTheme.colors.primary,
              color: 'white',
            },
          }),
          ghost: (props: any) => ({
            color: pageBuilderTheme.colors.text,
            _hover: {
              bg: pageBuilderTheme.colors.surface,
            },
          }),
        },
      },
      Input: {
        variants: {
          outline: (props: any) => ({
            field: {
              bg: pageBuilderTheme.colors.surface,
              borderColor: pageBuilderTheme.colors.border,
              color: pageBuilderTheme.colors.text,
              _hover: {
                borderColor: pageBuilderTheme.colors.primary,
              },
              _focus: {
                borderColor: pageBuilderTheme.colors.primary,
                boxShadow: `0 0 0 1px ${pageBuilderTheme.colors.primary}`,
              },
              _placeholder: {
                color: pageBuilderTheme.colors.textSecondary,
              },
            },
          }),
        },
      },
      Textarea: {
        variants: {
          outline: (props: any) => ({
            bg: pageBuilderTheme.colors.surface,
            borderColor: pageBuilderTheme.colors.border,
            color: pageBuilderTheme.colors.text,
            _hover: {
              borderColor: pageBuilderTheme.colors.primary,
            },
            _focus: {
              borderColor: pageBuilderTheme.colors.primary,
              boxShadow: `0 0 0 1px ${pageBuilderTheme.colors.primary}`,
            },
            _placeholder: {
              color: pageBuilderTheme.colors.textSecondary,
            },
          }),
        },
      },
      Select: {
        variants: {
          outline: (props: any) => ({
            field: {
              bg: pageBuilderTheme.colors.surface,
              borderColor: pageBuilderTheme.colors.border,
              color: pageBuilderTheme.colors.text,
              _hover: {
                borderColor: pageBuilderTheme.colors.primary,
              },
              _focus: {
                borderColor: pageBuilderTheme.colors.primary,
                boxShadow: `0 0 0 1px ${pageBuilderTheme.colors.primary}`,
              },
            },
          }),
        },
      },
      Modal: {
        baseStyle: (props: any) => ({
          dialog: {
            bg: pageBuilderTheme.colors.surface,
            color: pageBuilderTheme.colors.text,
          },
          overlay: {
            bg: 'blackAlpha.600',
          },
        }),
      },
      Popover: {
        baseStyle: (props: any) => ({
          content: {
            bg: pageBuilderTheme.colors.surface,
            borderColor: pageBuilderTheme.colors.border,
            color: pageBuilderTheme.colors.text,
          },
        }),
      },
      Menu: {
        baseStyle: (props: any) => ({
          list: {
            bg: pageBuilderTheme.colors.surface,
            borderColor: pageBuilderTheme.colors.border,
          },
          item: {
            bg: 'transparent',
            color: pageBuilderTheme.colors.text,
            _hover: {
              bg: pageBuilderTheme.colors.background,
            },
            _focus: {
              bg: pageBuilderTheme.colors.background,
            },
          },
        }),
      },
      Tooltip: {
        baseStyle: (props: any) => ({
          bg: pageBuilderTheme.colors.surface,
          color: pageBuilderTheme.colors.text,
          borderRadius: pageBuilderTheme.borderRadius.md,
        }),
      },
    },
  })
}

interface ThemeProviderProps {
  children: React.ReactNode
  theme?: string | PageBuilderTheme
  mode?: 'light' | 'dark' | 'auto'
}

export function ThemeProvider({ 
  children, 
  theme = darkPurpleTheme,
  mode = 'dark'
}: ThemeProviderProps) {
  // Determine the theme to use
  const getTheme = (): PageBuilderTheme => {
    if (typeof theme === 'string') {
      switch (theme) {
        case 'light-purple':
          return lightPurpleTheme
        case 'dark-purple':
        default:
          return darkPurpleTheme
      }
    }
    return theme
  }

  // Apply mode override
  const getFinalTheme = (): PageBuilderTheme => {
    const baseTheme = getTheme()
    
    if (mode === 'light' && baseTheme.name.includes('dark')) {
      return lightPurpleTheme
    }
    if (mode === 'dark' && baseTheme.name.includes('light')) {
      return darkPurpleTheme
    }
    
    return baseTheme
  }

  const finalTheme = getFinalTheme()
  const chakraTheme = convertToChakraTheme(finalTheme)

  return (
    <ChakraProvider theme={chakraTheme}>
      {children}
    </ChakraProvider>
  )
}

// Hook to access current theme
export function usePageBuilderTheme(): PageBuilderTheme {
  // This would ideally be provided through context
  // For now, return the default theme
  return darkPurpleTheme
}

// Theme context for advanced usage
interface ThemeContextValue {
  theme: PageBuilderTheme
  setTheme: (theme: string | PageBuilderTheme) => void
  mode: 'light' | 'dark' | 'auto'
  setMode: (mode: 'light' | 'dark' | 'auto') => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function useThemeContext(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider with context')
  }
  return context
}

// Enhanced theme provider with context
export function ThemeProviderWithContext({
  children,
  theme = darkPurpleTheme,
  mode = 'dark'
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = React.useState<string | PageBuilderTheme>(theme)
  const [currentMode, setCurrentMode] = React.useState<'light' | 'dark' | 'auto'>(mode)

  const contextValue: ThemeContextValue = {
    theme: typeof currentTheme === 'string' 
      ? (currentTheme === 'light-purple' ? lightPurpleTheme : darkPurpleTheme)
      : currentTheme,
    setTheme: setCurrentTheme,
    mode: currentMode,
    setMode: setCurrentMode,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={currentTheme} mode={currentMode}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
