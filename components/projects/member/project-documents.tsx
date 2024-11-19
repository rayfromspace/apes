"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Upload } from "lucide-react"

interface ProjectDocumentsProps {
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
    name: "Technical Specs",
    type: "DOC",
    size: "1.8 MB",
    lastModified: "2024-03-14",
  },
  {
    name: "Design Assets",
    type: "ZIP",
    size: "15.2 MB",
    lastModified: "2024-03-13",
  },
]

export function ProjectDocuments({ id }: ProjectDocumentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}