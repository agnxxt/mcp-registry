import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { NocoDBClient } from "../client.js";

export const recordTools: Tool[] = [
  {
    name: "list_records",
    description:
      "List records from a NocoDB table with optional filtering, sorting, and pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        fields: {
          type: "string",
          description: "Comma-separated list of field names to include",
        },
        sort: {
          type: "string",
          description:
            "Sort string, e.g. 'field1' for asc or '-field1' for desc",
        },
        where: {
          type: "string",
          description:
            "Filter condition string, e.g. '(field1,eq,value1)~and(field2,gt,value2)'",
        },
        limit: {
          type: "number",
          description: "Number of records to return (default 25, max 1000)",
        },
        offset: {
          type: "number",
          description: "Number of records to skip",
        },
        viewId: {
          type: "string",
          description: "View ID to scope records to a specific view",
        },
      },
      required: ["tableId"],
    },
  },
  {
    name: "get_record",
    description: "Get a single record by ID from a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        recordId: { type: "string", description: "The record ID" },
      },
      required: ["tableId", "recordId"],
    },
  },
  {
    name: "create_record",
    description: "Create a new record in a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        data: {
          type: "object",
          description: "Object with field names as keys and values to set",
        },
      },
      required: ["tableId", "data"],
    },
  },
  {
    name: "update_record",
    description: "Update an existing record in a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        recordId: { type: "string", description: "The record ID to update" },
        data: {
          type: "object",
          description: "Object with field names and new values to update",
        },
      },
      required: ["tableId", "recordId", "data"],
    },
  },
  {
    name: "delete_record",
    description: "Delete a record from a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        recordId: { type: "string", description: "The record ID to delete" },
      },
      required: ["tableId", "recordId"],
    },
  },
  {
    name: "bulk_create_records",
    description: "Create multiple records at once in a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        records: {
          type: "array",
          items: { type: "object" },
          description: "Array of objects with field names as keys and values",
        },
      },
      required: ["tableId", "records"],
    },
  },
];

export async function handleRecordTool(
  client: NocoDBClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_records": {
      const { tableId, fields, sort, where, limit, offset, viewId } = args as {
        tableId: string;
        fields?: string;
        sort?: string;
        where?: string;
        limit?: number;
        offset?: number;
        viewId?: string;
      };
      return client.get(`/tables/${tableId}/records`, {
        fields,
        sort,
        where,
        limit,
        offset,
        viewId,
      });
    }
    case "get_record": {
      const { tableId, recordId } = args as {
        tableId: string;
        recordId: string;
      };
      return client.get(`/tables/${tableId}/records/${recordId}`);
    }
    case "create_record": {
      const { tableId, data } = args as {
        tableId: string;
        data: Record<string, unknown>;
      };
      return client.post(`/tables/${tableId}/records`, data);
    }
    case "update_record": {
      const { tableId, recordId, data } = args as {
        tableId: string;
        recordId: string;
        data: Record<string, unknown>;
      };
      return client.patch(`/tables/${tableId}/records/${recordId}`, data);
    }
    case "delete_record": {
      const { tableId, recordId } = args as {
        tableId: string;
        recordId: string;
      };
      return client.delete(`/tables/${tableId}/records/${recordId}`);
    }
    case "bulk_create_records": {
      const { tableId, records } = args as {
        tableId: string;
        records: Record<string, unknown>[];
      };
      return client.post(`/tables/${tableId}/records/bulk`, records);
    }
    default:
      throw new Error(`Unknown record tool: ${toolName}`);
  }
}
