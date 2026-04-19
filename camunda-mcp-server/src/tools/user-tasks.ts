import type { CamundaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "camunda_search_user_tasks",
    description: "Search for user tasks with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria for user tasks" },
        sort: { type: "array", description: "Sort criteria" },
        page: { type: "object", description: "Pagination with from and limit" },
      },
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/user-tasks/search", args);
    },
  },
  {
    name: "camunda_get_user_task",
    description: "Get a user task by its key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "User task key" },
      },
      required: ["key"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.get(`/user-tasks/${args.key}`);
    },
  },
  {
    name: "camunda_complete_user_task",
    description: "Complete a user task",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "User task key" },
        variables: { type: "object", description: "Variables to set on completion" },
      },
      required: ["key"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      const { key, ...body } = args;
      return client.post(`/user-tasks/${key}/completion`, body);
    },
  },
  {
    name: "camunda_assign_user_task",
    description: "Assign a user task to a user",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "User task key" },
        assignee: { type: "string", description: "User to assign the task to" },
        allowOverride: { type: "boolean", description: "Allow overriding existing assignment" },
      },
      required: ["key", "assignee"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      const { key, ...body } = args;
      return client.post(`/user-tasks/${key}/assignment`, body);
    },
  },
];
