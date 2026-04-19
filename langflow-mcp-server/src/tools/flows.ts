import type { LangflowClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "langflow_list_flows",
    description: "List all flows",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: LangflowClient) => {
      return client.get("/flows/");
    },
  },
  {
    name: "langflow_get_flow",
    description: "Get a flow by its ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Flow ID" },
      },
      required: ["id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.get(`/flows/${args.id}`);
    },
  },
  {
    name: "langflow_create_flow",
    description: "Create a new flow",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Flow name" },
        description: { type: "string", description: "Flow description" },
        data: { type: "object", description: "Flow graph data" },
        folder_id: { type: "string", description: "Folder ID to place the flow in" },
      },
      required: ["name"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.post("/flows/", args);
    },
  },
  {
    name: "langflow_update_flow",
    description: "Update an existing flow",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Flow ID" },
        name: { type: "string", description: "New flow name" },
        description: { type: "string", description: "New flow description" },
        data: { type: "object", description: "Updated flow graph data" },
      },
      required: ["id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      const { id, ...body } = args;
      return client.put(`/flows/${id}`, body);
    },
  },
  {
    name: "langflow_delete_flow",
    description: "Delete a flow by its ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Flow ID" },
      },
      required: ["id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.delete(`/flows/${args.id}`);
    },
  },
  {
    name: "langflow_run_flow",
    description: "Run a flow by its ID",
    inputSchema: {
      type: "object",
      properties: {
        flow_id: { type: "string", description: "Flow ID to run" },
        input_value: { type: "string", description: "Input value for the flow" },
        tweaks: { type: "object", description: "Tweaks to apply to the flow components" },
      },
      required: ["flow_id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      const { flow_id, ...body } = args;
      return client.post(`/run/${flow_id}`, body);
    },
  },
  {
    name: "langflow_get_task_status",
    description: "Get the status of a running task",
    inputSchema: {
      type: "object",
      properties: {
        task_id: { type: "string", description: "Task ID" },
      },
      required: ["task_id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.get(`/task/${args.task_id}`);
    },
  },
];
