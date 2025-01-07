export interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  duration: number;
  type: 'meeting' | 'review' | 'call' | 'deadline' | 'other';
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
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'declined';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export type CreateEventInput = Omit<Event, 'id'>;
export type UpdateEventInput = Partial<CreateEventInput>;
