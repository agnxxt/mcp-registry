import type { MatomoClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "get_referrer_types",
    description:
      "Get visits breakdown by referrer type: direct entry, search engines, websites, campaigns, and social networks.",
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
      },
      required: ["period", "date"],
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Referrers.getReferrerType", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_all_referrers",
    description:
      "Get all referrers combined into a single report with visits, actions, and conversions per referrer.",
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
      },
      required: ["period", "date"],
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Referrers.getAll", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_search_engines",
    description:
      "Get visits from search engines (Google, Bing, etc.) with visit counts and keywords used.",
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
      },
      required: ["period", "date"],
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Referrers.getSearchEngines", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_keywords",
    description:
      "Get search keywords that brought visitors to the site from search engines.",
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
      },
      required: ["period", "date"],
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Referrers.getKeywords", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_websites",
    description:
      "Get referring websites that sent visitors to the site, with visit and action counts per domain.",
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
      },
      required: ["period", "date"],
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("Referrers.getWebsites", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
];
