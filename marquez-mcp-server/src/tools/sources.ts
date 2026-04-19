import type { Tool } from "../types.js";

export const sourcesTools: Tool[] = [
  {
    name: "list_sources",
    description: "List all data sources in Marquez",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/sources");
    },
  },
  {
    name: "get_source",
    description: "Get details of a specific data source",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Source name",
        },
      },
      required: ["name"],
    },
    handler: async (client, args) => {
      const { name } = args as { name: string };
      return client.request("GET", `/sources/${name}`);
    },
  },
  {
    name: "create_source",
    description: "Create or update a data source",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Source name",
        },
        type: {
          type: "string",
          description: "Source type (e.g. POSTGRESQL, MYSQL, KAFKA)",
        },
        connectionUrl: {
          type: "string",
          description: "Connection URL for the source",
        },
        description: {
          type: "string",
          description: "Source description",
        },
      },
      required: ["name", "type", "connectionUrl"],
    },
    handler: async (client, args) => {
      const { name, type, connectionUrl, description } = args as {
        name: string;
        type: string;
        connectionUrl: string;
        description?: string;
      };
      const body: Record<string, unknown> = { type, connectionUrl };
      if (description !== undefined) body.description = description;
      return client.request("PUT", `/sources/${name}`, body);
    },
  },
];
