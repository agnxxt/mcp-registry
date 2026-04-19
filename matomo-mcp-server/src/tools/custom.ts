import type { MatomoClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "call_api_method",
    description:
      "Call any Matomo API method directly. Use this for methods not covered by other tools. Pass the full method name (e.g. 'UserCountry.getCountry') and any additional parameters.",
    inputSchema: {
      type: "object",
      required: ["method"],
      properties: {
        method: {
          type: "string",
          description:
            "Full Matomo API method name (e.g. UserCountry.getCountry, Events.getCategory)",
        },
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        period: {
          type: "string",
          description: "Period: day, week, month, year, or range",
        },
        date: {
          type: "string",
          description: "Date string: YYYY-MM-DD, today, yesterday",
        },
        extraParams: {
          type: "object",
          description:
            "Any additional query parameters as key-value pairs to pass to the API method",
          additionalProperties: true,
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      const method = args.method as string;
      const params: Record<string, any> = {};
      if (args.idSite !== undefined) {
        params.idSite = args.idSite;
      } else {
        params.idSite = client.defaultSiteId;
      }
      if (args.period !== undefined) params.period = args.period;
      if (args.date !== undefined) params.date = args.date;
      if (args.extraParams && typeof args.extraParams === "object") {
        Object.assign(params, args.extraParams);
      }
      return client.call(method, params);
    },
  },
  {
    name: "get_row_evolution",
    description:
      "Get the evolution (time series) of a specific row/label from any Matomo report. Useful for tracking how a specific page, referrer, or keyword performs over time.",
    inputSchema: {
      type: "object",
      required: ["apiModule", "apiAction", "label", "period", "date"],
      properties: {
        idSite: {
          type: "number",
          description: "Site ID (defaults to MATOMO_SITE_ID env var)",
        },
        period: {
          type: "string",
          description: "Period: day, week, month, year",
          enum: ["day", "week", "month", "year"],
        },
        date: {
          type: "string",
          description:
            "Date range like 2024-01-01,2024-01-31 or last30, previous30",
        },
        apiModule: {
          type: "string",
          description: "The API module (e.g. Actions, Referrers, DevicesDetection)",
        },
        apiAction: {
          type: "string",
          description: "The API action (e.g. getPageUrls, getSearchEngines)",
        },
        label: {
          type: "string",
          description:
            "The label/row to get evolution for (e.g. a page URL path, a search engine name)",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("API.getRowEvolution", {
        idSite: args.idSite ?? client.defaultSiteId,
        period: args.period,
        date: args.date,
        apiModule: args.apiModule,
        apiAction: args.apiAction,
        label: args.label,
      });
    },
  },
];
