import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { NocoDBClient } from "../client.js";

export const viewTools: Tool[] = [
  {
    name: "list_views",
    description: "List all views for a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
      },
      required: ["tableId"],
    },
  },
  {
    name: "create_grid_view",
    description: "Create a new grid view for a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        title: { type: "string", description: "Name for the new grid view" },
      },
      required: ["tableId", "title"],
    },
  },
  {
    name: "create_form_view",
    description: "Create a new form view for a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        title: { type: "string", description: "Name for the new form view" },
      },
      required: ["tableId", "title"],
    },
  },
  {
    name: "create_gallery_view",
    description: "Create a new gallery view for a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        title: {
          type: "string",
          description: "Name for the new gallery view",
        },
      },
      required: ["tableId", "title"],
    },
  },
  {
    name: "delete_view",
    description: "Delete a view from a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewId: { type: "string", description: "The view ID to delete" },
      },
      required: ["viewId"],
    },
  },
];

export async function handleViewTool(
  client: NocoDBClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_views": {
      const { tableId } = args as { tableId: string };
      return client.get(`/meta/tables/${tableId}/views`);
    }
    case "create_grid_view": {
      const { tableId, title } = args as { tableId: string; title: string };
      return client.post(`/meta/tables/${tableId}/views`, {
        title,
        type: 3,
      });
    }
    case "create_form_view": {
      const { tableId, title } = args as { tableId: string; title: string };
      return client.post(`/meta/tables/${tableId}/views`, {
        title,
        type: 1,
      });
    }
    case "create_gallery_view": {
      const { tableId, title } = args as { tableId: string; title: string };
      return client.post(`/meta/tables/${tableId}/views`, {
        title,
        type: 2,
      });
    }
    case "delete_view": {
      const { viewId } = args as { viewId: string };
      return client.delete(`/meta/views/${viewId}`);
    }
    default:
      throw new Error(`Unknown view tool: ${toolName}`);
  }
}
