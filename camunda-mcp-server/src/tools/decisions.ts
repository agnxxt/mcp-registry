import type { CamundaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "camunda_search_decision_definitions",
    description: "Search for decision definitions (DMN) with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria for decision definitions" },
        sort: { type: "array", description: "Sort criteria" },
        page: { type: "object", description: "Pagination with from and limit" },
      },
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/decision-definitions/search", args);
    },
  },
  {
    name: "camunda_evaluate_decision",
    description: "Evaluate a decision definition by its key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Decision definition key" },
        variables: { type: "object", description: "Variables for decision evaluation" },
      },
      required: ["key"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      const { key, ...body } = args;
      return client.post(`/decision-definitions/${key}/evaluation`, body);
    },
  },
];
