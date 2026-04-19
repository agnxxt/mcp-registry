import { CalComClient } from "../client.js";
import {
  Availability,
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
} from "../types.js";

export function getAvailabilityTools() {
  return [
    {
      name: "list_availabilities",
      description:
        "List all availability configurations for the authenticated user. Returns availability schedules with days, start/end times.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "get_availability",
      description:
        "Get a specific availability configuration by its ID. Returns the schedule with days, time ranges, and timezone.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The availability ID",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "create_availability",
      description:
        "Create a new availability configuration. Specify name, timezone, and schedule entries with days and time ranges.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: {
            type: "string",
            description: "Name of the availability schedule",
          },
          timeZone: {
            type: "string",
            description:
              "Time zone for this availability (e.g. 'America/New_York')",
          },
          schedule: {
            type: "array",
            description:
              "Array of schedule entries, each with days (0=Sun..6=Sat), startTime, and endTime",
            items: {
              type: "object",
              properties: {
                days: {
                  type: "array",
                  items: { type: "number" },
                  description:
                    "Array of day numbers (0=Sunday, 1=Monday, ..., 6=Saturday)",
                },
                startTime: {
                  type: "string",
                  description: "Start time in HH:MM format (e.g. '09:00')",
                },
                endTime: {
                  type: "string",
                  description: "End time in HH:MM format (e.g. '17:00')",
                },
              },
              required: ["days", "startTime", "endTime"],
            },
          },
        },
        required: [],
      },
    },
    {
      name: "update_availability",
      description:
        "Update an existing availability configuration. Provide the ID and any fields to update.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The availability ID to update",
          },
          name: {
            type: "string",
            description: "Updated name",
          },
          timeZone: {
            type: "string",
            description: "Updated time zone",
          },
          schedule: {
            type: "array",
            description: "Updated schedule entries",
            items: {
              type: "object",
              properties: {
                days: {
                  type: "array",
                  items: { type: "number" },
                },
                startTime: { type: "string" },
                endTime: { type: "string" },
              },
              required: ["days", "startTime", "endTime"],
            },
          },
        },
        required: ["id"],
      },
    },
  ];
}

export async function handleAvailabilityTool(
  client: CalComClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_availabilities": {
      return await client.get<{ availabilities: Availability[] }>(
        "/availability"
      );
    }

    case "get_availability": {
      const id = args.id as number;
      return await client.get<{ availability: Availability }>(
        `/availability/${id}`
      );
    }

    case "create_availability": {
      const body: CreateAvailabilityInput = {};
      if (args.name !== undefined) body.name = args.name as string;
      if (args.timeZone !== undefined) body.timeZone = args.timeZone as string;
      if (args.schedule !== undefined)
        body.schedule =
          args.schedule as CreateAvailabilityInput["schedule"];
      return await client.post<{ availability: Availability }>(
        "/availability",
        body
      );
    }

    case "update_availability": {
      const id = args.id as number;
      const body: UpdateAvailabilityInput = {};
      if (args.name !== undefined) body.name = args.name as string;
      if (args.timeZone !== undefined) body.timeZone = args.timeZone as string;
      if (args.schedule !== undefined)
        body.schedule =
          args.schedule as UpdateAvailabilityInput["schedule"];
      return await client.patch<{ availability: Availability }>(
        `/availability/${id}`,
        body
      );
    }

    default:
      throw new Error(`Unknown availability tool: ${toolName}`);
  }
}
