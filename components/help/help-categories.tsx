import { BookOpen, Code, DollarSign, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics of using Colab Apes platform"
  },
  {
    title: "Project Management",
    icon: Code,
    description: "Managing your digital projects and teams"
  },
  {
    title: "Investments",
    icon: DollarSign,
    description: "Understanding Value Stake and investments"
  },
  {
    title: "Community",
    icon: Users,
    description: "Connecting with other creators and investors"
  }
]

export function HelpCategories() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Card key={category.title} className="cursor-pointer hover:bg-muted/50">
          <CardHeader>
            <category.icon className="h-8 w-8 mb-2" />
            <CardTitle className="text-lg">{category.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}