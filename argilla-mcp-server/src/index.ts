#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ArgillaClient } from "./client.js";
import { allTools } from "./tools/index.js";

// ── Environment ──────────────────────────────────────────────────────────────
const ARGILLA_URL = process.env.ARGILLA_URL;
const ARGILLA_API_KEY = process.env.ARGILLA_API_KEY;

if (!ARGILLA_URL) {
  console.error("Error: ARGILLA_URL environment variable is required");
  process.exit(1);
}

if (!ARGILLA_API_KEY) {
  console.error("Error: ARGILLA_API_KEY environment variable is required");
  process.exit(1);
}

// ── Client ───────────────────────────────────────────────────────────────────
const client = new ArgillaClient(ARGILLA_URL, ARGILLA_API_KEY);

console.error(`Argilla MCP Server starting...`);
console.error(`  URL: ${ARGILLA_URL}`);
console.error(`  Tools: ${allTools.length}`);

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new Server(
  { name: "argilla-mcp", version: "1.0.0" },
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
console.error("Argilla MCP Server ready");
