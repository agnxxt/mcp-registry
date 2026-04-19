#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { N8nClient } from "./client.js";
import { allTools } from "./tools/index.js";

// ── Environment ──────────────────────────────────────────────────────────────
const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_URL) {
  console.error("Error: N8N_URL environment variable is required");
  process.exit(1);
}

if (!N8N_API_KEY) {
  console.error("Error: N8N_API_KEY environment variable is required");
  process.exit(1);
}

// ── Client ───────────────────────────────────────────────────────────────────
const client = new N8nClient(N8N_URL, N8N_API_KEY);

console.error(`n8n MCP Server starting...`);
console.error(`  URL: ${N8N_URL}`);
console.error(`  Tools: ${allTools.length}`);

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new Server(
  { name: "n8n-mcp", version: "1.0.0" },
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
console.error("n8n MCP Server ready");
