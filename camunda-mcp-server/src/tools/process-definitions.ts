import type { CamundaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "camunda_search_process_definitions",
    description: "Search for process definitions with optional filter, sort, and pagination",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria for process definitions" },
        sort: { type: "array", description: "Sort criteria" },
        page: { type: "object", description: "Pagination with from and limit" },
      },
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/process-definitions/search", args);
    },
  },
  {
    name: "camunda_get_process_definition",
    description: "Get a process definition by its key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Process definition key" },
      },
      required: ["key"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.get(`/process-definitions/${args.key}`);
    },
  },
];
