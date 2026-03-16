import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOMetaProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'product' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  structuredData?: Record<string, any>
  noIndex?: boolean
  noFollow?: boolean
}

export const SEOMeta: React.FC<SEOMetaProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false,
  noFollow = false
}) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const fullUrl = canonical || `${baseUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage || `${baseUrl}/og-default.jpg`} />
      <meta property="og:site_name" content="Cross-Current Precision Armory" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || `${baseUrl}/og-default.jpg`} />
      
      {/* Robots meta tag */}
      {(noIndex || noFollow) && (
        <meta 
          name="robots" 
          content={`${noIndex ? 'noindex' : ''}${noIndex && noFollow ? ', ' : ''}${noFollow ? 'nofollow' : ''}`}
        />
      )}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEOMeta
