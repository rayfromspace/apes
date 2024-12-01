import type { User } from './user';

export type ContentType = 'article' | 'video' | 'podcast' | 'course' | 'webinar';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearningContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  status: ContentStatus;
  difficulty: DifficultyLevel;
  author_id: string;
  thumbnail_url?: string;
  content_url: string;
  duration_minutes?: number;
  tags: string[];
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Course extends LearningContent {
  type: 'course';
  modules: CourseModule[];
  enrollment_count: number;
  completion_rate: number;
  prerequisites?: string[];
  certification?: boolean;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  duration_minutes: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  content_url: string;
  order: number;
  duration_minutes: number;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  lesson_id: string;
  title: string;
  type: 'pdf' | 'link' | 'code' | 'other';
  url: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percentage: number;
  completed: boolean;
  last_accessed: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserCertification {
  id: string;
  user_id: string;
  course_id: string;
  issued_date: string;
  certificate_url: string;
  expiry_date?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimated_duration: number;
  content_items: LearningPathItem[];
  prerequisites?: string[];
  created_at: string;
  updated_at: string;
}

export interface LearningPathItem {
  id: string;
  path_id: string;
  content_id: string;
  order: number;
  required: boolean;
  content: LearningContent;
}

export interface ContentEngagement {
  id: string;
  content_id: string;
  user_id: string;
  type: 'view' | 'like' | 'share' | 'comment';
  created_at: string;
}

export interface ContentComment {
  id: string;
  content_id: string;
  user_id: string;
  parent_id?: string;
  text: string;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: ContentComment[];
}

export interface LearningStats {
  total_content_completed: number;
  total_time_spent: number;
  certificates_earned: number;
  current_streak: number;
  favorite_categories: string[];
  learning_paths_progress: Record<string, number>;
}
