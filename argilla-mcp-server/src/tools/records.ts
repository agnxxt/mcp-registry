import type { ArgillaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_records",
    description:
      "List records in a dataset with pagination. Returns record fields, metadata, and any existing responses.",
    inputSchema: {
      type: "object",
      required: ["dataset_id"],
      properties: {
        dataset_id: {
          type: "string",
          description: "The UUID of the dataset",
        },
        limit: {
          type: "number",
          description: "Maximum number of records to return (default: 50)",
        },
        offset: {
          type: "number",
          description: "Number of records to skip (default: 0)",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      const params: Record<string, any> = {};
      if (args.limit !== undefined) params.limit = args.limit;
      if (args.offset !== undefined) params.offset = args.offset;
      return client.get(`/datasets/${args.dataset_id}/records`, params);
    },
  },
  {
    name: "get_record",
    description:
      "Get a single record by its ID. Returns the record fields, metadata, and all responses.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The UUID of the record",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.get(`/records/${args.id}`);
    },
  },
  {
    name: "create_records_bulk",
    description:
      "Create multiple records in a dataset in bulk. Each record should contain field values matching the dataset schema.",
    inputSchema: {
      type: "object",
      required: ["dataset_id", "items"],
      properties: {
        dataset_id: {
          type: "string",
          description: "The UUID of the dataset",
        },
        items: {
          type: "array",
          description:
            "Array of record objects, each with 'fields' matching the dataset field definitions",
          items: { type: "object" },
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.post(`/datasets/${args.dataset_id}/records/bulk`, {
        items: args.items,
      });
    },
  },
  {
    name: "update_record",
    description:
      "Update an existing record by its ID. Can update fields, metadata, or suggestions.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The UUID of the record to update",
        },
        fields: {
          type: "object",
          description: "Updated field values",
        },
        metadata: {
          type: "object",
          description: "Updated metadata key-value pairs",
        },
        suggestions: {
          type: "array",
          description: "Updated suggestion objects",
          items: { type: "object" },
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = {};
      if (args.fields !== undefined) body.fields = args.fields;
      if (args.metadata !== undefined) body.metadata = args.metadata;
      if (args.suggestions !== undefined) body.suggestions = args.suggestions;
      return client.patch(`/records/${args.id}`, body);
    },
  },
  {
    name: "delete_records_bulk",
    description:
      "Delete multiple records from a dataset in bulk. Provide an array of record UUIDs to remove.",
    inputSchema: {
      type: "object",
      required: ["dataset_id", "items"],
      properties: {
        dataset_id: {
          type: "string",
          description: "The UUID of the dataset",
        },
        items: {
          type: "array",
          description: "Array of record UUIDs to delete",
          items: { type: "string" },
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.delete(`/datasets/${args.dataset_id}/records`, {
        items: args.items,
      });
    },
  },
  {
    name: "create_record_response",
    description:
      "Submit an annotation response for a record. Provide answer values matching the dataset questions and a status (submitted/discarded/draft).",
    inputSchema: {
      type: "object",
      required: ["record_id", "values", "status"],
      properties: {
        record_id: {
          type: "string",
          description: "The UUID of the record",
        },
        values: {
          type: "object",
          description:
            "Response values keyed by question name, each with a 'value' property",
        },
        status: {
          type: "string",
          description:
            "Response status: 'submitted', 'discarded', or 'draft'",
          enum: ["submitted", "discarded", "draft"],
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.post(`/records/${args.record_id}/responses`, {
        values: args.values,
        status: args.status,
      });
    },
  },
];
