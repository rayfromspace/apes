import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Users, Target, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectOverviewProps {
  id: string
}

const documents = [
  {
    name: "Project Proposal",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "2024-03-15",
  },
  {
    name: "Technical Specifications",
    type: "DOC",
    size: "1.8 MB",
    lastModified: "2024-03-20",
  },
  {
    name: "Design Assets",
    type: "ZIP",
    size: "15.2 MB",
    lastModified: "2024-03-25",
  },
]

export function ProjectOverview({ id }: ProjectOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Team Size</p>
              <p className="text-2xl font-bold">5 Members</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Due Date</p>
              <p className="text-2xl font-bold">Jun 30, 2024</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Time Remaining</p>
              <p className="text-2xl font-bold">45 Days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Funding Goal</p>
              <p className="text-2xl font-bold">$50,000</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Target className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Equity Offered</p>
              <p className="text-2xl font-bold">15%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Documents</CardTitle>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(doc.lastModified).toLocaleDateString()}
                  </span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our e-commerce platform aims to revolutionize online shopping with advanced features
            including AI-powered product recommendations, real-time inventory management, and
            seamless integration with multiple payment gateways. The platform will support both
            B2C and B2B transactions, with a focus on providing a superior user experience
            through intuitive design and robust performance.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}