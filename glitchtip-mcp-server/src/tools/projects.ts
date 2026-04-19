import type { GlitchTipClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_projects",
    description: "List all projects in an organization.",
    inputSchema: {
      type: "object",
      required: ["organization_slug"],
      properties: {
        organization_slug: { type: "string", description: "Organization slug" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.get(`/organizations/${args.organization_slug}/projects/`);
    },
  },
  {
    name: "create_project",
    description: "Create a new project under a team in an organization.",
    inputSchema: {
      type: "object",
      required: ["organization_slug", "team_slug", "name"],
      properties: {
        organization_slug: { type: "string", description: "Organization slug" },
        team_slug: { type: "string", description: "Team slug" },
        name: { type: "string", description: "Project name" },
        platform: { type: "string", description: "Platform identifier (e.g. python, javascript)" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = { name: args.name };
      if (args.platform) body.platform = args.platform;
      return client.post(
        `/teams/${args.organization_slug}/${args.team_slug}/projects/`,
        body
      );
    },
  },
];
