import type { N8nClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_variables",
    description: "List all environment variables configured in n8n.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: N8nClient) => client.get("/variables"),
  },
  {
    name: "create_variable",
    description: "Create a new environment variable in n8n.",
    inputSchema: {
      type: "object",
      required: ["key", "value"],
      properties: {
        key: { type: "string", description: "Variable key/name" },
        value: { type: "string", description: "Variable value" },
        type: { type: "string", description: "Variable type (e.g. 'string')" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = {
        key: args.key,
        value: args.value,
      };
      if (args.type !== undefined) body.type = args.type;
      return client.post("/variables", body);
    },
  },
  {
    name: "update_variable",
    description: "Update an existing environment variable by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Variable ID" },
        key: { type: "string", description: "Updated variable key" },
        value: { type: "string", description: "Updated variable value" },
        type: { type: "string", description: "Updated variable type" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const { id, ...body } = args;
      return client.patch(`/variables/${id}`, body);
    },
  },
  {
    name: "delete_variable",
    description: "Delete an environment variable by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Variable ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.delete(`/variables/${args.id}`),
  },
];
