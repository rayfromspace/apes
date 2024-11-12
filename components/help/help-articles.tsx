import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const articles = [
  {
    title: "How to Create a Project",
    category: "Getting Started",
    views: 1234
  },
  {
    title: "Setting Up Your Profile",
    category: "Getting Started",
    views: 987
  },
  {
    title: "Managing Team Members",
    category: "Project Management",
    views: 756
  },
  {
    title: "Investment Pools Explained",
    category: "Investments",
    views: 2341
  },
  {
    title: "Using Value Stake Protocol",
    category: "Investments",
    views: 1432
  }
]

export function HelpArticles() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Popular Articles</h2>
      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.title} className="cursor-pointer hover:bg-muted/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{article.category}</p>
                </div>
                <span className="text-sm text-muted-foreground">{article.views} views</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}