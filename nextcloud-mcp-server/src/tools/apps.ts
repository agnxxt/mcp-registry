import type { NextcloudClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_apps",
    description:
      "List all installed apps on the Nextcloud instance. Returns app IDs.",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          description: "Filter: 'enabled' or 'disabled' (default: all)",
          enum: ["enabled", "disabled"],
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      let path = "/ocs/v2.php/cloud/apps?format=json";
      if (args.filter) path += `&filter=${args.filter}`;
      return client.ocs(path);
    },
  },
  {
    name: "get_capabilities",
    description:
      "Get the capabilities of the Nextcloud instance. Returns supported features, version info, and app capabilities.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: NextcloudClient) => {
      return client.ocs("/ocs/v1.php/cloud/capabilities?format=json");
    },
  },
  {
    name: "get_status",
    description:
      "Get the status of the Nextcloud instance. Returns version, installation state, maintenance mode, and edition.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: NextcloudClient) => {
      return client.get("/status.php");
    },
  },
  {
    name: "list_notifications",
    description:
      "List all notifications for the current user. Returns notification details including app, subject, message, and actions.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: NextcloudClient) => {
      return client.ocs(
        "/ocs/v2.php/apps/notifications/api/v2/notifications?format=json"
      );
    },
  },
  {
    name: "search_files",
    description:
      "Search for files by name/content using the Nextcloud unified search API.",
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: {
          type: "string",
          description: "Search query string",
        },
        cursor: {
          type: "number",
          description: "Pagination cursor (offset)",
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default: 20)",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      let path = `/ocs/v2.php/search/providers/files/search?term=${encodeURIComponent(String(args.query))}&format=json`;
      if (args.cursor !== undefined) path += `&cursor=${args.cursor}`;
      if (args.limit !== undefined) path += `&limit=${args.limit}`;
      return client.ocs(path);
    },
  },
];
