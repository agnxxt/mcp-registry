#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { MatomoClient } from "./client.js";
import { allTools } from "./tools/index.js";

const MATOMO_URL = process.env.MATOMO_URL;
const MATOMO_TOKEN = process.env.MATOMO_TOKEN;
const MATOMO_SITE_ID = process.env.MATOMO_SITE_ID ?? "1";

if (!MATOMO_URL) { console.error("Error: MATOMO_URL is required"); process.exit(1); }
if (!MATOMO_TOKEN) { console.error("Error: MATOMO_TOKEN is required"); process.exit(1); }

const client = new MatomoClient(MATOMO_URL, MATOMO_TOKEN, MATOMO_SITE_ID);

console.error(`Matomo MCP Server starting...`);
console.error(`  URL: ${MATOMO_URL}`);
console.error(`  Site ID: ${MATOMO_SITE_ID}`);
console.error(`  Tools: ${allTools.length}`);

const server = new Server(
  { name: "matomo-mcp", version: "1.0.0" },
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
console.error("Matomo MCP Server ready");
