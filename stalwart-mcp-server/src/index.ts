#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { StalwartClient } from "./client.js";
import { allTools } from "./tools/index.js";

// ── Environment ──────────────────────────────────────────────────────────────
const STALWART_URL = process.env.STALWART_URL;
const STALWART_USERNAME = process.env.STALWART_USERNAME;
const STALWART_PASSWORD = process.env.STALWART_PASSWORD;

if (!STALWART_URL) {
  console.error("Error: STALWART_URL environment variable is required");
  process.exit(1);
}

if (!STALWART_USERNAME) {
  console.error("Error: STALWART_USERNAME environment variable is required");
  process.exit(1);
}

if (!STALWART_PASSWORD) {
  console.error("Error: STALWART_PASSWORD environment variable is required");
  process.exit(1);
}

// ── Client ───────────────────────────────────────────────────────────────────
const client = new StalwartClient(STALWART_URL, STALWART_USERNAME, STALWART_PASSWORD);

console.error(`Stalwart MCP Server starting...`);
console.error(`  URL: ${STALWART_URL}`);
console.error(`  Tools: ${allTools.length}`);

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new Server(
  { name: "stalwart-mcp", version: "1.0.0" },
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
console.error("Stalwart MCP Server ready");
