import type { MatomoClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "get_page_urls",
    description:
      "Get page URL analytics including visits, unique visitors, bounce rate, and time on page for each URL.",
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
        flat: {
          type: "number",
          description: "Set to 1 to return a flat list instead of nested folders",
        },
        filter_limit: {
          type: "number",
          description: "Max number of rows to return (default: 100, use -1 for all)",
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
      if (args.flat !== undefined) params.flat = args.flat;
      if (args.filter_limit !== undefined) params.filter_limit = args.filter_limit;
      return client.call("Actions.getPageUrls", params);
    },
  },
  {
    name: "get_page_titles",
    description:
      "Get analytics by page title including visits, unique visitors, bounce rate, and average time on page.",
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
      return client.call("Actions.getPageTitles", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_downloads",
    description:
      "Get file download analytics including download URLs, number of downloads, and unique downloaders.",
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
      return client.call("Actions.getDownloads", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_outlinks",
    description:
      "Get outgoing link analytics showing which external URLs visitors clicked and how often.",
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
      return client.call("Actions.getOutlinks", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_site_search_keywords",
    description:
      "Get internal site search keywords showing what visitors searched for on the site, number of searches, and result pages visited.",
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
      return client.call("Actions.getSiteSearchKeywords", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
];
