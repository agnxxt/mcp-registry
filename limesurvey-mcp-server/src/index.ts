#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { LimeSurveyClient } from "./client.js";
import { allTools } from "./tools/index.js";

const LIMESURVEY_URL = process.env.LIMESURVEY_URL;
const LIMESURVEY_USERNAME = process.env.LIMESURVEY_USERNAME;
const LIMESURVEY_PASSWORD = process.env.LIMESURVEY_PASSWORD;

if (!LIMESURVEY_URL) { console.error("Error: LIMESURVEY_URL is required"); process.exit(1); }
if (!LIMESURVEY_USERNAME || !LIMESURVEY_PASSWORD) { console.error("Error: LIMESURVEY_USERNAME and LIMESURVEY_PASSWORD are required"); process.exit(1); }

const client = new LimeSurveyClient(LIMESURVEY_URL, LIMESURVEY_USERNAME, LIMESURVEY_PASSWORD);

console.error(`LimeSurvey MCP Server starting...`);
console.error(`  URL: ${LIMESURVEY_URL}`);
console.error(`  Tools: ${allTools.length}`);

const server = new Server(
  { name: "limesurvey-mcp", version: "1.0.0" },
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
console.error("LimeSurvey MCP Server ready");
