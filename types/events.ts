export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  duration: string; // in minutes
  date: string;
  type: 'meeting' | 'review' | 'call' | 'deadline' | 'other';
  projectId: string;
  projectName: string;
  attendees?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  location?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  createdBy: {
    id: string;
    name: string;
  };
}
