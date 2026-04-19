import type { Tool } from "../types.js";

export const clusterTools: Tool[] = [
  {
    name: "cluster_info",
    description: "Get cluster information",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/cluster");
    },
  },
  {
    name: "collection_cluster_info",
    description: "Get cluster information for a specific collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
      },
      required: ["collection"],
    },
    handler: async (client, args) => {
      const { collection } = args as { collection: string };
      return client.request("GET", `/collections/${collection}/cluster`);
    },
  },
  {
    name: "list_aliases",
    description: "List all collection aliases",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/aliases");
    },
  },
  {
    name: "create_alias",
    description: "Create an alias for a collection",
    inputSchema: {
      type: "object",
      properties: {
        collection_name: {
          type: "string",
          description: "Target collection name",
        },
        alias_name: {
          type: "string",
          description: "Alias name to create",
        },
      },
      required: ["collection_name", "alias_name"],
    },
    handler: async (client, args) => {
      const { collection_name, alias_name } = args as {
        collection_name: string;
        alias_name: string;
      };
      return client.request("POST", "/collections/aliases", {
        actions: [
          {
            create_alias: {
              collection_name,
              alias_name,
            },
          },
        ],
      });
    },
  },
];
