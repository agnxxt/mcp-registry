import type { SkyvernClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "skyvern_create_task",
    description: "Create a new browser automation task",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL to navigate to" },
        navigation_goal: { type: "string", description: "Goal for the browser agent" },
        data_extraction_goal: { type: "string", description: "Data extraction goal" },
        navigation_payload: { type: "object", description: "Additional payload for navigation" },
        proxy_location: { type: "string", description: "Proxy location" },
        webhook_callback_url: { type: "string", description: "Webhook URL for completion" },
      },
      required: ["url"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      return client.post("/tasks", args);
    },
  },
  {
    name: "skyvern_get_task",
    description: "Get task details by ID",
    inputSchema: {
      type: "object",
      properties: {
        task_id: { type: "string", description: "Task ID" },
      },
      required: ["task_id"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      return client.get(`/tasks/${args.task_id}`);
    },
  },
  {
    name: "skyvern_list_tasks",
    description: "List all tasks",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        page_size: { type: "number", description: "Page size" },
      },
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.page) params.page = String(args.page);
      if (args.page_size) params.page_size = String(args.page_size);
      return client.get("/tasks", params);
    },
  },
  {
    name: "skyvern_cancel_task",
    description: "Cancel a running task",
    inputSchema: {
      type: "object",
      properties: {
        task_id: { type: "string", description: "Task ID to cancel" },
      },
      required: ["task_id"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      return client.post(`/tasks/${args.task_id}/cancel`);
    },
  },
  {
    name: "skyvern_get_task_steps",
    description: "Get steps of a task",
    inputSchema: {
      type: "object",
      properties: {
        task_id: { type: "string", description: "Task ID" },
      },
      required: ["task_id"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      return client.get(`/tasks/${args.task_id}/steps`);
    },
  },
];
