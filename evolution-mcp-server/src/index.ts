#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { EvolutionClient } from "./client.js";
import { instanceTools, handleInstanceTool } from "./tools/instances.js";
import { messageTools, handleMessageTool } from "./tools/messages.js";
import { contactTools, handleContactTool } from "./tools/contacts.js";
import { groupTools, handleGroupTool } from "./tools/groups.js";
import { webhookTools, handleWebhookTool } from "./tools/webhooks.js";

const EVOLUTION_URL = process.env.EVOLUTION_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

if (!EVOLUTION_URL) {
  console.error("Error: EVOLUTION_URL environment variable is required");
  process.exit(1);
}

if (!EVOLUTION_API_KEY) {
  console.error("Error: EVOLUTION_API_KEY environment variable is required");
  process.exit(1);
}

const client = new EvolutionClient({
  baseUrl: EVOLUTION_URL,
  apiKey: EVOLUTION_API_KEY,
});

const allTools = [
  ...instanceTools,
  ...messageTools,
  ...contactTools,
  ...groupTools,
  ...webhookTools,
];

const instanceToolNames = new Set(instanceTools.map((t) => t.name));
const messageToolNames = new Set(messageTools.map((t) => t.name));
const contactToolNames = new Set(contactTools.map((t) => t.name));
const groupToolNames = new Set(groupTools.map((t) => t.name));
const webhookToolNames = new Set(webhookTools.map((t) => t.name));

const server = new Server(
  {
    name: "evolution-mcp-server",
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

    if (instanceToolNames.has(name)) {
      result = await handleInstanceTool(client, name, toolArgs);
    } else if (messageToolNames.has(name)) {
      result = await handleMessageTool(client, name, toolArgs);
    } else if (contactToolNames.has(name)) {
      result = await handleContactTool(client, name, toolArgs);
    } else if (groupToolNames.has(name)) {
      result = await handleGroupTool(client, name, toolArgs);
    } else if (webhookToolNames.has(name)) {
      result = await handleWebhookTool(client, name, toolArgs);
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
  console.error("Evolution MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
