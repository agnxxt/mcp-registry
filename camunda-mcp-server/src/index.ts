#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { CamundaClient } from "./client.js";
import { allTools } from "./tools/index.js";

const url = process.env.CAMUNDA_URL;
const clientId = process.env.CAMUNDA_CLIENT_ID;
const clientSecret = process.env.CAMUNDA_CLIENT_SECRET;

if (!url || !clientId || !clientSecret) {
  console.error("Missing required env vars: CAMUNDA_URL, CAMUNDA_CLIENT_ID, CAMUNDA_CLIENT_SECRET");
  process.exit(1);
}

const client = new CamundaClient(url, clientId, clientSecret);

const server = new Server(
  { name: "camunda-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map(({ handler, ...rest }) => rest),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find((t) => t.name === request.params.name);
  if (!tool) {
    return { content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }], isError: true };
  }
  try {
    const result = await tool.handler(client, request.params.arguments ?? {});
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Camunda MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
