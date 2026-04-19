import type { Tool } from "../types.js";

export const namespacesTools: Tool[] = [
  {
    name: "list_namespaces",
    description: "List all namespaces in Marquez",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/namespaces");
    },
  },
  {
    name: "get_namespace",
    description: "Get details of a specific namespace",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Namespace name",
        },
      },
      required: ["name"],
    },
    handler: async (client, args) => {
      const { name } = args as { name: string };
      return client.request("GET", `/namespaces/${name}`);
    },
  },
  {
    name: "create_namespace",
    description: "Create or update a namespace",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Namespace name",
        },
        ownerName: {
          type: "string",
          description: "Owner of the namespace",
        },
        description: {
          type: "string",
          description: "Namespace description",
        },
      },
      required: ["name", "ownerName"],
    },
    handler: async (client, args) => {
      const { name, ownerName, description } = args as {
        name: string;
        ownerName: string;
        description?: string;
      };
      const body: Record<string, unknown> = { ownerName };
      if (description !== undefined) body.description = description;
      return client.request("PUT", `/namespaces/${name}`, body);
    },
  },
];
