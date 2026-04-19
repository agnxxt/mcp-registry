import type { GlitchTipClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_issues",
    description: "List issues for a project. Supports filtering by query, sort order, and status.",
    inputSchema: {
      type: "object",
      required: ["organization_slug", "project_slug"],
      properties: {
        organization_slug: { type: "string", description: "Organization slug" },
        project_slug: { type: "string", description: "Project slug" },
        query: { type: "string", description: "Search query string" },
        sort: { type: "string", description: "Sort order (e.g. date, priority, events, users)" },
        status: { type: "string", description: "Filter by status (unresolved, resolved, ignored)" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.query) params.query = String(args.query);
      if (args.sort) params.sort = String(args.sort);
      if (args.status) params.status = String(args.status);
      return client.get(
        `/projects/${args.organization_slug}/${args.project_slug}/issues/`,
        params
      );
    },
  },
  {
    name: "get_issue",
    description: "Get details of a specific issue by ID.",
    inputSchema: {
      type: "object",
      required: ["issue_id"],
      properties: {
        issue_id: { type: "string", description: "Issue ID" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.get(`/issues/${args.issue_id}/`);
    },
  },
  {
    name: "update_issue",
    description: "Update an issue's status (e.g. resolve, ignore, unresolve).",
    inputSchema: {
      type: "object",
      required: ["issue_id", "status"],
      properties: {
        issue_id: { type: "string", description: "Issue ID" },
        status: { type: "string", description: "New status (resolved, unresolved, ignored)" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.put(`/issues/${args.issue_id}/`, { status: args.status });
    },
  },
  {
    name: "delete_issue",
    description: "Delete an issue by ID.",
    inputSchema: {
      type: "object",
      required: ["issue_id"],
      properties: {
        issue_id: { type: "string", description: "Issue ID" },
      },
    },
    handler: async (client: GlitchTipClient, args: Record<string, unknown>) => {
      return client.delete(`/issues/${args.issue_id}/`);
    },
  },
];
