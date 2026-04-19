import type { TemporalClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "temporal_list_schedules",
    description: "List all schedules in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        page_size: { type: "number", description: "Page size" },
        next_page_token: { type: "string", description: "Next page token" },
      },
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const params: Record<string, string> = {};
      if (args.page_size) params.page_size = String(args.page_size);
      if (args.next_page_token) params.next_page_token = String(args.next_page_token);
      return client.get(`/namespaces/${ns}/schedules`, params);
    },
  },
  {
    name: "temporal_get_schedule",
    description: "Get details of a specific schedule",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        schedule_id: { type: "string", description: "Schedule ID" },
      },
      required: ["schedule_id"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      return client.get(`/namespaces/${ns}/schedules/${args.schedule_id}`);
    },
  },
  {
    name: "temporal_create_schedule",
    description: "Create a new schedule",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        schedule_id: { type: "string", description: "Schedule ID" },
        schedule: { type: "object", description: "Schedule specification" },
        action: { type: "object", description: "Action to execute on schedule" },
        policies: { type: "object", description: "Schedule policies" },
        memo: { type: "object", description: "Schedule memo" },
      },
      required: ["schedule_id", "schedule", "action"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const { namespace: _ns, ...body } = args;
      return client.post(`/namespaces/${ns}/schedules`, body);
    },
  },
  {
    name: "temporal_delete_schedule",
    description: "Delete a schedule",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        schedule_id: { type: "string", description: "Schedule ID to delete" },
      },
      required: ["schedule_id"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      return client.delete(`/namespaces/${ns}/schedules/${args.schedule_id}`);
    },
  },
];
