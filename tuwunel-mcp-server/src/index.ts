#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { TuwunelClient } from "./client.js";
import { roomTools, handleRoomTool } from "./tools/rooms.js";
import { messageTools, handleMessageTool } from "./tools/messages.js";
import { userTools, handleUserTool } from "./tools/users.js";
import { adminTools, handleAdminTool } from "./tools/admin.js";

const TUWUNEL_URL = process.env.TUWUNEL_URL;
const TUWUNEL_ACCESS_TOKEN = process.env.TUWUNEL_ACCESS_TOKEN;
const TUWUNEL_USERNAME = process.env.TUWUNEL_USERNAME;
const TUWUNEL_PASSWORD = process.env.TUWUNEL_PASSWORD;

if (!TUWUNEL_URL) {
  console.error("Error: TUWUNEL_URL environment variable is required");
  process.exit(1);
}

if (!TUWUNEL_ACCESS_TOKEN && (!TUWUNEL_USERNAME || !TUWUNEL_PASSWORD)) {
  console.error(
    "Error: Either TUWUNEL_ACCESS_TOKEN or both TUWUNEL_USERNAME and TUWUNEL_PASSWORD are required"
  );
  process.exit(1);
}

const client = new TuwunelClient({
  baseUrl: TUWUNEL_URL,
  accessToken: TUWUNEL_ACCESS_TOKEN,
  username: TUWUNEL_USERNAME,
  password: TUWUNEL_PASSWORD,
});

const allTools = [
  ...roomTools,
  ...messageTools,
  ...userTools,
  ...adminTools,
];

const roomToolNames = new Set(roomTools.map((t) => t.name));
const messageToolNames = new Set(messageTools.map((t) => t.name));
const userToolNames = new Set(userTools.map((t) => t.name));
const adminToolNames = new Set(adminTools.map((t) => t.name));

const server = new Server(
  {
    name: "tuwunel-mcp-server",
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

    if (roomToolNames.has(name)) {
      result = await handleRoomTool(client, name, toolArgs);
    } else if (messageToolNames.has(name)) {
      result = await handleMessageTool(client, name, toolArgs);
    } else if (userToolNames.has(name)) {
      result = await handleUserTool(client, name, toolArgs);
    } else if (adminToolNames.has(name)) {
      result = await handleAdminTool(client, name, toolArgs);
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
  console.error("Tuwunel MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
