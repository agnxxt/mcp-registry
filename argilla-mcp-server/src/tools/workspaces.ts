import type { ArgillaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_workspaces",
    description:
      "List all workspaces in Argilla. Returns workspace IDs, names, and creation timestamps.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: ArgillaClient) => {
      return client.get("/workspaces");
    },
  },
  {
    name: "create_workspace",
    description:
      "Create a new workspace in Argilla. Workspaces are used to organize datasets and control access.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          description: "Name for the new workspace",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.post("/workspaces", { name: args.name });
    },
  },
  {
    name: "delete_workspace",
    description:
      "Delete a workspace by its ID. This will remove the workspace and its associations.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The UUID of the workspace to delete",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.delete(`/workspaces/${args.id}`);
    },
  },
];
