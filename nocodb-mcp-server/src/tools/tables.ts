import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { NocoDBClient } from "../client.js";

export const tableTools: Tool[] = [
  {
    name: "list_tables",
    description: "List all tables in a NocoDB base",
    inputSchema: {
      type: "object" as const,
      properties: {
        baseId: { type: "string", description: "The base ID" },
      },
      required: ["baseId"],
    },
  },
  {
    name: "get_table",
    description: "Get details of a specific table including its columns",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
      },
      required: ["tableId"],
    },
  },
  {
    name: "create_table",
    description: "Create a new table in a NocoDB base",
    inputSchema: {
      type: "object" as const,
      properties: {
        baseId: { type: "string", description: "The base ID" },
        table_name: { type: "string", description: "Name for the new table" },
        columns: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Column name" },
              uidt: {
                type: "string",
                description:
                  "UI data type: SingleLineText, Number, Checkbox, Date, Email, URL, etc.",
              },
            },
            required: ["title", "uidt"],
          },
          description: "Array of column definitions",
        },
      },
      required: ["baseId", "table_name", "columns"],
    },
  },
  {
    name: "update_table",
    description:
      "Update a table's metadata (e.g., title) in NocoDB",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        data: {
          type: "object",
          description:
            "Fields to update, e.g. { title: 'New Name' }",
        },
      },
      required: ["tableId", "data"],
    },
  },
  {
    name: "delete_table",
    description: "Delete a table from NocoDB",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID to delete" },
      },
      required: ["tableId"],
    },
  },
];

export async function handleTableTool(
  client: NocoDBClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_tables": {
      const { baseId } = args as { baseId: string };
      return client.get(`/meta/bases/${baseId}/tables`);
    }
    case "get_table": {
      const { tableId } = args as { tableId: string };
      return client.get(`/meta/tables/${tableId}`);
    }
    case "create_table": {
      const { baseId, table_name, columns } = args as {
        baseId: string;
        table_name: string;
        columns: Array<{ title: string; uidt: string; [key: string]: unknown }>;
      };
      return client.post(`/meta/bases/${baseId}/tables`, {
        table_name,
        columns,
      });
    }
    case "update_table": {
      const { tableId, data } = args as {
        tableId: string;
        data: Record<string, unknown>;
      };
      return client.patch(`/meta/tables/${tableId}`, data);
    }
    case "delete_table": {
      const { tableId } = args as { tableId: string };
      return client.delete(`/meta/tables/${tableId}`);
    }
    default:
      throw new Error(`Unknown table tool: ${toolName}`);
  }
}
