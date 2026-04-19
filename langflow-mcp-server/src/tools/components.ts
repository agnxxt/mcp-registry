import type { LangflowClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "langflow_list_components",
    description: "List all available components",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: LangflowClient) => {
      return client.get("/components");
    },
  },
  {
    name: "langflow_get_component",
    description: "Get details of a specific component by name",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Component name" },
      },
      required: ["name"],
    },
    handler: async (client: LangflowClient, args: Record<string, unknown>) => {
      return client.get(`/components/${args.name}`);
    },
  },
];
