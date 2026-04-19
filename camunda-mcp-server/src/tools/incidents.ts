import type { CamundaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "camunda_search_incidents",
    description: "Search for incidents with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria for incidents" },
        sort: { type: "array", description: "Sort criteria" },
        page: { type: "object", description: "Pagination with from and limit" },
      },
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/incidents/search", args);
    },
  },
  {
    name: "camunda_resolve_incident",
    description: "Resolve an incident by its key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Incident key" },
      },
      required: ["key"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post(`/incidents/${args.key}/resolution`);
    },
  },
];
