import type { LitellmClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "litellm_create_user",
    description: "Create a new user",
    inputSchema: {
      type: "object",
      properties: {
        user_email: { type: "string", description: "User email" },
        user_role: { type: "string", description: "User role (admin, user)" },
        max_budget: { type: "number", description: "Max budget for the user" },
        models: { type: "array", items: { type: "string" }, description: "Models the user can access" },
      },
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/user/new", args);
    },
  },
  {
    name: "litellm_list_users",
    description: "List all users",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: LitellmClient) => {
      return client.get("/user/list");
    },
  },
  {
    name: "litellm_get_user",
    description: "Get user info by ID",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "User ID" },
      },
      required: ["user_id"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.get("/user/info", { user_id: String(args.user_id) });
    },
  },
];
