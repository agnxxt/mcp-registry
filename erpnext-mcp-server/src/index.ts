#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createERPNextClient, ok, err } from "./client.js";
import { ERPNextConfig } from "./types.js";
import { registerDocumentTools } from "./tools/documents.js";
import { registerMethodTools } from "./tools/methods.js";
import { registerReportTools } from "./tools/reports.js";
import { registerWorkflowTools } from "./tools/workflow.js";
import { registerMetaTools } from "./tools/meta.js";
import { registerFileTools } from "./tools/files.js";

const config: ERPNextConfig = {
  url: process.env.ERPNEXT_URL ?? "",
  apiKey: process.env.ERPNEXT_API_KEY ?? "",
  apiSecret: process.env.ERPNEXT_API_SECRET ?? "",
};

if (!config.url || !config.apiKey || !config.apiSecret) {
  console.error(
    "Missing required environment variables.\n" +
    "  Required: ERPNEXT_URL, ERPNEXT_API_KEY, ERPNEXT_API_SECRET\n\n" +
    "  Example:\n" +
    "  ERPNEXT_URL=https://your-site.erpnext.com \\\n" +
    "  ERPNEXT_API_KEY=your-api-key \\\n" +
    "  ERPNEXT_API_SECRET=your-api-secret \\\n" +
    "  node dist/index.js"
  );
  process.exit(1);
}

const client = createERPNextClient(config);
const getClient = () => client;

const server = new McpServer({
  name: "erpnext-mcp-server",
  version: "1.0.0",
  description: "MCP server for ERPNext/Frappe REST API — documents, methods, reports, workflows, metadata, and files",
});

// Register all tool groups
registerDocumentTools(server, getClient);
registerMethodTools(server, getClient);
registerReportTools(server, getClient);
registerWorkflowTools(server, getClient);
registerMetaTools(server, getClient);
registerFileTools(server, getClient);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`ERPNext MCP server running — endpoint: ${config.url}`);
