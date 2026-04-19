import type { TypebotClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_results",
    description: "List results/submissions for a typebot.",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string" },
        limit: { type: "string", description: "Max results to return" },
        cursor: { type: "string", description: "Pagination cursor" },
      },
    },
    handler: async (client, args) => {
      const { typebotId, ...params } = args as Record<string, string>;
      return client.get(`/typebots/${typebotId}/results`, params);
    },
  },
  {
    name: "get_result",
    description: "Get a specific result by ID.",
    inputSchema: {
      type: "object",
      required: ["typebotId", "resultId"],
      properties: {
        typebotId: { type: "string" },
        resultId: { type: "string" },
      },
    },
    handler: async (client, args) =>
      client.get(`/typebots/${args.typebotId}/results/${args.resultId}`),
  },
  {
    name: "delete_results",
    description: "Delete all results for a typebot.",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string" },
      },
    },
    handler: async (client, args) =>
      client.delete(`/typebots/${args.typebotId}/results`),
  },
];
