import type { N8nClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_executions",
    description: "List workflow executions. Filter by status or workflow ID.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max number of executions to return" },
        cursor: { type: "string", description: "Pagination cursor from previous response" },
        status: {
          type: "string",
          description: "Filter by execution status",
          enum: ["error", "success", "waiting"],
        },
        workflowId: { type: "string", description: "Filter executions by workflow ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.limit !== undefined) params.limit = String(args.limit);
      if (args.cursor) params.cursor = String(args.cursor);
      if (args.status) params.status = String(args.status);
      if (args.workflowId) params.workflowId = String(args.workflowId);
      return client.get("/executions", params);
    },
  },
  {
    name: "get_execution",
    description: "Get details of a specific execution by ID, including node-level data.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Execution ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.get(`/executions/${args.id}`),
  },
  {
    name: "delete_execution",
    description: "Delete an execution record by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Execution ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.delete(`/executions/${args.id}`),
  },
  {
    name: "run_workflow",
    description: "Manually trigger a workflow execution. Optionally pass input data.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Workflow ID to execute" },
        data: {
          type: "object",
          description: "Optional input data to pass to the workflow trigger node",
        },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const body = args.data ? { data: args.data } : undefined;
      return client.post(`/workflows/${args.id}/run`, body);
    },
  },
  {
    name: "stop_execution",
    description: "Stop a currently running execution.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Execution ID to stop" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.post(`/executions/${args.id}/stop`),
  },
];
