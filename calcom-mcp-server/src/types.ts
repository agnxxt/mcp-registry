// Cal.com API Types

export interface CalComConfig {
  baseUrl: string;
  apiKey: string;
}

// Event Types
export interface EventType {
  id: number;
  title: string;
  slug: string;
  length: number;
  description?: string;
  locations?: EventTypeLocation[];
  hidden?: boolean;
  position?: number;
  teamId?: number | null;
  schedulingType?: string | null;
  userId?: number;
  price?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface EventTypeLocation {
  type: string;
  address?: string;
  link?: string;
  displayLocationPublicly?: boolean;
}

export interface CreateEventTypeInput {
  title: string;
  slug: string;
  length: number;
  description?: string;
  locations?: EventTypeLocation[];
  hidden?: boolean;
  teamId?: number;
  schedulingType?: string;
}

export interface UpdateEventTypeInput {
  title?: string;
  slug?: string;
  length?: number;
  description?: string;
  locations?: EventTypeLocation[];
  hidden?: boolean;
}

// Bookings
export interface Booking {
  id: number;
  userId: number;
  eventTypeId: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  attendees: BookingAttendee[];
  metadata?: Record<string, unknown>;
}

export interface BookingAttendee {
  email: string;
  name: string;
  timeZone: string;
  locale?: string;
}

export interface CreateBookingInput {
  eventTypeId: number;
  start: string;
  end: string;
  responses: {
    name: string;
    email: string;
    location?: string;
    notes?: string;
    [key: string]: unknown;
  };
  timeZone: string;
  language?: string;
  metadata?: Record<string, unknown>;
}

export interface ListBookingsParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CancelBookingInput {
  cancellationReason?: string;
}

export interface RescheduleBookingInput {
  start: string;
  end: string;
  rescheduleReason?: string;
}

// Availability
export interface Availability {
  id: number;
  userId?: number;
  scheduleId?: number;
  days: number[];
  startTime: string;
  endTime: string;
  date?: string;
}

export interface AvailabilityScheduleEntry {
  days: number[];
  startTime: string;
  endTime: string;
}

export interface CreateAvailabilityInput {
  name?: string;
  timeZone?: string;
  schedule?: AvailabilityScheduleEntry[];
}

export interface UpdateAvailabilityInput {
  name?: string;
  timeZone?: string;
  schedule?: AvailabilityScheduleEntry[];
}

// Schedules
export interface Schedule {
  id: number;
  userId: number;
  name: string;
  timeZone: string;
  availability: Availability[];
}

export interface CreateScheduleInput {
  name: string;
  timeZone?: string;
}

// Users
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  timeZone: string;
  bio?: string;
  avatar?: string;
  weekStart?: string;
  defaultScheduleId?: number;
}

// Teams
export interface Team {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  bio?: string;
  members?: TeamMember[];
}

export interface TeamMember {
  userId: number;
  teamId: number;
  role: string;
  accepted: boolean;
}

export interface CreateTeamInput {
  name: string;
  slug?: string;
}

// Webhooks
export interface Webhook {
  id: number;
  userId: number;
  subscriberUrl: string;
  eventTriggers: string[];
  active: boolean;
  payloadTemplate?: string;
  secret?: string;
}

export interface CreateWebhookInput {
  subscriberUrl: string;
  eventTriggers: string[];
  active?: boolean;
  payloadTemplate?: string;
  secret?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  [key: string]: T | T[] | unknown;
}
