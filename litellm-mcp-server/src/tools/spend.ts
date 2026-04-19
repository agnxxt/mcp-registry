import type { LitellmClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "litellm_spend_logs",
    description: "Get spend/usage logs",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "Filter by user ID" },
        api_key: { type: "string", description: "Filter by API key" },
        request_id: { type: "string", description: "Filter by request ID" },
        start_date: { type: "string", description: "Start date (YYYY-MM-DD)" },
        end_date: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      for (const [k, v] of Object.entries(args)) {
        if (v !== undefined && v !== null) params[k] = String(v);
      }
      return client.get("/spend/logs", params);
    },
  },
];
