import type { Tool } from "../types.js";

export const pointsTools: Tool[] = [
  {
    name: "upsert_points",
    description: "Upsert points (vectors with payloads) into a collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        points: {
          type: "array",
          description: "Array of points with id, vector, and optional payload",
          items: {
            type: "object",
            properties: {
              id: { type: ["string", "number"], description: "Point ID" },
              vector: { type: "array", items: { type: "number" }, description: "Vector values" },
              payload: { type: "object", description: "Optional payload data" },
            },
            required: ["id", "vector"],
          },
        },
      },
      required: ["collection", "points"],
    },
    handler: async (client, args) => {
      const { collection, points } = args as { collection: string; points: unknown[] };
      return client.request("PUT", `/collections/${collection}/points`, { points });
    },
  },
  {
    name: "get_points",
    description: "Get points by their IDs",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        ids: {
          type: "array",
          description: "Array of point IDs to retrieve",
          items: { type: ["string", "number"] },
        },
      },
      required: ["collection", "ids"],
    },
    handler: async (client, args) => {
      const { collection, ids } = args as { collection: string; ids: unknown[] };
      return client.request("POST", `/collections/${collection}/points`, { ids });
    },
  },
  {
    name: "delete_points",
    description: "Delete points by IDs or filter",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        points: {
          type: "array",
          description: "Array of point IDs to delete",
          items: { type: ["string", "number"] },
        },
        filter: {
          type: "object",
          description: "Filter condition (alternative to points array)",
        },
      },
      required: ["collection"],
    },
    handler: async (client, args) => {
      const { collection, points, filter } = args as {
        collection: string;
        points?: unknown[];
        filter?: object;
      };
      const body = filter ? { filter } : { points: points ?? [] };
      return client.request("POST", `/collections/${collection}/points/delete`, body);
    },
  },
  {
    name: "scroll_points",
    description: "Scroll through points in a collection with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        filter: {
          type: "object",
          description: "Optional filter conditions",
        },
        limit: {
          type: "number",
          description: "Maximum number of points to return",
        },
        offset: {
          type: ["string", "number"],
          description: "Offset point ID for pagination",
        },
        with_payload: {
          type: "boolean",
          description: "Whether to include payload in results",
        },
        with_vector: {
          type: "boolean",
          description: "Whether to include vectors in results",
        },
      },
      required: ["collection"],
    },
    handler: async (client, args) => {
      const { collection, filter, limit, offset, with_payload, with_vector } = args as {
        collection: string;
        filter?: object;
        limit?: number;
        offset?: string | number;
        with_payload?: boolean;
        with_vector?: boolean;
      };
      const body: Record<string, unknown> = {};
      if (filter !== undefined) body.filter = filter;
      if (limit !== undefined) body.limit = limit;
      if (offset !== undefined) body.offset = offset;
      if (with_payload !== undefined) body.with_payload = with_payload;
      if (with_vector !== undefined) body.with_vector = with_vector;
      return client.request("POST", `/collections/${collection}/points/scroll`, body);
    },
  },
  {
    name: "count_points",
    description: "Count points in a collection with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        filter: {
          type: "object",
          description: "Optional filter conditions",
        },
        exact: {
          type: "boolean",
          description: "Whether to perform exact count (slower but accurate)",
        },
      },
      required: ["collection"],
    },
    handler: async (client, args) => {
      const { collection, filter, exact } = args as {
        collection: string;
        filter?: object;
        exact?: boolean;
      };
      const body: Record<string, unknown> = {};
      if (filter !== undefined) body.filter = filter;
      if (exact !== undefined) body.exact = exact;
      return client.request("POST", `/collections/${collection}/points/count`, body);
    },
  },
];
