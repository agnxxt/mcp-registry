import type { LangflowClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "langflow_list_folders",
    description: "List all folders",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: LangflowClient) => {
      return client.get("/folders/");
    },
  },
  {
    name: "langflow_create_folder",
    description: "Create a new folder",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Folder name" },
        description: { type: "string", description: "Folder description" },
      },
      required: ["name"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.post("/folders/", args);
    },
  },
  {
    name: "langflow_update_folder",
    description: "Update an existing folder",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Folder ID" },
        name: { type: "string", description: "New folder name" },
        description: { type: "string", description: "New folder description" },
      },
      required: ["id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      const { id, ...body } = args;
      return client.put(`/folders/${id}`, body);
    },
  },
  {
    name: "langflow_delete_folder",
    description: "Delete a folder by its ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Folder ID" },
      },
      required: ["id"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.delete(`/folders/${args.id}`);
    },
  },
];
