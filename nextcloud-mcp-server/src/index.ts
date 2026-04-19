#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { NextcloudClient } from "./client.js";
import { allTools } from "./tools/index.js";

// ── Environment ──────────────────────────────────────────────────────────────
const NEXTCLOUD_URL = process.env.NEXTCLOUD_URL;
const NEXTCLOUD_USERNAME = process.env.NEXTCLOUD_USERNAME;
const NEXTCLOUD_PASSWORD = process.env.NEXTCLOUD_PASSWORD;

if (!NEXTCLOUD_URL) {
  console.error("Error: NEXTCLOUD_URL environment variable is required");
  process.exit(1);
}

if (!NEXTCLOUD_USERNAME) {
  console.error("Error: NEXTCLOUD_USERNAME environment variable is required");
  process.exit(1);
}

if (!NEXTCLOUD_PASSWORD) {
  console.error("Error: NEXTCLOUD_PASSWORD environment variable is required");
  process.exit(1);
}

// ── Client ───────────────────────────────────────────────────────────────────
const client = new NextcloudClient(
  NEXTCLOUD_URL,
  NEXTCLOUD_USERNAME,
  NEXTCLOUD_PASSWORD
);

console.error(`Nextcloud MCP Server starting...`);
console.error(`  URL: ${NEXTCLOUD_URL}`);
console.error(`  User: ${NEXTCLOUD_USERNAME}`);
console.error(`  Tools: ${allTools.length}`);

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new Server(
  { name: "nextcloud-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  const tool = allTools.find((t) => t.name === name);
  if (!tool) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }

  try {
    const result = await tool.handler(client, args as Record<string, unknown>);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// ── Transport ────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Nextcloud MCP Server ready");
