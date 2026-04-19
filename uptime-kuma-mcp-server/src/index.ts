#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { UptimeKumaClient } from "./client.js";
import { monitorTools, handleMonitorTool } from "./tools/monitors.js";
import { statusPageTools, handleStatusPageTool } from "./tools/status-pages.js";
import { notificationTools, handleNotificationTool } from "./tools/notifications.js";
import { miscTools, handleMiscTool } from "./tools/misc.js";

const UPTIME_KUMA_URL = process.env.UPTIME_KUMA_URL;
const UPTIME_KUMA_USERNAME = process.env.UPTIME_KUMA_USERNAME;
const UPTIME_KUMA_PASSWORD = process.env.UPTIME_KUMA_PASSWORD;

if (!UPTIME_KUMA_URL) {
  console.error("Error: UPTIME_KUMA_URL environment variable is required");
  process.exit(1);
}

if (!UPTIME_KUMA_USERNAME) {
  console.error("Error: UPTIME_KUMA_USERNAME environment variable is required");
  process.exit(1);
}

if (!UPTIME_KUMA_PASSWORD) {
  console.error("Error: UPTIME_KUMA_PASSWORD environment variable is required");
  process.exit(1);
}

const client = new UptimeKumaClient({
  baseUrl: UPTIME_KUMA_URL,
  username: UPTIME_KUMA_USERNAME,
  password: UPTIME_KUMA_PASSWORD,
});

const allTools = [
  ...monitorTools,
  ...statusPageTools,
  ...notificationTools,
  ...miscTools,
];

const monitorToolNames = new Set(monitorTools.map((t) => t.name));
const statusPageToolNames = new Set(statusPageTools.map((t) => t.name));
const notificationToolNames = new Set(notificationTools.map((t) => t.name));
const miscToolNames = new Set(miscTools.map((t) => t.name));

const server = new Server(
  {
    name: "uptime-kuma-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: allTools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const toolArgs = (args ?? {}) as Record<string, unknown>;

  try {
    let result: unknown;

    if (monitorToolNames.has(name)) {
      result = await handleMonitorTool(client, name, toolArgs);
    } else if (statusPageToolNames.has(name)) {
      result = await handleStatusPageTool(client, name, toolArgs);
    } else if (notificationToolNames.has(name)) {
      result = await handleNotificationTool(client, name, toolArgs);
    } else if (miscToolNames.has(name)) {
      result = await handleMiscTool(client, name, toolArgs);
    } else {
      return {
        content: [
          {
            type: "text" as const,
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Uptime Kuma MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
