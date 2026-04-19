import type { SkyvernClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "skyvern_create_workflow",
    description: "Create a new workflow",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Workflow title" },
        description: { type: "string", description: "Workflow description" },
        workflow_definition: { type: "object", description: "Workflow definition with blocks and parameters" },
      },
      required: ["title", "workflow_definition"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      return client.post("/workflows", args);
    },
  },
  {
    name: "skyvern_run_workflow",
    description: "Run an existing workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID to run" },
        data: { type: "object", description: "Input data for the workflow" },
        proxy_location: { type: "string", description: "Proxy location" },
      },
      required: ["workflow_id"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      const { workflow_id, ...body } = args;
      return client.post(`/workflows/${workflow_id}/run`, body);
    },
  },
  {
    name: "skyvern_get_workflow",
    description: "Get workflow details by ID",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
      },
      required: ["workflow_id"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      return client.get(`/workflows/${args.workflow_id}`);
    },
  },
  {
    name: "skyvern_list_workflows",
    description: "List all workflows",
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
      return client.get("/workflows", params);
    },
  },
  {
    name: "skyvern_delete_workflow",
    description: "Delete a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID to delete" },
      },
      required: ["workflow_id"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      return client.delete(`/workflows/${args.workflow_id}`);
    },
  },
  {
    name: "skyvern_get_workflow_run",
    description: "Get details of a specific workflow run",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
        run_id: { type: "string", description: "Run ID" },
      },
      required: ["workflow_id", "run_id"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      return client.get(`/workflows/${args.workflow_id}/runs/${args.run_id}`);
    },
  },
  {
    name: "skyvern_list_workflow_runs",
    description: "List all runs of a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
        page: { type: "number", description: "Page number" },
        page_size: { type: "number", description: "Page size" },
      },
      required: ["workflow_id"],
    },
    handler: async (client: SkyvernClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.page) params.page = String(args.page);
      if (args.page_size) params.page_size = String(args.page_size);
      return client.get(`/workflows/${args.workflow_id}/runs`, params);
    },
  },
];
