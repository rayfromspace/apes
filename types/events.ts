export interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  duration: number;
  type: 'meeting' | 'deadline' | 'other';
  projectId: string | null;
  projectName: string | null;
  location?: string | null;
  isVirtual: boolean;
  meetingLink?: string | null;
  createdBy: {
    id: string;
    name: string;
  };
  attendees?: {
    id: string;
    name: string;
  }[];
}

export interface EventAttendee {
  eventId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface CreateEventInput {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  duration: number;
  type: Event['type'];
  projectId: string;
  projectName?: string;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  createdBy: {
    id: string;
    name: string;
  };
  attendees?: {
    id: string;
    name: string;
  }[];
}

export type UpdateEventInput = Partial<CreateEventInput>;
