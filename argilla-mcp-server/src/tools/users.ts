import type { ArgillaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_users",
    description:
      "List all users in Argilla. Returns user IDs, usernames, roles, and workspace assignments.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: ArgillaClient) => {
      return client.get("/users");
    },
  },
  {
    name: "get_current_user",
    description:
      "Get the currently authenticated user's profile. Returns username, role, API key info, and assigned workspaces.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: ArgillaClient) => {
      return client.get("/me");
    },
  },
];
