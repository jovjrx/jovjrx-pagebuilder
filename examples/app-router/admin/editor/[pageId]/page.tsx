// Example: Editor Page for App Router
// app/admin/editor/[pageId]/page.tsx

import { PageBuilder } from 'jovjrx-pagebuilder'
import { firebaseConfig } from '../../../firebase-config'

interface EditorPageProps {
  params: {
    pageId: string
  }
}

export default function EditorPage({ params }: EditorPageProps) {
  return (
    <div style={{ height: '100vh' }}>
      <PageBuilder
        pageId={params.pageId}
        firebaseConfig={firebaseConfig}
        language="pt-BR"
        availableLanguages={['pt-BR', 'en', 'es']}
        collection="pages"
        onSave={(page) => {
          console.log('Page saved successfully:', page.title)
          // You can add custom save logic here
          // For example, trigger a revalidation or send analytics
        }}
        onError={(error) => {
          console.error('Editor error:', error)
          // You can add custom error handling here
          // For example, send error to monitoring service
        }}
        onLanguageChange={(language) => {
          console.log('Language changed to:', language)
          // You can add custom language change logic here
        }}
      />
    </div>
  )
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: EditorPageProps) {
  return {
    title: `Editor - ${params.pageId}`,
    description: 'Edit your page with JovJrx PageBuilder',
    robots: 'noindex, nofollow', // Don't index editor pages
  }
}
