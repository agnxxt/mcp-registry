import type { MatomoClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_sites",
    description:
      "List all sites (websites/apps) configured in Matomo with their IDs, names, URLs, and settings.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: MatomoClient, _args: Record<string, unknown>) => {
      return client.call("SitesManager.getAllSites");
    },
  },
  {
    name: "get_site",
    description:
      "Get details of a specific site by its ID including name, main URL, creation date, timezone, and currency.",
    inputSchema: {
      type: "object",
      required: ["idSite"],
      properties: {
        idSite: {
          type: "number",
          description: "The site ID to retrieve",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("SitesManager.getSiteFromId", {
        idSite: args.idSite,
      });
    },
  },
  {
    name: "add_site",
    description:
      "Add a new site (website/app) to Matomo for tracking. Returns the new site ID.",
    inputSchema: {
      type: "object",
      required: ["siteName", "urls"],
      properties: {
        siteName: {
          type: "string",
          description: "Name of the site",
        },
        urls: {
          type: "string",
          description:
            "Comma-separated list of URLs for the site (e.g. https://example.com,https://www.example.com)",
        },
        ecommerce: {
          type: "number",
          description: "Enable ecommerce tracking (0 or 1)",
        },
        siteSearch: {
          type: "number",
          description: "Enable site search tracking (0 or 1)",
        },
        searchKeywordParameters: {
          type: "string",
          description: "Comma-separated query params used for site search keywords",
        },
        timezone: {
          type: "string",
          description: "Timezone (e.g. America/New_York)",
        },
        currency: {
          type: "string",
          description: "Currency code (e.g. USD, EUR)",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      const params: Record<string, any> = {
        siteName: args.siteName,
      };
      // Matomo expects urls as indexed params
      const urlStr = args.urls as string;
      const urlList = urlStr.split(",").map((u) => u.trim());
      urlList.forEach((url, i) => {
        params[`urls[${i}]`] = url;
      });
      if (args.ecommerce !== undefined) params.ecommerce = args.ecommerce;
      if (args.siteSearch !== undefined) params.siteSearch = args.siteSearch;
      if (args.searchKeywordParameters !== undefined) {
        params.searchKeywordParameters = args.searchKeywordParameters;
      }
      if (args.timezone !== undefined) params.timezone = args.timezone;
      if (args.currency !== undefined) params.currency = args.currency;
      return client.call("SitesManager.addSite", params);
    },
  },
  {
    name: "get_site_settings",
    description:
      "Get the settings/configuration for a specific site including tracking options, ecommerce, and search settings.",
    inputSchema: {
      type: "object",
      required: ["idSite"],
      properties: {
        idSite: {
          type: "number",
          description: "The site ID",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("SitesManager.getSiteSettings", {
        idSite: args.idSite,
      });
    },
  },
];
