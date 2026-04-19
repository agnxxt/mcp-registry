import type { TemporalClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "temporal_get_task_queue",
    description: "Get information about a task queue",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        task_queue: { type: "string", description: "Task queue name" },
      },
      required: ["task_queue"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      return client.get(`/namespaces/${ns}/task-queues/${args.task_queue}`);
    },
  },
  {
    name: "temporal_get_search_attributes",
    description: "Get search attributes for a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
      },
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      return client.get(`/namespaces/${ns}/search-attributes`);
    },
  },
  {
    name: "temporal_get_cluster_info",
    description: "Get Temporal cluster information",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: TemporalClient) => {
      return client.get("/cluster-info");
    },
  },
];
