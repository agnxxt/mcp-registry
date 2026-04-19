import type { GlitchTipClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_organizations",
    description: "List all organizations the authenticated user has access to.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: GlitchTipClient) => {
      return client.get("/organizations/");
    },
  },
  {
    name: "get_organization",
    description: "Get details of a specific organization by slug.",
    inputSchema: {
      type: "object",
      required: ["slug"],
      properties: {
        slug: { type: "string", description: "Organization slug" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.get(`/organizations/${args.slug}/`);
    },
  },
];
