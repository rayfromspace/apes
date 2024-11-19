"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

interface ProjectDocumentsProps {
  id: string
}

const documents = [
  {
    name: "Project Whitepaper",
    type: "PDF",
    size: "2.4 MB",
    date: "2024-01-15",
  },
  {
    name: "Technical Documentation",
    type: "PDF",
    size: "1.8 MB",
    date: "2024-01-20",
  },
  {
    name: "Financial Projections",
    type: "XLSX",
    size: "956 KB",
    date: "2024-02-01",
  },
]

export function ProjectDocuments({ id }: ProjectDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.name} className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{doc.name}</p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
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