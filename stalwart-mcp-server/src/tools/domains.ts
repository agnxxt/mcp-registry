import type { StalwartClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_domains",
    description: "List all domains configured on the Stalwart server.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: StalwartClient) => {
      return client.get("/domain");
    },
  },
  {
    name: "create_domain",
    description: "Create (register) a new domain on the Stalwart server.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Domain name (e.g. example.com)" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      return client.post(`/domain/${args.name}`);
    },
  },
  {
    name: "delete_domain",
    description: "Delete a domain from the Stalwart server.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Domain name to delete" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      return client.delete(`/domain/${args.name}`);
    },
  },
];
