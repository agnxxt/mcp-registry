#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { TypebotClient } from "./client.js";
import { allTools } from "./tools/index.js";

const TYPEBOT_URL = process.env.TYPEBOT_URL;
const TYPEBOT_API_TOKEN = process.env.TYPEBOT_API_TOKEN;

if (!TYPEBOT_URL) { console.error("Error: TYPEBOT_URL is required"); process.exit(1); }
if (!TYPEBOT_API_TOKEN) { console.error("Error: TYPEBOT_API_TOKEN is required"); process.exit(1); }

const client = new TypebotClient(TYPEBOT_URL, TYPEBOT_API_TOKEN);

console.error(`Typebot MCP Server starting...`);
console.error(`  URL: ${TYPEBOT_URL}`);
console.error(`  Tools: ${allTools.length}`);

const server = new Server(
  { name: "typebot-mcp", version: "1.0.0" },
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
console.error("Typebot MCP Server ready");
