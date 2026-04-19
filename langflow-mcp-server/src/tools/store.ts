import type { LangflowClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "langflow_store_list_components",
    description: "List components from the Langflow store",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Search query" },
        page: { type: "number", description: "Page number" },
        limit: { type: "number", description: "Results per page" },
      },
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.search) params.search = String(args.search);
      if (args.page) params.page = String(args.page);
      if (args.limit) params.limit = String(args.limit);
      return client.get("/store/components/", params);
    },
  },
  {
    name: "langflow_store_get_component",
    description: "Get a store component by its ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Store component ID" },
      },
      required: ["id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.get(`/store/components/${args.id}`);
    },
  },
  {
    name: "langflow_store_install_component",
    description: "Install a component from the store",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Store component ID to install" },
      },
      required: ["id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.post(`/store/components/${args.id}/install`);
    },
  },
  {
    name: "langflow_upload_flow",
    description: "Upload a flow from a file/JSON",
    inputSchema: {
      type: "object",
      properties: {
        data: { type: "object", description: "Flow data to upload" },
      },
      required: ["data"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.post("/flows/upload/", args.data);
    },
  },
  {
    name: "langflow_download_flow",
    description: "Download a flow as JSON",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Flow ID to download" },
      },
      required: ["id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.get(`/flows/${args.id}/download`);
    },
  },
];
