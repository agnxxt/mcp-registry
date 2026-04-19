import type { N8nClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_credentials",
    description: "List all saved credentials. Returns metadata only, not secret values.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max number of credentials to return" },
        cursor: { type: "string", description: "Pagination cursor from previous response" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.limit !== undefined) params.limit = String(args.limit);
      if (args.cursor) params.cursor = String(args.cursor);
      return client.get("/credentials", params);
    },
  },
  {
    name: "get_credential",
    description: "Get a credential by ID. Returns metadata and schema, not secret values.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Credential ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.get(`/credentials/${args.id}`),
  },
  {
    name: "create_credential",
    description: "Create a new credential. Provide the credential type, name, and data (key-value pairs for the credential fields).",
    inputSchema: {
      type: "object",
      required: ["name", "type", "data"],
      properties: {
        name: { type: "string", description: "Display name for the credential" },
        type: { type: "string", description: "Credential type (e.g. 'slackApi', 'githubApi', 'httpBasicAuth')" },
        data: {
          type: "object",
          description: "Credential field values (e.g. { apiKey: '...', baseUrl: '...' })",
        },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.post("/credentials", {
        name: args.name,
        type: args.type,
        data: args.data,
      }),
  },
  {
    name: "update_credential",
    description: "Update an existing credential by ID. Provide updated name, type, or data fields.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Credential ID" },
        name: { type: "string", description: "Updated display name" },
        type: { type: "string", description: "Credential type" },
        data: {
          type: "object",
          description: "Updated credential field values",
        },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const { id, ...body } = args;
      return client.patch(`/credentials/${id}`, body);
    },
  },
  {
    name: "delete_credential",
    description: "Delete a credential by ID. Workflows using this credential will break.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Credential ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.delete(`/credentials/${args.id}`),
  },
];
