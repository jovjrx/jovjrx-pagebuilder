// Example: App Router Layout with JovJrx PageBuilder
// app/layout.tsx

import { Providers } from './providers'

export const metadata = {
  title: 'JovJrx PageBuilder - App Router Example',
  description: 'Example of JovJrx PageBuilder with Next.js App Router',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
