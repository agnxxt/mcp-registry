#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CalComClient } from "./client.js";
import { allTools } from "./tools/index.js";
import { getEventTypeTools, handleEventTypeTool } from "./tools/event-types.js";
import { getBookingTools, handleBookingTool } from "./tools/bookings.js";
import { getAvailabilityTools, handleAvailabilityTool } from "./tools/availability.js";
import { getScheduleTools, handleScheduleTool } from "./tools/schedules.js";
import { getUserTools, handleUserTool } from "./tools/users.js";
import { getTeamTools, handleTeamTool } from "./tools/teams.js";
import { getWebhookTools, handleWebhookTool } from "./tools/webhooks.js";

const CALCOM_URL = process.env.CALCOM_URL ?? "https://api.cal.com/v1";
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;

if (!CALCOM_API_KEY) { console.error("Error: CALCOM_API_KEY is required"); process.exit(1); }

const client = new CalComClient({ baseUrl: CALCOM_URL, apiKey: CALCOM_API_KEY });

const eventTypeNames = new Set(getEventTypeTools().map(t => t.name));
const bookingNames = new Set(getBookingTools().map(t => t.name));
const availabilityNames = new Set(getAvailabilityTools().map(t => t.name));
const scheduleNames = new Set(getScheduleTools().map(t => t.name));
const userNames = new Set(getUserTools().map(t => t.name));
const teamNames = new Set(getTeamTools().map(t => t.name));
const webhookNames = new Set(getWebhookTools().map(t => t.name));

console.error(`Cal.com MCP Server starting...`);
console.error(`  URL: ${CALCOM_URL}`);
console.error(`  Tools: ${allTools.length}`);

const server = new Server(
  { name: "calcom-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: allTools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const a = args as Record<string, unknown>;
  try {
    let result: unknown;
    if (eventTypeNames.has(name)) result = await handleEventTypeTool(client, name, a);
    else if (bookingNames.has(name)) result = await handleBookingTool(client, name, a);
    else if (availabilityNames.has(name)) result = await handleAvailabilityTool(client, name, a);
    else if (scheduleNames.has(name)) result = await handleScheduleTool(client, name, a);
    else if (userNames.has(name)) result = await handleUserTool(client, name, a);
    else if (teamNames.has(name)) result = await handleTeamTool(client, name, a);
    else if (webhookNames.has(name)) result = await handleWebhookTool(client, name, a);
    else return { content: [{ type: "text" as const, text: `Unknown tool: ${name}` }], isError: true };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Cal.com MCP Server ready");
