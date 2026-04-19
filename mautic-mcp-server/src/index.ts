#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { MauticClient } from "./client.js";
import { allTools } from "./tools/index.js";

const MAUTIC_URL = process.env.MAUTIC_URL;
const MAUTIC_USERNAME = process.env.MAUTIC_USERNAME;
const MAUTIC_PASSWORD = process.env.MAUTIC_PASSWORD;

if (!MAUTIC_URL) { console.error("Error: MAUTIC_URL is required"); process.exit(1); }
if (!MAUTIC_USERNAME || !MAUTIC_PASSWORD) { console.error("Error: MAUTIC_USERNAME and MAUTIC_PASSWORD are required"); process.exit(1); }

const client = new MauticClient(MAUTIC_URL, MAUTIC_USERNAME, MAUTIC_PASSWORD);

console.error(`Mautic MCP Server starting...`);
console.error(`  URL: ${MAUTIC_URL}`);
console.error(`  Tools: ${allTools.length}`);

const server = new Server(
  { name: "mautic-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map(t => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const tool = allTools.find(t => t.name === name);
  if (!tool) return { content: [{ type: "text" as const, text: `Unknown tool: ${name}` }], isError: true };
  try {
    const result = await tool.handler(client, args as Record<string, unknown>);
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Mautic MCP Server ready");
