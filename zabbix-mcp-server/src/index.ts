#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ZabbixClient } from "./client.js";
import { allTools } from "./tools/index.js";

// ── Environment ──────────────────────────────────────────────────────────────
const ZABBIX_URL = process.env.ZABBIX_URL;
const ZABBIX_USER = process.env.ZABBIX_USER;
const ZABBIX_PASSWORD = process.env.ZABBIX_PASSWORD;

if (!ZABBIX_URL) {
  console.error("Error: ZABBIX_URL environment variable is required");
  process.exit(1);
}

if (!ZABBIX_USER) {
  console.error("Error: ZABBIX_USER environment variable is required");
  process.exit(1);
}

if (!ZABBIX_PASSWORD) {
  console.error("Error: ZABBIX_PASSWORD environment variable is required");
  process.exit(1);
}

// ── Client ───────────────────────────────────────────────────────────────────
const client = new ZabbixClient(ZABBIX_URL, ZABBIX_USER, ZABBIX_PASSWORD);

console.error(`Zabbix MCP Server starting...`);
console.error(`  URL: ${ZABBIX_URL}`);
console.error(`  Tools: ${allTools.length}`);

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new Server(
  { name: "zabbix-mcp", version: "1.0.0" },
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
console.error("Zabbix MCP Server ready");
