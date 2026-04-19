import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { NocoDBClient } from "../client.js";

export const fieldTools: Tool[] = [
  {
    name: "list_fields",
    description: "List all columns/fields of a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
      },
      required: ["tableId"],
    },
  },
  {
    name: "get_field",
    description: "Get details of a specific column/field",
    inputSchema: {
      type: "object" as const,
      properties: {
        columnId: { type: "string", description: "The column ID" },
      },
      required: ["columnId"],
    },
  },
  {
    name: "create_field",
    description: "Create a new column/field in a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        title: { type: "string", description: "Column name" },
        uidt: {
          type: "string",
          description:
            "UI data type: SingleLineText, LongText, Number, Decimal, Checkbox, Date, DateTime, Email, URL, PhoneNumber, Currency, Percent, Duration, Rating, SingleSelect, MultiSelect, Attachment, LinkToAnotherRecord, Lookup, Rollup, Formula, etc.",
        },
        options: {
          type: "object",
          description:
            "Additional column options depending on uidt (e.g., dtxp for select options)",
        },
      },
      required: ["tableId", "title", "uidt"],
    },
  },
  {
    name: "delete_field",
    description: "Delete a column/field from a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        columnId: {
          type: "string",
          description: "The column ID to delete",
        },
      },
      required: ["columnId"],
    },
  },
];

export async function handleFieldTool(
  client: NocoDBClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_fields": {
      const { tableId } = args as { tableId: string };
      return client.get(`/meta/tables/${tableId}/columns`);
    }
    case "get_field": {
      const { columnId } = args as { columnId: string };
      return client.get(`/meta/columns/${columnId}`);
    }
    case "create_field": {
      const { tableId, title, uidt, options } = args as {
        tableId: string;
        title: string;
        uidt: string;
        options?: Record<string, unknown>;
      };
      const body: Record<string, unknown> = { title, uidt, ...options };
      return client.post(`/meta/tables/${tableId}/columns`, body);
    }
    case "delete_field": {
      const { columnId } = args as { columnId: string };
      return client.delete(`/meta/columns/${columnId}`);
    }
    default:
      throw new Error(`Unknown field tool: ${toolName}`);
  }
}
