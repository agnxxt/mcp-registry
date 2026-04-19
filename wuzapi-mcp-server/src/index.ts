#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { WuzapiClient } from "./client.js";
import { messageTools, handleMessageTool } from "./tools/messages.js";
import { contactTools, handleContactTool } from "./tools/contacts.js";
import { sessionTools, handleSessionTool } from "./tools/session.js";

const WUZAPI_URL = process.env.WUZAPI_URL;
const WUZAPI_TOKEN = process.env.WUZAPI_TOKEN;

if (!WUZAPI_URL) {
  console.error("Error: WUZAPI_URL environment variable is required");
  process.exit(1);
}

if (!WUZAPI_TOKEN) {
  console.error("Error: WUZAPI_TOKEN environment variable is required");
  process.exit(1);
}

const client = new WuzapiClient({
  baseUrl: WUZAPI_URL,
  token: WUZAPI_TOKEN,
});

const allTools = [...messageTools, ...contactTools, ...sessionTools];

const messageToolNames = new Set(messageTools.map((t) => t.name));
const contactToolNames = new Set(contactTools.map((t) => t.name));
const sessionToolNames = new Set(sessionTools.map((t) => t.name));

const server = new Server(
  {
    name: "wuzapi-mcp-server",
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

    if (messageToolNames.has(name)) {
      result = await handleMessageTool(client, name, toolArgs);
    } else if (contactToolNames.has(name)) {
      result = await handleContactTool(client, name, toolArgs);
    } else if (sessionToolNames.has(name)) {
      result = await handleSessionTool(client, name, toolArgs);
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
  console.error("WuzAPI MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
