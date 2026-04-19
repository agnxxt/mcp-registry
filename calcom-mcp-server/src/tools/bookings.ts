import { CalComClient } from "../client.js";
import {
  Booking,
  CreateBookingInput,
  CancelBookingInput,
  RescheduleBookingInput,
} from "../types.js";

export function getBookingTools() {
  return [
    {
      name: "list_bookings",
      description:
        "List bookings for the authenticated user. Optionally filter by status (ACCEPTED, PENDING, CANCELLED, REJECTED) and date range.",
      inputSchema: {
        type: "object" as const,
        properties: {
          status: {
            type: "string",
            description:
              "Filter by booking status: ACCEPTED, PENDING, CANCELLED, REJECTED",
          },
          dateFrom: {
            type: "string",
            description:
              "Filter bookings from this date (ISO 8601 format, e.g. 2024-01-01)",
          },
          dateTo: {
            type: "string",
            description:
              "Filter bookings until this date (ISO 8601 format, e.g. 2024-12-31)",
          },
        },
        required: [],
      },
    },
    {
      name: "get_booking",
      description:
        "Get a specific booking by its ID. Returns full booking details including attendees, event type, start/end times, and status.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The booking ID",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "create_booking",
      description:
        "Create a new booking. Requires eventTypeId, start/end times, attendee responses (name, email), and timeZone.",
      inputSchema: {
        type: "object" as const,
        properties: {
          eventTypeId: {
            type: "number",
            description: "The event type ID to book",
          },
          start: {
            type: "string",
            description: "Start time in ISO 8601 format",
          },
          end: {
            type: "string",
            description: "End time in ISO 8601 format",
          },
          responses: {
            type: "object",
            description:
              "Attendee responses object containing at minimum name and email",
            properties: {
              name: { type: "string", description: "Attendee name" },
              email: { type: "string", description: "Attendee email" },
              location: {
                type: "string",
                description: "Preferred location",
              },
              notes: { type: "string", description: "Additional notes" },
            },
            required: ["name", "email"],
          },
          timeZone: {
            type: "string",
            description:
              "Time zone for the booking (e.g. 'America/New_York', 'Europe/London')",
          },
          language: {
            type: "string",
            description: "Language code (e.g. 'en')",
          },
          metadata: {
            type: "object",
            description: "Additional metadata for the booking",
          },
        },
        required: ["eventTypeId", "start", "end", "responses", "timeZone"],
      },
    },
    {
      name: "cancel_booking",
      description:
        "Cancel a booking by its ID. Optionally provide a cancellation reason.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The booking ID to cancel",
          },
          cancellationReason: {
            type: "string",
            description: "Reason for cancellation",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "reschedule_booking",
      description:
        "Reschedule an existing booking to new start/end times. Optionally provide a reason for rescheduling.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The booking ID to reschedule",
          },
          start: {
            type: "string",
            description: "New start time in ISO 8601 format",
          },
          end: {
            type: "string",
            description: "New end time in ISO 8601 format",
          },
          rescheduleReason: {
            type: "string",
            description: "Reason for rescheduling",
          },
        },
        required: ["id", "start", "end"],
      },
    },
  ];
}

export async function handleBookingTool(
  client: CalComClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_bookings": {
      const params: Record<string, string> = {};
      if (args.status) params.status = args.status as string;
      if (args.dateFrom) params.dateFrom = args.dateFrom as string;
      if (args.dateTo) params.dateTo = args.dateTo as string;
      return await client.get<{ bookings: Booking[] }>("/bookings", params);
    }

    case "get_booking": {
      const id = args.id as number;
      return await client.get<{ booking: Booking }>(`/bookings/${id}`);
    }

    case "create_booking": {
      const body: CreateBookingInput = {
        eventTypeId: args.eventTypeId as number,
        start: args.start as string,
        end: args.end as string,
        responses: args.responses as CreateBookingInput["responses"],
        timeZone: args.timeZone as string,
      };
      if (args.language !== undefined) body.language = args.language as string;
      if (args.metadata !== undefined)
        body.metadata = args.metadata as Record<string, unknown>;
      return await client.post<Booking>("/bookings", body);
    }

    case "cancel_booking": {
      const id = args.id as number;
      const body: CancelBookingInput = {};
      if (args.cancellationReason !== undefined) {
        body.cancellationReason = args.cancellationReason as string;
      }
      return await client.delete(`/bookings/${id}`, body);
    }

    case "reschedule_booking": {
      const id = args.id as number;
      const body: RescheduleBookingInput = {
        start: args.start as string,
        end: args.end as string,
      };
      if (args.rescheduleReason !== undefined) {
        body.rescheduleReason = args.rescheduleReason as string;
      }
      return await client.patch(`/bookings/${id}/reschedule`, body);
    }

    default:
      throw new Error(`Unknown booking tool: ${toolName}`);
  }
}
