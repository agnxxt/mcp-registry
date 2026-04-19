import type { CamundaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "camunda_search_variables",
    description: "Search for variables with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria for variables" },
        sort: { type: "array", description: "Sort criteria" },
        page: { type: "object", description: "Pagination with from and limit" },
      },
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/variables/search", args);
    },
  },
  {
    name: "camunda_update_variable",
    description: "Update a variable by its key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Variable key" },
        value: { type: "string", description: "New variable value" },
      },
      required: ["key", "value"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      const { key, ...body } = args;
      return client.put(`/variables/${key}`, body);
    },
  },
];
