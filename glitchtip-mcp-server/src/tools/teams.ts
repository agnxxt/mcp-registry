import type { GlitchTipClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_teams",
    description: "List all teams in an organization.",
    inputSchema: {
      type: "object",
      required: ["organization_slug"],
      properties: {
        organization_slug: { type: "string", description: "Organization slug" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.get(`/organizations/${args.organization_slug}/teams/`);
    },
  },
  {
    name: "create_team",
    description: "Create a new team in an organization.",
    inputSchema: {
      type: "object",
      required: ["organization_slug", "slug"],
      properties: {
        organization_slug: { type: "string", description: "Organization slug" },
        slug: { type: "string", description: "Team slug identifier" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.post(`/organizations/${args.organization_slug}/teams/`, {
        slug: args.slug,
      });
    },
  },
];
