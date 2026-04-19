#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MLflowClient } from "./client.js";
import { MLflowConfig } from "./types.js";
import {
  experimentTools,
  handleExperimentTool,
  runTools,
  handleRunTool,
  modelTools,
  handleModelTool,
  artifactTools,
  handleArtifactTool,
} from "./tools/index.js";

const config: MLflowConfig = {
  baseUrl: process.env.MLFLOW_URL ?? "",
  token: process.env.MLFLOW_TOKEN,
};

if (!config.baseUrl) {
  console.error(
    "Missing required environment variable MLFLOW_URL.\n\n" +
      "  Example:\n" +
      "  MLFLOW_URL=https://your-mlflow-instance.com \\\n" +
      "  MLFLOW_TOKEN=your-optional-token \\\n" +
      "  node dist/index.js"
  );
  process.exit(1);
}

const client = new MLflowClient(config);

const allTools = [
  ...experimentTools,
  ...runTools,
  ...modelTools,
  ...artifactTools,
];

const experimentToolNames = new Set(experimentTools.map((t) => t.name));
const runToolNames = new Set(runTools.map((t) => t.name));
const modelToolNames = new Set(modelTools.map((t) => t.name));
const artifactToolNames = new Set(artifactTools.map((t) => t.name));

const server = new Server(
  { name: "mlflow-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    let result: unknown;

    if (experimentToolNames.has(name)) {
      result = await handleExperimentTool(client, name, args as Record<string, unknown>);
    } else if (runToolNames.has(name)) {
      result = await handleRunTool(client, name, args as Record<string, unknown>);
    } else if (modelToolNames.has(name)) {
      result = await handleModelTool(client, name, args as Record<string, unknown>);
    } else if (artifactToolNames.has(name)) {
      result = await handleArtifactTool(client, name, args as Record<string, unknown>);
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
console.error(`MLflow MCP server running — endpoint: ${config.baseUrl}`);
