import type { Tool } from "../types.js";

export const queryTools: Tool[] = [
  {
    name: "query",
    description: "Execute a SurrealQL query against the database",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The SurrealQL query string to execute",
        },
      },
      required: ["query"],
    },
    handler: async (client, args) => {
      const { query } = args as { query: string };
      return client.request("POST", "/sql", query, {
        "Content-Type": "text/plain",
      });
    },
  },
];
