import type { MatomoClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "get_device_types",
    description:
      "Get visits breakdown by device type: desktop, smartphone, tablet, phablet, console, TV, etc.",
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
      return client.call("DevicesDetection.getType", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_browsers",
    description:
      "Get visits breakdown by browser: Chrome, Firefox, Safari, Edge, etc. with version details.",
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
      return client.call("DevicesDetection.getBrowsers", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
  {
    name: "get_os",
    description:
      "Get visits breakdown by operating system version: Windows 11, macOS 14, Android 14, iOS 17, etc.",
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
      return client.call("DevicesDetection.getOsVersions", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
      });
    },
  },
];
