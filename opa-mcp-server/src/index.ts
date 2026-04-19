#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { OPAClient } from "./client.js";
import { OPAConfig } from "./types.js";
import {
  policyTools,
  handlePolicyTool,
  dataTools,
  handleDataTool,
  queryTools,
  handleQueryTool,
} from "./tools/index.js";

const config: OPAConfig = {
  baseUrl: process.env.OPA_URL ?? "",
  token: process.env.OPA_TOKEN,
};

if (!config.baseUrl) {
  console.error(
    "Missing required environment variable OPA_URL.\n\n" +
      "  Example:\n" +
      "  OPA_URL=https://your-opa-instance.com \\\n" +
      "  OPA_TOKEN=your-optional-token \\\n" +
      "  node dist/index.js"
  );
  process.exit(1);
}

const client = new OPAClient(config);

const allTools = [
  ...policyTools,
  ...dataTools,
  ...queryTools,
];

const policyToolNames = new Set(policyTools.map((t) => t.name));
const dataToolNames = new Set(dataTools.map((t) => t.name));
const queryToolNames = new Set(queryTools.map((t) => t.name));

const server = new Server(
  { name: "opa-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    let result: unknown;

    if (policyToolNames.has(name)) {
      result = await handlePolicyTool(client, name, args as Record<string, unknown>);
    } else if (dataToolNames.has(name)) {
      result = await handleDataTool(client, name, args as Record<string, unknown>);
    } else if (queryToolNames.has(name)) {
      result = await handleQueryTool(client, name, args as Record<string, unknown>);
    } else {
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`OPA MCP server running — endpoint: ${config.baseUrl}`);
