import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Upload, Trash2 } from "lucide-react"

interface ProjectDocumentsProps {
  id: string
}

const documents = [
  {
    name: "Project Proposal",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "John Doe",
    uploadedAt: "2024-03-15",
  },
  {
    name: "Technical Specifications",
    type: "DOC",
    size: "1.8 MB",
    uploadedBy: "Sarah Smith",
    uploadedAt: "2024-03-16",
  },
  {
    name: "Budget Plan",
    type: "XLS",
    size: "956 KB",
    uploadedBy: "Mike Johnson",
    uploadedAt: "2024-03-17",
  },
]

export function ProjectDocuments({ id }: ProjectDocumentsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Project Documents</h3>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy} on{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}