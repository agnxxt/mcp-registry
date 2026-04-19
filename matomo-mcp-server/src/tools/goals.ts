import type { MatomoClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "get_goals",
    description:
      "List all goals configured for a site including goal names, match criteria, revenue, and conversion rates.",
    inputSchema: {
      type: "object",
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Goals.getGoals", {
        idSite: args.idSite ?? client.defaultSiteId,
      });
    },
  },
  {
    name: "get_goal",
    description:
      "Get detailed analytics for a specific goal including conversion rate, revenue, and visits that converted.",
    inputSchema: {
      type: "object",
      required: ["idGoal", "period", "date"],
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        idGoal: {
          type: "number",
          description: "The goal ID to get metrics for",
        },
        period: {
          type: "string",
          description: "Period: day, week, month, year, or range",
          enum: ["day", "week", "month", "year", "range"],
        },
        date: {
          type: "string",
          description: "Date string: YYYY-MM-DD, today, yesterday",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Goals.get", {
        idSite: args.idSite ?? client.defaultSiteId,
        idGoal: args.idGoal,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "add_goal",
    description:
      "Create a new goal for a site. Goals track conversions based on URL patterns, page titles, file downloads, or external links.",
    inputSchema: {
      type: "object",
      required: ["name", "matchAttribute", "pattern", "patternType"],
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        name: {
          type: "string",
          description: "Goal name",
        },
        matchAttribute: {
          type: "string",
          description:
            "What to match: url, title, file, external_website, or manually",
          enum: ["url", "title", "file", "external_website", "manually"],
        },
        pattern: {
          type: "string",
          description:
            "The pattern to match against (e.g. a URL path or page title)",
        },
        patternType: {
          type: "string",
          description: "How to match the pattern",
          enum: ["contains", "exact", "regex"],
        },
        caseSensitive: {
          type: "number",
          description: "Whether match is case sensitive (0 or 1, default 0)",
        },
        revenue: {
          type: "number",
          description: "Default revenue for this goal conversion",
        },
        allowMultipleConversionsPerVisit: {
          type: "number",
          description:
            "Allow multiple conversions per visit (0 or 1, default 0)",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      const params: Record<string, any> = {
        idSite: args.idSite ?? client.defaultSiteId,
        name: args.name,
        matchAttribute: args.matchAttribute,
        pattern: args.pattern,
        patternType: args.patternType,
      };
      if (args.caseSensitive !== undefined) params.caseSensitive = args.caseSensitive;
      if (args.revenue !== undefined) params.revenue = args.revenue;
      if (args.allowMultipleConversionsPerVisit !== undefined) {
        params.allowMultipleConversionsPerVisit = args.allowMultipleConversionsPerVisit;
      }
      return client.call("Goals.addGoal", params);
    },
  },
  {
    name: "get_goal_conversions",
    description:
      "Get the number of conversions for a specific goal over a time period.",
    inputSchema: {
      type: "object",
      required: ["idGoal", "period", "date"],
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        idGoal: {
          type: "number",
          description: "The goal ID",
        },
        period: {
          type: "string",
          description: "Period: day, week, month, year, or range",
          enum: ["day", "week", "month", "year", "range"],
        },
        date: {
          type: "string",
          description: "Date string: YYYY-MM-DD, today, yesterday",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Goals.getConversions", {
        idSite: args.idSite ?? client.defaultSiteId,
        idGoal: args.idGoal,
        period: args.period,
        date: args.date,
      });
    },
  },
];
