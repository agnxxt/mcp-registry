import type { GlitchTipClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_issue_events",
    description: "List all events for a specific issue.",
    inputSchema: {
      type: "object",
      required: ["issue_id"],
      properties: {
        issue_id: { type: "string", description: "Issue ID" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.get(`/issues/${args.issue_id}/events/`);
    },
  },
  {
    name: "get_event",
    description: "Get a specific event by its ID within a project.",
    inputSchema: {
      type: "object",
      required: ["organization_slug", "project_slug", "event_id"],
      properties: {
        organization_slug: { type: "string", description: "Organization slug" },
        project_slug: { type: "string", description: "Project slug" },
        event_id: { type: "string", description: "Event ID" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.get(
        `/projects/${args.organization_slug}/${args.project_slug}/events/${args.event_id}/`
      );
    },
  },
];
