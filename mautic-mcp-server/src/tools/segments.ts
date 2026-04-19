import type { MauticClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_segments",
    description: "List all segments (contact lists) in Mautic.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search string to filter segments",
        },
        start: {
          type: "number",
          description: "Starting row index for pagination (default 0)",
        },
        limit: {
          type: "number",
          description: "Number of segments to return (default 30)",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.search) params.search = String(args.search);
      if (args.start !== undefined) params.start = String(args.start);
      if (args.limit !== undefined) params.limit = String(args.limit);
      return client.get("/segments", params);
    },
  },
  {
    name: "get_segment",
    description: "Get a single segment by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Segment ID" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.get(`/segments/${args.id}`),
  },
  {
    name: "create_segment",
    description:
      "Create a new segment (contact list) in Mautic with optional filters.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Segment name" },
        description: { type: "string", description: "Segment description" },
        isPublished: {
          type: "boolean",
          description: "Whether the segment is published (default true)",
        },
        isGlobal: {
          type: "boolean",
          description: "Whether the segment is global (visible to all users)",
        },
        filters: {
          type: "array",
          description:
            "Array of filter objects. Each filter has: glue (and/or), field, object (lead/company), type, operator, filter (value)",
          items: {
            type: "object",
            properties: {
              glue: {
                type: "string",
                enum: ["and", "or"],
                description: "Logical glue: and / or",
              },
              field: {
                type: "string",
                description: "Field alias to filter on",
              },
              object: {
                type: "string",
                enum: ["lead", "company"],
                description: "Object type: lead or company",
              },
              type: {
                type: "string",
                description: "Field type (e.g. text, email, boolean)",
              },
              operator: {
                type: "string",
                description: "Comparison operator (e.g. =, !=, like, !like, empty, !empty)",
              },
              filter: {
                type: "string",
                description: "Filter value",
              },
            },
          },
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = { name: args.name };
      if (args.description !== undefined) body.description = args.description;
      if (args.isPublished !== undefined) body.isPublished = args.isPublished;
      if (args.isGlobal !== undefined) body.isGlobal = args.isGlobal;
      if (args.filters !== undefined) body.filters = args.filters;
      return client.post("/segments/new", body);
    },
  },
  {
    name: "add_contact_to_segment",
    description: "Add a contact to a segment.",
    inputSchema: {
      type: "object",
      required: ["id", "contactId"],
      properties: {
        id: { type: "number", description: "Segment ID" },
        contactId: { type: "number", description: "Contact ID to add" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.post(`/segments/${args.id}/contact/${args.contactId}/add`),
  },
  {
    name: "remove_contact_from_segment",
    description: "Remove a contact from a segment.",
    inputSchema: {
      type: "object",
      required: ["id", "contactId"],
      properties: {
        id: { type: "number", description: "Segment ID" },
        contactId: { type: "number", description: "Contact ID to remove" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.post(`/segments/${args.id}/contact/${args.contactId}/remove`),
  },
];
