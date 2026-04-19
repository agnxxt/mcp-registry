import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { NocoDBClient } from "../client.js";

export const sortTools: Tool[] = [
  {
    name: "list_sorts",
    description: "List all sorts for a NocoDB view",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewId: { type: "string", description: "The view ID" },
      },
      required: ["viewId"],
    },
  },
  {
    name: "create_sort",
    description: "Create a new sort on a NocoDB view",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewId: { type: "string", description: "The view ID" },
        fk_column_id: {
          type: "string",
          description: "The column ID to sort by",
        },
        direction: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction: asc or desc",
        },
      },
      required: ["viewId", "fk_column_id", "direction"],
    },
  },
  {
    name: "delete_sort",
    description: "Delete a sort from a NocoDB view",
    inputSchema: {
      type: "object" as const,
      properties: {
        sortId: { type: "string", description: "The sort ID to delete" },
      },
      required: ["sortId"],
    },
  },
];

export async function handleSortTool(
  client: NocoDBClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_sorts": {
      const { viewId } = args as { viewId: string };
      return client.get(`/meta/views/${viewId}/sorts`);
    }
    case "create_sort": {
      const { viewId, fk_column_id, direction } = args as {
        viewId: string;
        fk_column_id: string;
        direction: "asc" | "desc";
      };
      return client.post(`/meta/views/${viewId}/sorts`, {
        fk_column_id,
        direction,
      });
    }
    case "delete_sort": {
      const { sortId } = args as { sortId: string };
      return client.delete(`/meta/sorts/${sortId}`);
    }
    default:
      throw new Error(`Unknown sort tool: ${toolName}`);
  }
}
