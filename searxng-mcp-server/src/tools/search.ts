import type { SearxngClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "searxng_search",
    description: "Search the web using SearXNG metasearch engine",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Search query" },
        categories: { type: "string", description: "Comma-separated categories (general, images, videos, news, music, files, it, science, social media)" },
        engines: { type: "string", description: "Comma-separated engine names" },
        language: { type: "string", description: "Search language (e.g. en, de, fr)" },
        pageno: { type: "number", description: "Page number (default 1)" },
      },
      required: ["q"],
    },
    handler: async (client: SearxngClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = { q: String(args.q), format: "json" };
      if (args.categories) params.categories = String(args.categories);
      if (args.engines) params.engines = String(args.engines);
      if (args.language) params.language = String(args.language);
      if (args.pageno) params.pageno = String(args.pageno);
      return client.get("/search", params);
    },
  },
  {
    name: "searxng_autocomplete",
    description: "Get search autocomplete suggestions",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Query to autocomplete" },
      },
      required: ["q"],
    },
    handler: async (client: SearxngClient, args: Record<string, unknown>) => {
      return client.get("/autocomplete", { q: String(args.q) });
    },
  },
  {
    name: "searxng_get_config",
    description: "Get SearXNG instance configuration",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: SearxngClient) => {
      return client.get("/config");
    },
  },
  {
    name: "searxng_get_engines",
    description: "Get list of available search engines from the SearXNG instance",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: SearxngClient) => {
      const config = (await client.get("/config")) as Record<string, unknown>;
      return (config as Record<string, unknown>).engines ?? [];
    },
  },
  {
    name: "searxng_get_categories",
    description: "Get list of available search categories from the SearXNG instance",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: SearxngClient) => {
      const config = (await client.get("/config")) as Record<string, unknown>;
      return (config as Record<string, unknown>).categories ?? [];
    },
  },
];
