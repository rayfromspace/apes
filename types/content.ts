export interface Author {
  name: string
  avatar: string
  role?: string
}

export interface Comment {
  id: string
  author: Author
  content: string
  timestamp: string
}

export interface ContentItem {
  id: string
  type: "post" | "article"
  content: string
  author: Author
  likes: number
  comments: Comment[]
  views: number
  tags: string[]
  publishedAt: string
  image?: string
}