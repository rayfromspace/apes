import { ArticleEditor } from "@/components/content/article-editor"
import { PageHeader } from "@/components/page-header"

export default function ArticlePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create Article"
        description="Write and publish an article to share with the community"
      />
      <ArticleEditor />
    </div>
  )
}