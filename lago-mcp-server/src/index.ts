#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { LagoClient } from "./client.js";
import { customerTools, handleCustomerTool } from "./tools/customers.js";
import { subscriptionTools, handleSubscriptionTool } from "./tools/subscriptions.js";
import { invoiceTools, handleInvoiceTool } from "./tools/invoices.js";
import { planTools, handlePlanTool } from "./tools/plans.js";
import { eventTools, handleEventTool } from "./tools/events.js";
import { walletTools, handleWalletTool } from "./tools/wallets.js";
import { allTools } from "./tools/index.js";

const LAGO_URL = process.env.LAGO_URL;
const LAGO_API_KEY = process.env.LAGO_API_KEY;

if (!LAGO_URL) { console.error("Error: LAGO_URL is required"); process.exit(1); }
if (!LAGO_API_KEY) { console.error("Error: LAGO_API_KEY is required"); process.exit(1); }

const client = new LagoClient({ baseUrl: LAGO_URL, apiKey: LAGO_API_KEY });

const customerNames = new Set(customerTools.map(t => t.name));
const subscriptionNames = new Set(subscriptionTools.map(t => t.name));
const invoiceNames = new Set(invoiceTools.map(t => t.name));
const planNames = new Set(planTools.map(t => t.name));
const eventNames = new Set(eventTools.map(t => t.name));
const walletNames = new Set(walletTools.map(t => t.name));

console.error(`Lago MCP Server starting...`);
console.error(`  URL: ${LAGO_URL}`);
console.error(`  Tools: ${allTools.length}`);

const server = new Server(
  { name: "lago-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: allTools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const a = args as Record<string, unknown>;
  try {
    let result: unknown;
    if (customerNames.has(name)) result = await handleCustomerTool(client, name, a);
    else if (subscriptionNames.has(name)) result = await handleSubscriptionTool(client, name, a);
    else if (invoiceNames.has(name)) result = await handleInvoiceTool(client, name, a);
    else if (planNames.has(name)) result = await handlePlanTool(client, name, a);
    else if (eventNames.has(name)) result = await handleEventTool(client, name, a);
    else if (walletNames.has(name)) result = await handleWalletTool(client, name, a);
    else return { content: [{ type: "text" as const, text: `Unknown tool: ${name}` }], isError: true };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Lago MCP Server ready");
