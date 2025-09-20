import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    '@chakra-ui/react',
    '@chakra-ui/icons',
    '@emotion/react',
    '@emotion/styled',
    'framer-motion',
    'firebase',
    'react-hook-form',
    'zustand'
  ],
  banner: {
    js: '"use client";'
  },
  esbuildOptions(options) {
    options.jsx = 'preserve'
  }
})
