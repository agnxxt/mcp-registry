#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { EvidentlyClient } from "./client.js";
import { EvidentlyConfig } from "./types.js";
import {
  projectTools,
  handleProjectTool,
  snapshotTools,
  handleSnapshotTool,
  dashboardTools,
  handleDashboardTool,
} from "./tools/index.js";

const config: EvidentlyConfig = {
  baseUrl: process.env.EVIDENTLY_URL ?? "",
  token: process.env.EVIDENTLY_TOKEN,
};

if (!config.baseUrl) {
  console.error(
    "Missing required environment variable EVIDENTLY_URL.\n\n" +
      "  Example:\n" +
      "  EVIDENTLY_URL=https://your-evidently-instance.com \\\n" +
      "  EVIDENTLY_TOKEN=your-optional-token \\\n" +
      "  node dist/index.js"
  );
  process.exit(1);
}

const client = new EvidentlyClient(config);

const allTools = [
  ...projectTools,
  ...snapshotTools,
  ...dashboardTools,
];

const projectToolNames = new Set(projectTools.map((t) => t.name));
const snapshotToolNames = new Set(snapshotTools.map((t) => t.name));
const dashboardToolNames = new Set(dashboardTools.map((t) => t.name));

const server = new Server(
  { name: "evidently-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    let result: unknown;

    if (projectToolNames.has(name)) {
      result = await handleProjectTool(client, name, args as Record<string, unknown>);
    } else if (snapshotToolNames.has(name)) {
      result = await handleSnapshotTool(client, name, args as Record<string, unknown>);
    } else if (dashboardToolNames.has(name)) {
      result = await handleDashboardTool(client, name, args as Record<string, unknown>);
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
console.error(`Evidently MCP server running — endpoint: ${config.baseUrl}`);
