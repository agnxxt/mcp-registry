import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TuwunelClient } from "../client.js";

export const adminTools: Tool[] = [
  {
    name: "sync",
    description: "Perform a sync to get latest events (long-polling supported)",
    inputSchema: {
      type: "object" as const,
      properties: {
        since: { type: "string", description: "Pagination token from a previous sync response" },
        timeout: { type: "number", description: "Long-poll timeout in milliseconds (0 for immediate)" },
        filter: { type: "string", description: "JSON-encoded filter to apply to the sync" },
      },
      required: [],
    },
  },
  {
    name: "list_public_rooms",
    description: "List or search public rooms on the server",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Maximum number of rooms to return" },
        generic_search_term: { type: "string", description: "Search term to filter rooms by name/topic" },
      },
      required: [],
    },
  },
  {
    name: "list_room_members",
    description: "List all members of a room",
    inputSchema: {
      type: "object" as const,
      properties: {
        roomId: { type: "string", description: "Room ID" },
      },
      required: ["roomId"],
    },
  },
];

export async function handleAdminTool(
  client: TuwunelClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "sync": {
      const { since, timeout, filter } = args as {
        since?: string;
        timeout?: number;
        filter?: string;
      };
      return client.get("/sync", { since, timeout, filter });
    }
    case "list_public_rooms": {
      const { limit, generic_search_term } = args as {
        limit?: number;
        generic_search_term?: string;
      };
      const body: Record<string, unknown> = {};
      if (limit !== undefined) body.limit = limit;
      if (generic_search_term !== undefined) {
        body.filter = { generic_search_term };
      }
      return client.post("/publicRooms", body);
    }
    case "list_room_members": {
      const { roomId } = args as { roomId: string };
      return client.get(`/rooms/${encodeURIComponent(roomId)}/members`);
    }
    default:
      throw new Error(`Unknown admin tool: ${toolName}`);
  }
}
