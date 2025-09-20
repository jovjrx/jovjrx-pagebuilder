// Example: Editor Page for Page Router
// pages/admin/editor/[pageId].tsx

import { PageBuilder } from 'jovjrx-pagebuilder'
import { firebaseConfig } from '../../firebase-config'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

interface EditorPageProps {
  pageId: string
}

export default function EditorPage({ pageId }: EditorPageProps) {
  return (
    <>
      <Head>
        <title>Editor - {pageId}</title>
        <meta name="description" content="Edit your page with JovJrx PageBuilder" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div style={{ height: '100vh' }}>
        <PageBuilder
          pageId={pageId}
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
    </>
  )
}

// Server-side props to get the pageId
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageId } = context.params!
  
  // You can add authentication check here
  // For example:
  // const session = await getSession(context)
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   }
  // }
  
  return {
    props: {
      pageId: pageId as string,
    },
  }
}
