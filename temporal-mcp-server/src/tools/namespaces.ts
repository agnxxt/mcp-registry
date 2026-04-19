import type { TemporalClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "temporal_list_namespaces",
    description: "List all Temporal namespaces",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: TemporalClient) => {
      return client.get("/namespaces");
    },
  },
  {
    name: "temporal_get_namespace",
    description: "Get details of a specific namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace name (defaults to configured namespace)" },
      },
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      return client.get(`/namespaces/${ns}`);
    },
  },
];
