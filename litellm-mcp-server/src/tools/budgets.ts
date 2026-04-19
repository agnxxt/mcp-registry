import type { LitellmClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "litellm_get_budget",
    description: "Get budget info",
    inputSchema: {
      type: "object",
      properties: {
        budget_id: { type: "string", description: "Budget ID" },
      },
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.budget_id) params.budget_id = String(args.budget_id);
      return client.get("/budget/info", params);
    },
  },
  {
    name: "litellm_set_budget",
    description: "Create a new budget",
    inputSchema: {
      type: "object",
      properties: {
        max_budget: { type: "number", description: "Maximum budget amount" },
        budget_duration: { type: "string", description: "Budget duration (e.g. 30d, 1mo)" },
        soft_budget: { type: "number", description: "Soft budget limit for warnings" },
      },
      required: ["max_budget"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/budget/new", args);
    },
  },
  {
    name: "litellm_list_budgets",
    description: "List all budgets",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: LitellmClient) => {
      return client.get("/budget/list");
    },
  },
];
