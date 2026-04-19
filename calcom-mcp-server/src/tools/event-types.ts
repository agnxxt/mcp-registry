import { CalComClient } from "../client.js";
import {
  EventType,
  CreateEventTypeInput,
  UpdateEventTypeInput,
} from "../types.js";

export function getEventTypeTools() {
  return [
    {
      name: "list_event_types",
      description:
        "List all event types for the authenticated user. Returns an array of event types with their configuration including title, slug, duration, and locations.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "get_event_type",
      description:
        "Get a specific event type by its ID. Returns full details including title, slug, length, description, locations, and scheduling configuration.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The event type ID",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "create_event_type",
      description:
        "Create a new event type. Requires title, slug, and length (in minutes). Optionally set description, locations, and visibility.",
      inputSchema: {
        type: "object" as const,
        properties: {
          title: {
            type: "string",
            description: "The title of the event type",
          },
          slug: {
            type: "string",
            description: "URL-friendly slug for the event type",
          },
          length: {
            type: "number",
            description: "Duration of the event in minutes",
          },
          description: {
            type: "string",
            description: "Description of the event type",
          },
          locations: {
            type: "array",
            description:
              "Array of location objects with type (e.g. 'integrations:zoom', 'link', 'inPerson') and optional address/link",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                address: { type: "string" },
                link: { type: "string" },
                displayLocationPublicly: { type: "boolean" },
              },
              required: ["type"],
            },
          },
          hidden: {
            type: "boolean",
            description: "Whether to hide this event type from the public page",
          },
          teamId: {
            type: "number",
            description: "Team ID if this is a team event type",
          },
          schedulingType: {
            type: "string",
            description:
              "Scheduling type for team events: 'ROUND_ROBIN' or 'COLLECTIVE'",
          },
        },
        required: ["title", "slug", "length"],
      },
    },
    {
      name: "update_event_type",
      description:
        "Update an existing event type. Provide the ID and any fields to update (title, slug, length, description, locations, hidden).",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The event type ID to update",
          },
          title: {
            type: "string",
            description: "Updated title",
          },
          slug: {
            type: "string",
            description: "Updated slug",
          },
          length: {
            type: "number",
            description: "Updated duration in minutes",
          },
          description: {
            type: "string",
            description: "Updated description",
          },
          locations: {
            type: "array",
            description: "Updated locations array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                address: { type: "string" },
                link: { type: "string" },
                displayLocationPublicly: { type: "boolean" },
              },
              required: ["type"],
            },
          },
          hidden: {
            type: "boolean",
            description: "Updated visibility",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "delete_event_type",
      description:
        "Delete an event type by its ID. This action is irreversible.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The event type ID to delete",
          },
        },
        required: ["id"],
      },
    },
  ];
}

export async function handleEventTypeTool(
  client: CalComClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_event_types": {
      return await client.get<{ event_types: EventType[] }>("/event-types");
    }

    case "get_event_type": {
      const id = args.id as number;
      return await client.get<{ event_type: EventType }>(`/event-types/${id}`);
    }

    case "create_event_type": {
      const body: CreateEventTypeInput = {
        title: args.title as string,
        slug: args.slug as string,
        length: args.length as number,
      };
      if (args.description !== undefined)
        body.description = args.description as string;
      if (args.locations !== undefined)
        body.locations = args.locations as CreateEventTypeInput["locations"];
      if (args.hidden !== undefined) body.hidden = args.hidden as boolean;
      if (args.teamId !== undefined) body.teamId = args.teamId as number;
      if (args.schedulingType !== undefined)
        body.schedulingType = args.schedulingType as string;
      return await client.post<{ event_type: EventType }>("/event-types", body);
    }

    case "update_event_type": {
      const id = args.id as number;
      const body: UpdateEventTypeInput = {};
      if (args.title !== undefined) body.title = args.title as string;
      if (args.slug !== undefined) body.slug = args.slug as string;
      if (args.length !== undefined) body.length = args.length as number;
      if (args.description !== undefined)
        body.description = args.description as string;
      if (args.locations !== undefined)
        body.locations = args.locations as UpdateEventTypeInput["locations"];
      if (args.hidden !== undefined) body.hidden = args.hidden as boolean;
      return await client.patch<{ event_type: EventType }>(
        `/event-types/${id}`,
        body
      );
    }

    case "delete_event_type": {
      const id = args.id as number;
      return await client.delete(`/event-types/${id}`);
    }

    default:
      throw new Error(`Unknown event type tool: ${toolName}`);
  }
}
