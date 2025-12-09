export enum UserRole { ADMIN = 'ADMIN', USER = 'USER', ORGANIZER = 'ORGANIZER' }

export type User = {
  id: string;
  name?: string;
  email: string;
  role: UserRole | string;
  isVerified?: boolean;
};

export type EventScheduleItem = { time: string; activity: string };

export type Event = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  capacity?: number;
  registeredCount?: number;
  price?: number;
  imageUrl?: string;
  schedule?: EventScheduleItem[];
};
