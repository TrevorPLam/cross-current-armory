import React from 'react'
import { Navigation } from '../../organisms/Navigation'
import { SEOMeta } from '../../seo/SEOMeta'

interface MarketingLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({
  children,
  title = 'Cross-Current Precision Armory',
  description = 'Texas Proud, Family Strong - Your trusted source for tactical gear and equipment.',
  keywords = ['tactical gear', 'body armor', 'outdoor equipment', 'survival gear'],
  canonical
}) => {
  return (
    <>
      <SEOMeta
        title={title}
        description={description}
        keywords={keywords}
        canonical={canonical}
      />
      <div className="min-h-screen bg-gray-50">
        <Navigation isMenuOpen={false} setIsMenuOpen={() => {}} isScrolled={false} />
        <main role="main">
          {children}
        </main>
      </div>
    </>
  )
}

export default MarketingLayout
