import type { N8nClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_users",
    description: "List all users in the n8n instance.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max number of users to return" },
        cursor: { type: "string", description: "Pagination cursor from previous response" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.limit !== undefined) params.limit = String(args.limit);
      if (args.cursor) params.cursor = String(args.cursor);
      return client.get("/users", params);
    },
  },
  {
    name: "get_user",
    description: "Get a specific user by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "User ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.get(`/users/${args.id}`),
  },
  {
    name: "get_current_user",
    description: "Get the currently authenticated user (the API key owner).",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: N8nClient) => client.get("/me"),
  },
];
