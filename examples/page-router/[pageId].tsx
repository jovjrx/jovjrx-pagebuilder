// Example: Public Page for Page Router
// pages/[pageId].tsx

import { PageRenderer } from 'jovjrx-pagebuilder'
import { firebaseConfig } from '../firebase-config'
import { GetServerSideProps, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'

interface PublicPageProps {
  pageId: string
  language: string
  isPreview: boolean
  pageData?: {
    title: string
    description: string
    seoTitle?: string
    seoDescription?: string
    ogImage?: string
  }
}

export default function PublicPage({ 
  pageId, 
  language, 
  isPreview, 
  pageData 
}: PublicPageProps) {
  return (
    <>
      <Head>
        <title>{pageData?.seoTitle || pageData?.title || `Page ${pageId}`}</title>
        <meta 
          name="description" 
          content={pageData?.seoDescription || pageData?.description || `Description for page ${pageId}`} 
        />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageData?.seoTitle || pageData?.title} />
        <meta property="og:description" content={pageData?.seoDescription || pageData?.description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={language} />
        {pageData?.ogImage && <meta property="og:image" content={pageData.ogImage} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData?.seoTitle || pageData?.title} />
        <meta name="twitter:description" content={pageData?.seoDescription || pageData?.description} />
        {pageData?.ogImage && <meta name="twitter:image" content={pageData.ogImage} />}
        
        {/* Language alternatives */}
        <link rel="alternate" hrefLang="pt-BR" href={`/${pageId}?lang=pt-BR`} />
        <link rel="alternate" hrefLang="en" href={`/${pageId}?lang=en`} />
        <link rel="alternate" hrefLang="es" href={`/${pageId}?lang=es`} />
      </Head>
      
      <PageRenderer
        pageId={pageId}
        firebaseConfig={firebaseConfig}
        language={language}
        mode="dark"
        collection="pages"
        onLoad={(page) => {
          console.log('Page loaded:', page.title)
          // You can add analytics tracking here
          // For example: gtag('event', 'page_view', { page_id: pageId })
        }}
        onError={(error) => {
          console.error('Renderer error:', error)
          // You can add custom error handling here
        }}
      />
    </>
  )
}

// Option 1: Server-Side Rendering (SSR)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageId } = context.params!
  const { lang, preview } = context.query
  
  const language = (lang as string) || 'pt-BR'
  const isPreview = preview === 'true'
  
  try {
    // In a real implementation, you would fetch the page data here
    // For this example, we'll use placeholder data
    const pageData = {
      title: `Page ${pageId}`,
      description: `Description for page ${pageId}`,
      seoTitle: `SEO Title for ${pageId}`,
      seoDescription: `SEO Description for page ${pageId}`,
    }
    
    return {
      props: {
        pageId: pageId as string,
        language,
        isPreview,
        pageData,
      },
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    
    return {
      notFound: true,
    }
  }
}

// Option 2: Static Site Generation (SSG) - Uncomment to use instead of SSR
/*
export const getStaticProps: GetStaticProps = async (context) => {
  const { pageId } = context.params!
  
  try {
    // Fetch page data from Firebase
    const pageData = {
      title: `Page ${pageId}`,
      description: `Description for page ${pageId}`,
    }
    
    return {
      props: {
        pageId: pageId as string,
        language: 'pt-BR',
        isPreview: false,
        pageData,
      },
      revalidate: 60, // Revalidate every 60 seconds
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real implementation, you would fetch all page IDs from Firebase
  // For this example, we'll return an empty array (all pages will be generated on-demand)
  return {
    paths: [],
    fallback: 'blocking', // Generate pages on-demand
  }
}
*/
