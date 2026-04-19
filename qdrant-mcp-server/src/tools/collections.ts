import type { Tool } from "../types.js";

export const collectionsTools: Tool[] = [
  {
    name: "list_collections",
    description: "List all collections in Qdrant",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/collections");
    },
  },
  {
    name: "get_collection",
    description: "Get details of a specific collection",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Collection name",
        },
      },
      required: ["name"],
    },
    handler: async (client, args) => {
      const { name } = args as { name: string };
      return client.request("GET", `/collections/${name}`);
    },
  },
  {
    name: "create_collection",
    description: "Create a new collection with vector configuration",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Collection name",
        },
        size: {
          type: "number",
          description: "Vector dimension size",
        },
        distance: {
          type: "string",
          description: "Distance metric (Cosine, Euclid, Dot)",
          enum: ["Cosine", "Euclid", "Dot"],
        },
      },
      required: ["name", "size", "distance"],
    },
    handler: async (client, args) => {
      const { name, size, distance } = args as {
        name: string;
        size: number;
        distance: string;
      };
      return client.request("PUT", `/collections/${name}`, {
        vectors: { size, distance },
      });
    },
  },
  {
    name: "delete_collection",
    description: "Delete a collection",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Collection name",
        },
      },
      required: ["name"],
    },
    handler: async (client, args) => {
      const { name } = args as { name: string };
      return client.request("DELETE", `/collections/${name}`);
    },
  },
  {
    name: "create_index",
    description: "Create a payload index on a collection field",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Collection name",
        },
        field_name: {
          type: "string",
          description: "Field name to index",
        },
        field_schema: {
          type: "string",
          description: "Field schema type (keyword, integer, float, geo, text)",
        },
      },
      required: ["name", "field_name", "field_schema"],
    },
    handler: async (client, args) => {
      const { name, field_name, field_schema } = args as {
        name: string;
        field_name: string;
        field_schema: string;
      };
      return client.request("PUT", `/collections/${name}/index`, {
        field_name,
        field_schema,
      });
    },
  },
  {
    name: "delete_index",
    description: "Delete a payload index from a collection field",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Collection name",
        },
        field_name: {
          type: "string",
          description: "Field name to remove index from",
        },
      },
      required: ["name", "field_name"],
    },
    handler: async (client, args) => {
      const { name, field_name } = args as { name: string; field_name: string };
      return client.request("DELETE", `/collections/${name}/index/${field_name}`);
    },
  },
];
