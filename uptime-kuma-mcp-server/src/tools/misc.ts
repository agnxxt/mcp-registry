import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { UptimeKumaClient } from "../client.js";

export const miscTools: Tool[] = [
  {
    name: "get_info",
    description: "Get Uptime Kuma server info (version, etc.)",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_monitor_uptime",
    description: "Get uptime percentage for a monitor over a given number of hours",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Monitor ID" },
        hours: { type: "number", description: "Number of hours to calculate uptime for" },
      },
      required: ["id", "hours"],
    },
  },
  {
    name: "get_monitor_avg_ping",
    description: "Get average ping for a monitor over a given number of hours",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Monitor ID" },
        hours: { type: "number", description: "Number of hours to calculate average ping for" },
      },
      required: ["id", "hours"],
    },
  },
  {
    name: "list_tags",
    description: "List all tags in Uptime Kuma",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

export async function handleMiscTool(
  client: UptimeKumaClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "get_info": {
      return client.get("/api/info");
    }
    case "get_monitor_uptime": {
      const { id, hours } = args as { id: number; hours: number };
      return client.get(`/api/monitors/${id}/uptime/${hours}`);
    }
    case "get_monitor_avg_ping": {
      const { id, hours } = args as { id: number; hours: number };
      return client.get(`/api/monitors/${id}/avg-ping/${hours}`);
    }
    case "list_tags": {
      return client.get("/api/tags");
    }
    default:
      throw new Error(`Unknown misc tool: ${toolName}`);
  }
}
