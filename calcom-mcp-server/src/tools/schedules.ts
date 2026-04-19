import { CalComClient } from "../client.js";
import { Schedule, CreateScheduleInput } from "../types.js";

export function getScheduleTools() {
  return [
    {
      name: "list_schedules",
      description:
        "List all schedules for the authenticated user. Returns schedules with their name, timezone, and associated availability.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "get_schedule",
      description:
        "Get a specific schedule by its ID. Returns the full schedule including name, timezone, and availability entries.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The schedule ID",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "create_schedule",
      description:
        "Create a new schedule. Requires a name and optionally a timezone.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: {
            type: "string",
            description: "Name of the schedule",
          },
          timeZone: {
            type: "string",
            description:
              "Time zone for the schedule (e.g. 'America/New_York'). Defaults to user's timezone.",
          },
        },
        required: ["name"],
      },
    },
    {
      name: "delete_schedule",
      description:
        "Delete a schedule by its ID. This action is irreversible and will remove all associated availability.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The schedule ID to delete",
          },
        },
        required: ["id"],
      },
    },
  ];
}

export async function handleScheduleTool(
  client: CalComClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_schedules": {
      return await client.get<{ schedules: Schedule[] }>("/schedules");
    }

    case "get_schedule": {
      const id = args.id as number;
      return await client.get<{ schedule: Schedule }>(`/schedules/${id}`);
    }

    case "create_schedule": {
      const body: CreateScheduleInput = {
        name: args.name as string,
      };
      if (args.timeZone !== undefined) body.timeZone = args.timeZone as string;
      return await client.post<{ schedule: Schedule }>("/schedules", body);
    }

    case "delete_schedule": {
      const id = args.id as number;
      return await client.delete(`/schedules/${id}`);
    }

    default:
      throw new Error(`Unknown schedule tool: ${toolName}`);
  }
}
