import type { LitellmClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "litellm_generate_key",
    description: "Generate a new API key",
    inputSchema: {
      type: "object",
      properties: {
        models: { type: "array", items: { type: "string" }, description: "Models this key can access" },
        duration: { type: "string", description: "Key duration (e.g. 30d, 1h)" },
        max_budget: { type: "number", description: "Max budget for this key" },
        user_id: { type: "string", description: "User ID to associate" },
        team_id: { type: "string", description: "Team ID to associate" },
        key_alias: { type: "string", description: "Human-readable alias" },
      },
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/key/generate", args);
    },
  },
  {
    name: "litellm_delete_key",
    description: "Delete an API key",
    inputSchema: {
      type: "object",
      properties: {
        keys: { type: "array", items: { type: "string" }, description: "Key(s) to delete" },
      },
      required: ["keys"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/key/delete", args);
    },
  },
  {
    name: "litellm_list_keys",
    description: "Get info about API keys",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Specific key to get info for" },
      },
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.key) params.key = String(args.key);
      return client.get("/key/info", params);
    },
  },
  {
    name: "litellm_update_key",
    description: "Update an existing API key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Key to update" },
        models: { type: "array", items: { type: "string" }, description: "Updated model access" },
        max_budget: { type: "number", description: "Updated max budget" },
        duration: { type: "string", description: "Updated duration" },
      },
      required: ["key"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/key/update", args);
    },
  },
];
