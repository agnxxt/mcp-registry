import type { LitellmClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "litellm_list_models",
    description: "List all available models",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: LitellmClient) => {
      return client.get("/models");
    },
  },
  {
    name: "litellm_get_model_info",
    description: "Get detailed info about available models",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: LitellmClient) => {
      return client.get("/model/info");
    },
  },
  {
    name: "litellm_add_model",
    description: "Add a new model to the proxy",
    inputSchema: {
      type: "object",
      properties: {
        model_name: { type: "string", description: "Public-facing model name" },
        litellm_params: {
          type: "object",
          description: "LiteLLM params including model, api_key, api_base",
          properties: {
            model: { type: "string", description: "Provider model string (e.g. openai/gpt-4)" },
            api_key: { type: "string", description: "API key for the provider" },
            api_base: { type: "string", description: "API base URL" },
          },
          required: ["model"],
        },
      },
      required: ["model_name", "litellm_params"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/model/new", args);
    },
  },
  {
    name: "litellm_delete_model",
    description: "Delete a model from the proxy",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Model ID to delete" },
      },
      required: ["id"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/model/delete", args);
    },
  },
];
