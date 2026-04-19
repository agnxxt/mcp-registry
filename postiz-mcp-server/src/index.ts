#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { PostizClient } from "./client.js";
import { postTools, handlePostTool } from "./tools/posts.js";
import { channelTools, handleChannelTool } from "./tools/channels.js";
import { mediaTools, handleMediaTool } from "./tools/media.js";
import { analyticsTools, handleAnalyticsTool } from "./tools/analytics.js";

const POSTIZ_URL = process.env.POSTIZ_URL;
const POSTIZ_API_KEY = process.env.POSTIZ_API_KEY;

if (!POSTIZ_URL) {
  console.error("Error: POSTIZ_URL environment variable is required");
  process.exit(1);
}

if (!POSTIZ_API_KEY) {
  console.error("Error: POSTIZ_API_KEY environment variable is required");
  process.exit(1);
}

const client = new PostizClient({
  baseUrl: POSTIZ_URL,
  apiKey: POSTIZ_API_KEY,
});

const allTools = [
  ...postTools,
  ...channelTools,
  ...mediaTools,
  ...analyticsTools,
];

const postToolNames = new Set(postTools.map((t) => t.name));
const channelToolNames = new Set(channelTools.map((t) => t.name));
const mediaToolNames = new Set(mediaTools.map((t) => t.name));
const analyticsToolNames = new Set(analyticsTools.map((t) => t.name));

const server = new Server(
  {
    name: "postiz-mcp-server",
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

    if (postToolNames.has(name)) {
      result = await handlePostTool(client, name, toolArgs);
    } else if (channelToolNames.has(name)) {
      result = await handleChannelTool(client, name, toolArgs);
    } else if (mediaToolNames.has(name)) {
      result = await handleMediaTool(client, name, toolArgs);
    } else if (analyticsToolNames.has(name)) {
      result = await handleAnalyticsTool(client, name, toolArgs);
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
  console.error("Postiz MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
