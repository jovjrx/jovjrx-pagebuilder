// Example: Public Page for App Router
// app/[pageId]/page.tsx

import { PageRenderer } from 'jovjrx-pagebuilder'
import { firebaseConfig } from '../firebase-config'
import { Metadata } from 'next'

interface PublicPageProps {
  params: {
    pageId: string
  }
  searchParams: {
    lang?: string
    preview?: string
  }
}

export default function PublicPage({ params, searchParams }: PublicPageProps) {
  const language = searchParams.lang || 'pt-BR'
  const isPreview = searchParams.preview === 'true'

  return (
    <PageRenderer
      pageId={params.pageId}
      firebaseConfig={firebaseConfig}
      language={language}
      mode="dark"
      collection="pages"
      onLoad={(page) => {
        console.log('Page loaded:', page.title)
        // You can add analytics tracking here
        // For example: gtag('event', 'page_view', { page_id: params.pageId })
      }}
      onError={(error) => {
        console.error('Renderer error:', error)
        // You can add custom error handling here
      }}
    />
  )
}

// Generate metadata for SEO (App Router feature)
export async function generateMetadata({ params, searchParams }: PublicPageProps): Promise<Metadata> {
  const language = searchParams.lang || 'pt-BR'
  
  try {
    // In a real implementation, you would fetch the page data here
    // For this example, we'll use placeholder data
    const pageTitle = `Page ${params.pageId}`
    const pageDescription = `Description for page ${params.pageId}`
    
    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: 'website',
        locale: language,
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
      },
      alternates: {
        languages: {
          'pt-BR': `/${params.pageId}?lang=pt-BR`,
          'en': `/${params.pageId}?lang=en`,
          'es': `/${params.pageId}?lang=es`,
        },
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }
}

// Optional: Generate static params for static generation
export async function generateStaticParams() {
  // In a real implementation, you would fetch all page IDs from Firebase
  // For this example, we'll return an empty array (all pages will be generated on-demand)
  return []
}

// Optional: Configure page behavior
export const dynamic = 'force-dynamic' // Always render on-demand
export const revalidate = 60 // Revalidate every 60 seconds
