import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    '@chakra-ui/react',
    '@emotion/react',
    '@emotion/styled',
    'framer-motion',
    'firebase'
  ],
  banner: {
    js: '"use client";'
  }
})
