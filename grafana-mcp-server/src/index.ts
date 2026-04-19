#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GrafanaClient } from "./client.js";
import { dashboardTools, handleDashboardTool } from "./tools/dashboards.js";
import { datasourceTools, handleDatasourceTool } from "./tools/datasources.js";
import { alertTools, handleAlertTool } from "./tools/alerts.js";
import { folderTools, handleFolderTool } from "./tools/folders.js";
import { userTools, handleUserTool } from "./tools/users.js";
import { orgTools, handleOrgTool } from "./tools/orgs.js";
import { allTools } from "./tools/index.js";

const GRAFANA_URL = process.env.GRAFANA_URL;
const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY;

if (!GRAFANA_URL) { console.error("Error: GRAFANA_URL is required"); process.exit(1); }
if (!GRAFANA_API_KEY) { console.error("Error: GRAFANA_API_KEY is required"); process.exit(1); }

const client = new GrafanaClient({ baseUrl: GRAFANA_URL, apiKey: GRAFANA_API_KEY });

const dashboardNames = new Set(dashboardTools.map(t => t.name));
const datasourceNames = new Set(datasourceTools.map(t => t.name));
const alertNames = new Set(alertTools.map(t => t.name));
const folderNames = new Set(folderTools.map(t => t.name));
const userNames = new Set(userTools.map(t => t.name));
const orgNames = new Set(orgTools.map(t => t.name));

console.error(`Grafana MCP Server starting...`);
console.error(`  URL: ${GRAFANA_URL}`);
console.error(`  Tools: ${allTools.length}`);

const server = new Server(
  { name: "grafana-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: allTools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const a = args as Record<string, unknown>;
  try {
    let result: unknown;
    if (dashboardNames.has(name)) result = await handleDashboardTool(client, name, a);
    else if (datasourceNames.has(name)) result = await handleDatasourceTool(client, name, a);
    else if (alertNames.has(name)) result = await handleAlertTool(client, name, a);
    else if (folderNames.has(name)) result = await handleFolderTool(client, name, a);
    else if (userNames.has(name)) result = await handleUserTool(client, name, a);
    else if (orgNames.has(name)) result = await handleOrgTool(client, name, a);
    else return { content: [{ type: "text" as const, text: `Unknown tool: ${name}` }], isError: true };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Grafana MCP Server ready");
