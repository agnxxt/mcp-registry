import type { StalwartClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "get_settings",
    description: "Get the current Stalwart server settings/configuration.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: StalwartClient) => {
      return client.get("/settings");
    },
  },
  {
    name: "update_settings",
    description: "Update Stalwart server settings/configuration.",
    inputSchema: {
      type: "object",
      required: ["settings"],
      properties: {
        settings: {
          type: "object",
          description: "Settings object with key-value pairs to update",
        },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      return client.put("/settings", args.settings);
    },
  },
];
