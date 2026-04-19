import type { N8nClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_workflows",
    description: "List all workflows. Supports pagination and filtering by tags, active status, or name.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max number of workflows to return" },
        cursor: { type: "string", description: "Pagination cursor from previous response" },
        tags: { type: "string", description: "Comma-separated tag names to filter by" },
        active: { type: "boolean", description: "Filter by active status" },
        name: { type: "string", description: "Filter by workflow name (partial match)" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.limit !== undefined) params.limit = String(args.limit);
      if (args.cursor) params.cursor = String(args.cursor);
      if (args.tags) params.tags = String(args.tags);
      if (args.active !== undefined) params.active = String(args.active);
      if (args.name) params.name = String(args.name);
      return client.get("/workflows", params);
    },
  },
  {
    name: "get_workflow",
    description: "Get a single workflow by ID, including its nodes, connections, and settings.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Workflow ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.get(`/workflows/${args.id}`),
  },
  {
    name: "create_workflow",
    description: "Create a new workflow with nodes, connections, and settings.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Workflow name" },
        nodes: {
          type: "array",
          description: "Array of node objects defining the workflow steps",
          items: { type: "object" },
        },
        connections: {
          type: "object",
          description: "Object defining connections between nodes",
        },
        settings: {
          type: "object",
          description: "Workflow settings (e.g. timezone, saveExecutionProgress)",
        },
        active: { type: "boolean", description: "Whether to activate the workflow immediately" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = { name: args.name };
      if (args.nodes !== undefined) body.nodes = args.nodes;
      if (args.connections !== undefined) body.connections = args.connections;
      if (args.settings !== undefined) body.settings = args.settings;
      if (args.active !== undefined) body.active = args.active;
      return client.post("/workflows", body);
    },
  },
  {
    name: "update_workflow",
    description: "Update an existing workflow by ID. Provide the fields you want to change.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Workflow ID" },
        name: { type: "string", description: "Updated workflow name" },
        nodes: {
          type: "array",
          description: "Updated array of node objects",
          items: { type: "object" },
        },
        connections: {
          type: "object",
          description: "Updated connections between nodes",
        },
        settings: {
          type: "object",
          description: "Updated workflow settings",
        },
        active: { type: "boolean", description: "Whether the workflow is active" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) => {
      const { id, ...body } = args;
      return client.put(`/workflows/${id}`, body);
    },
  },
  {
    name: "delete_workflow",
    description: "Delete a workflow by ID. This action is irreversible.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Workflow ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.delete(`/workflows/${args.id}`),
  },
  {
    name: "activate_workflow",
    description: "Activate a workflow so it starts listening for triggers.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Workflow ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.post(`/workflows/${args.id}/activate`),
  },
  {
    name: "deactivate_workflow",
    description: "Deactivate a workflow so it stops listening for triggers.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Workflow ID" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.post(`/workflows/${args.id}/deactivate`),
  },
  {
    name: "transfer_workflow",
    description: "Transfer a workflow to a different project.",
    inputSchema: {
      type: "object",
      required: ["id", "destinationProjectId"],
      properties: {
        id: { type: "string", description: "Workflow ID" },
        destinationProjectId: { type: "string", description: "Target project ID to transfer to" },
      },
    },
    handler: async (client: N8nClient, args: Record<string, unknown>) =>
      client.put(`/workflows/${args.id}/transfer`, {
        destinationProjectId: args.destinationProjectId,
      }),
  },
];
