import type { GlitchTipClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_alerts",
    description: "List all alert rules for a project.",
    inputSchema: {
      type: "object",
      required: ["organization_slug", "project_slug"],
      properties: {
        organization_slug: { type: "string", description: "Organization slug" },
        project_slug: { type: "string", description: "Project slug" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.get(
        `/projects/${args.organization_slug}/${args.project_slug}/alerts/`
      );
    },
  },
  {
    name: "create_alert",
    description: "Create a new alert rule for a project.",
    inputSchema: {
      type: "object",
      required: ["organization_slug", "project_slug", "name", "timespan_minutes", "quantity"],
      properties: {
        organization_slug: { type: "string", description: "Organization slug" },
        project_slug: { type: "string", description: "Project slug" },
        name: { type: "string", description: "Alert rule name" },
        timespan_minutes: { type: "number", description: "Time window in minutes" },
        quantity: { type: "number", description: "Number of events to trigger alert" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.post(
        `/projects/${args.organization_slug}/${args.project_slug}/alerts/`,
        {
          name: args.name,
          timespan_minutes: args.timespan_minutes,
          quantity: args.quantity,
        }
      );
    },
  },
];
