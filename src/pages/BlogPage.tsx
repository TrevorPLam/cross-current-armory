import { BlogEditor } from '../components/cms/BlogEditor'
import { SEOMeta } from '../components/seo/SEOMeta'

export function BlogPage() {
  return (
    <>
      <SEOMeta
        title="Blog - Cross-Current Precision Armory"
        description="Read the latest articles about tactical gear, body armor, and outdoor equipment."
        keywords={['blog', 'articles', 'gear reviews', 'tactical tips', 'body armor', 'outdoor equipment']}
      />
      <BlogEditor />
    </>
  )
}
