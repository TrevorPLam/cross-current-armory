import { BlogPost } from '../components/cms/BlogPost'
import { SEOMeta } from '../components/seo/SEOMeta'

export function BlogPostPage() {
  return (
    <>
      <SEOMeta
        title="Blog Post - Cross-Current Precision Armory"
        description="Read our latest article about tactical gear and equipment."
        keywords={['blog post', 'article', 'tactical gear', 'body armor', 'outdoor equipment']}
        ogType="article"
      />
      <BlogPost />
    </>
  )
}
