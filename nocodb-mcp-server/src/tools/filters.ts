import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { NocoDBClient } from "../client.js";

export const filterTools: Tool[] = [
  {
    name: "list_filters",
    description: "List all filters for a NocoDB view",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewId: { type: "string", description: "The view ID" },
      },
      required: ["viewId"],
    },
  },
  {
    name: "create_filter",
    description: "Create a new filter on a NocoDB view",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewId: { type: "string", description: "The view ID" },
        fk_column_id: {
          type: "string",
          description: "The column ID to filter on",
        },
        comparison_op: {
          type: "string",
          description:
            "Comparison operator: eq, neq, gt, ge, lt, le, like, nlike, is, isnot, empty, notempty, null, notnull, in, btw, nbtw",
        },
        value: {
          type: "string",
          description: "The filter value",
        },
      },
      required: ["viewId", "fk_column_id", "comparison_op", "value"],
    },
  },
  {
    name: "delete_filter",
    description: "Delete a filter from a NocoDB view",
    inputSchema: {
      type: "object" as const,
      properties: {
        filterId: { type: "string", description: "The filter ID to delete" },
      },
      required: ["filterId"],
    },
  },
];

export async function handleFilterTool(
  client: NocoDBClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_filters": {
      const { viewId } = args as { viewId: string };
      return client.get(`/meta/views/${viewId}/filters`);
    }
    case "create_filter": {
      const { viewId, fk_column_id, comparison_op, value } = args as {
        viewId: string;
        fk_column_id: string;
        comparison_op: string;
        value: string;
      };
      return client.post(`/meta/views/${viewId}/filters`, {
        fk_column_id,
        comparison_op,
        value,
      });
    }
    case "delete_filter": {
      const { filterId } = args as { filterId: string };
      return client.delete(`/meta/filters/${filterId}`);
    }
    default:
      throw new Error(`Unknown filter tool: ${toolName}`);
  }
}
