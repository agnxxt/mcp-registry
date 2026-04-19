import type { Tool } from "../types.js";

export const searchTools: Tool[] = [
  {
    name: "search_points",
    description: "Search for nearest points by vector similarity",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        vector: {
          type: "array",
          items: { type: "number" },
          description: "Query vector",
        },
        limit: {
          type: "number",
          description: "Maximum number of results",
        },
        filter: {
          type: "object",
          description: "Optional filter conditions",
        },
        with_payload: {
          type: "boolean",
          description: "Whether to include payload in results",
        },
      },
      required: ["collection", "vector", "limit"],
    },
    handler: async (client, args) => {
      const { collection, vector, limit, filter, with_payload } = args as {
        collection: string;
        vector: number[];
        limit: number;
        filter?: object;
        with_payload?: boolean;
      };
      const body: Record<string, unknown> = { vector, limit };
      if (filter !== undefined) body.filter = filter;
      if (with_payload !== undefined) body.with_payload = with_payload;
      return client.request("POST", `/collections/${collection}/points/search`, body);
    },
  },
  {
    name: "recommend_points",
    description: "Recommend points based on positive and negative examples",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        positive: {
          type: "array",
          description: "Array of positive example point IDs",
          items: { type: ["string", "number"] },
        },
        negative: {
          type: "array",
          description: "Array of negative example point IDs",
          items: { type: ["string", "number"] },
        },
        limit: {
          type: "number",
          description: "Maximum number of results",
        },
        filter: {
          type: "object",
          description: "Optional filter conditions",
        },
      },
      required: ["collection", "positive", "limit"],
    },
    handler: async (client, args) => {
      const { collection, positive, negative, limit, filter } = args as {
        collection: string;
        positive: unknown[];
        negative?: unknown[];
        limit: number;
        filter?: object;
      };
      const body: Record<string, unknown> = { positive, limit };
      if (negative !== undefined) body.negative = negative;
      if (filter !== undefined) body.filter = filter;
      return client.request("POST", `/collections/${collection}/points/recommend`, body);
    },
  },
  {
    name: "search_batch",
    description: "Perform multiple search requests in a single batch",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        searches: {
          type: "array",
          description: "Array of search requests",
          items: {
            type: "object",
            properties: {
              vector: { type: "array", items: { type: "number" } },
              limit: { type: "number" },
              filter: { type: "object" },
              with_payload: { type: "boolean" },
            },
            required: ["vector", "limit"],
          },
        },
      },
      required: ["collection", "searches"],
    },
    handler: async (client, args) => {
      const { collection, searches } = args as { collection: string; searches: unknown[] };
      return client.request("POST", `/collections/${collection}/points/search/batch`, {
        searches,
      });
    },
  },
];
