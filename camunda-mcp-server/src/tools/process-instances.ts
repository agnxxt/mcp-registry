import type { CamundaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "camunda_create_process_instance",
    description: "Create a new process instance from a process definition",
    inputSchema: {
      type: "object",
      properties: {
        processDefinitionKey: { type: "string", description: "Key of the process definition" },
        variables: { type: "object", description: "Variables to pass to the process instance" },
        tenantId: { type: "string", description: "Tenant ID" },
      },
      required: ["processDefinitionKey"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/process-instances", args);
    },
  },
  {
    name: "camunda_search_process_instances",
    description: "Search for process instances with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria" },
        sort: { type: "array", description: "Sort criteria" },
        page: { type: "object", description: "Pagination with from and limit" },
      },
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/process-instances/search", args);
    },
  },
  {
    name: "camunda_get_process_instance",
    description: "Get a process instance by its key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Process instance key" },
      },
      required: ["key"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.get(`/process-instances/${args.key}`);
    },
  },
  {
    name: "camunda_cancel_process_instance",
    description: "Cancel a running process instance",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Process instance key" },
      },
      required: ["key"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post(`/process-instances/${args.key}/cancellation`);
    },
  },
];
