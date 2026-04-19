import type { TypebotClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_workspaces",
    description: "List all workspaces.",
    inputSchema: { type: "object", properties: {} },
    handler: async (client) => client.get("/workspaces"),
  },
  {
    name: "create_workspace",
    description: "Create a new workspace.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Workspace name" },
      },
    },
    handler: async (client, args) => client.post("/workspaces", { name: args.name }),
  },
];
