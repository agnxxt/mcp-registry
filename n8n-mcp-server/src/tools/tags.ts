import type { N8nClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_tags",
    description: "List all tags used to organize workflows.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max number of tags to return" },
        cursor: { type: "string", description: "Pagination cursor from previous response" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.limit !== undefined) params.limit = String(args.limit);
      if (args.cursor) params.cursor = String(args.cursor);
      return client.get("/tags", params);
    },
  },
  {
    name: "get_tag",
    description: "Get a single tag by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Tag ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.get(`/tags/${args.id}`),
  },
  {
    name: "create_tag",
    description: "Create a new tag to organize workflows.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Tag name" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.post("/tags", { name: args.name }),
  },
  {
    name: "delete_tag",
    description: "Delete a tag by ID. Workflows with this tag will have it removed.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Tag ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.delete(`/tags/${args.id}`),
  },
];
