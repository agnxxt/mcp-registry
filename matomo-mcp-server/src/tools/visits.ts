import type { MatomoClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "get_visits_summary",
    description:
      "Get a summary of visit metrics for a site including unique visitors, visits, actions, bounce rate, and average visit duration.",
    inputSchema: {
      type: "object",
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        period: {
          type: "string",
          description:
            "Period: day, week, month, year, or range",
          enum: ["day", "week", "month", "year", "range"],
        },
        date: {
          type: "string",
          description:
            "Date string: YYYY-MM-DD, today, yesterday, or range like 2024-01-01,2024-01-31",
        },
      },
      required: ["period", "date"],
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("VisitsSummary.get", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_live_visits",
    description:
      "Get the last N visits in real-time with full details including visitor info, actions taken, referrer, device, and location.",
    inputSchema: {
      type: "object",
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
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
        countVisitorsToFetch: {
          type: "number",
          description: "Number of visitors to return (default: 10)",
        },
      },
      required: ["period", "date"],
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      const params: Record<string, any> = {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      };
      if (args.countVisitorsToFetch !== undefined) {
        params.countVisitorsToFetch = args.countVisitorsToFetch;
      }
      return client.call("Live.getLastVisitsDetails", params);
    },
  },
  {
    name: "get_visitor_profile",
    description:
      "Get the full profile of a specific visitor including all their visits, actions, referrers, and ecommerce activity over time.",
    inputSchema: {
      type: "object",
      required: ["visitorId"],
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        visitorId: {
          type: "string",
          description: "The visitor ID (hex string from visitor log)",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Live.getVisitorProfile", {
        idSite: args.idSite ?? client.defaultSiteId,
        visitorId: args.visitorId,
      });
    },
  },
  {
    name: "get_visit_count",
    description:
      "Get real-time counters: visits, actions, converted visits, and visitors in the last N minutes.",
    inputSchema: {
      type: "object",
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        lastMinutes: {
          type: "number",
          description:
            "Number of minutes to look back (default: 30)",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      const params: Record<string, any> = {
        idSite: args.idSite ?? client.defaultSiteId,
      };
      if (args.lastMinutes !== undefined) {
        params.lastMinutes = args.lastMinutes;
      }
      return client.call("Live.getCounters", params);
    },
  },
  {
    name: "get_visits_over_time",
    description:
      "Get the number of visits over a time period. Useful for charting visit trends across days, weeks, or months.",
    inputSchema: {
      type: "object",
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        period: {
          type: "string",
          description: "Period: day, week, month, year, or range",
          enum: ["day", "week", "month", "year", "range"],
        },
        date: {
          type: "string",
          description:
            "Date string: YYYY-MM-DD, today, yesterday, or a range like last30",
        },
      },
      required: ["period", "date"],
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("VisitsSummary.getVisits", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
];
