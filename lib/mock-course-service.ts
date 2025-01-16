"use client";

// This will be replaced with actual Coursera API integration
export interface CourseProvider {
  id: string;
  name: string;
  logo: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  provider: CourseProvider;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  enrolledCount: number;
  skills: string[];
  topics: string[];
  price: {
    isFree: boolean;
    amount?: number;
    currency?: string;
  };
  certificate: {
    available: boolean;
    type: string;
  };
  url: string;
}

export interface CourseRecommendation {
  courses: Course[];
  matchScore: number;
  reason: string;
}

export interface CourseQuery {
  interest: string;
  level: string;
  timeCommitment: string;
  learningStyle: string;
}

// Mock data that mimics Coursera's course structure
const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Python for Everybody",
    description: "Learn to Program and Analyze Data with Python. Develop programs to gather, clean, analyze, and visualize data.",
    provider: {
      id: "michigan",
      name: "University of Michigan",
      logo: "/placeholder.svg"
    },
    thumbnail: "/placeholder.svg",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.8,
    enrolledCount: 1234567,
    skills: ["Python", "Data Analysis", "Programming"],
    topics: ["Computer Science", "Data Science"],
    price: {
      isFree: true
    },
    certificate: {
      available: true,
      type: "Professional Certificate"
    },
    url: "https://coursera.org/learn/python"
  },
  {
    id: "2",
    title: "Machine Learning Specialization",
    description: "Build ML models with TensorFlow and scikit-learn. Master key concepts in machine learning and deep learning.",
    provider: {
      id: "stanford",
      name: "Stanford University",
      logo: "/placeholder.svg"
    },
    thumbnail: "/placeholder.svg",
    level: "Intermediate",
    duration: "12 weeks",
    rating: 4.9,
    enrolledCount: 987654,
    skills: ["Machine Learning", "Deep Learning", "Python"],
    topics: ["Artificial Intelligence", "Data Science"],
    price: {
      isFree: false,
      amount: 49,
      currency: "USD"
    },
    certificate: {
      available: true,
      type: "Specialization Certificate"
    },
    url: "https://coursera.org/learn/machine-learning"
  }
];

// Mock service that will be replaced with actual Coursera API calls
export class CourseService {
  async searchCourses(query: Partial<CourseQuery>): Promise<Course[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock filtering based on query parameters
    return MOCK_COURSES.filter(course => {
      if (query.level && course.level !== query.level) return false;
      if (query.interest && !course.topics.includes(query.interest)) return false;
      return true;
    });
  }

  async getRecommendations(query: CourseQuery): Promise<CourseRecommendation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock recommendations
    return [{
      courses: MOCK_COURSES,
      matchScore: 0.95,
      reason: "Based on your interest in " + query.interest
    }];
  }

  async getCourseDetails(courseId: string): Promise<Course | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return MOCK_COURSES.find(course => course.id === courseId) || null;
  }
}

// Export singleton instance
export const courseService = new CourseService();
