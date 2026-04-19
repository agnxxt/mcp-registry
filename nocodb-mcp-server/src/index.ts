#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { NocoDBClient } from "./client.js";
import { recordTools, handleRecordTool } from "./tools/records.js";
import { tableTools, handleTableTool } from "./tools/tables.js";
import { baseTools, handleBaseTool } from "./tools/bases.js";
import { fieldTools, handleFieldTool } from "./tools/fields.js";
import { viewTools, handleViewTool } from "./tools/views.js";
import { filterTools, handleFilterTool } from "./tools/filters.js";
import { sortTools, handleSortTool } from "./tools/sorts.js";
import { webhookTools, handleWebhookTool } from "./tools/webhooks.js";

const NOCODB_URL = process.env.NOCODB_URL;
const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN;

if (!NOCODB_URL) {
  console.error("Error: NOCODB_URL environment variable is required");
  process.exit(1);
}

if (!NOCODB_API_TOKEN) {
  console.error("Error: NOCODB_API_TOKEN environment variable is required");
  process.exit(1);
}

const client = new NocoDBClient({
  baseUrl: NOCODB_URL,
  apiToken: NOCODB_API_TOKEN,
});

const allTools = [
  ...recordTools,
  ...tableTools,
  ...baseTools,
  ...fieldTools,
  ...viewTools,
  ...filterTools,
  ...sortTools,
  ...webhookTools,
];

const recordToolNames = new Set(recordTools.map((t) => t.name));
const tableToolNames = new Set(tableTools.map((t) => t.name));
const baseToolNames = new Set(baseTools.map((t) => t.name));
const fieldToolNames = new Set(fieldTools.map((t) => t.name));
const viewToolNames = new Set(viewTools.map((t) => t.name));
const filterToolNames = new Set(filterTools.map((t) => t.name));
const sortToolNames = new Set(sortTools.map((t) => t.name));
const webhookToolNames = new Set(webhookTools.map((t) => t.name));

const server = new Server(
  {
    name: "nocodb-mcp-server",
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

    if (recordToolNames.has(name)) {
      result = await handleRecordTool(client, name, toolArgs);
    } else if (tableToolNames.has(name)) {
      result = await handleTableTool(client, name, toolArgs);
    } else if (baseToolNames.has(name)) {
      result = await handleBaseTool(client, name, toolArgs);
    } else if (fieldToolNames.has(name)) {
      result = await handleFieldTool(client, name, toolArgs);
    } else if (viewToolNames.has(name)) {
      result = await handleViewTool(client, name, toolArgs);
    } else if (filterToolNames.has(name)) {
      result = await handleFilterTool(client, name, toolArgs);
    } else if (sortToolNames.has(name)) {
      result = await handleSortTool(client, name, toolArgs);
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
  console.error("NocoDB MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
