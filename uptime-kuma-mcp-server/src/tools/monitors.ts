import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { UptimeKumaClient } from "../client.js";

export const monitorTools: Tool[] = [
  {
    name: "list_monitors",
    description: "List all monitors in Uptime Kuma",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_monitor",
    description: "Get details of a specific monitor by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Monitor ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "add_monitor",
    description: "Add a new monitor to Uptime Kuma",
    inputSchema: {
      type: "object" as const,
      properties: {
        type: { type: "string", description: "Monitor type (e.g. http, tcp, ping, keyword, dns)" },
        name: { type: "string", description: "Display name for the monitor" },
        url: { type: "string", description: "URL or hostname to monitor" },
        interval: { type: "number", description: "Check interval in seconds (default: 60)" },
        maxretries: { type: "number", description: "Max retries before marking down (default: 0)" },
      },
      required: ["type", "name", "url"],
    },
  },
  {
    name: "edit_monitor",
    description: "Edit an existing monitor",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Monitor ID to edit" },
        type: { type: "string", description: "Monitor type" },
        name: { type: "string", description: "Display name" },
        url: { type: "string", description: "URL or hostname" },
        interval: { type: "number", description: "Check interval in seconds" },
        maxretries: { type: "number", description: "Max retries before marking down" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_monitor",
    description: "Delete a monitor by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Monitor ID to delete" },
      },
      required: ["id"],
    },
  },
  {
    name: "pause_monitor",
    description: "Pause a monitor by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Monitor ID to pause" },
      },
      required: ["id"],
    },
  },
  {
    name: "resume_monitor",
    description: "Resume a paused monitor by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Monitor ID to resume" },
      },
      required: ["id"],
    },
  },
  {
    name: "get_monitor_beats",
    description: "Get heartbeat history for a monitor",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Monitor ID" },
        hours: { type: "number", description: "Number of hours of history to retrieve (default: 24)" },
      },
      required: ["id"],
    },
  },
];

export async function handleMonitorTool(
  client: UptimeKumaClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_monitors": {
      return client.get("/api/monitors");
    }
    case "get_monitor": {
      const { id } = args as { id: number };
      return client.get(`/api/monitors/${id}`);
    }
    case "add_monitor": {
      const { type, name, url, interval, maxretries } = args as {
        type: string;
        name: string;
        url: string;
        interval?: number;
        maxretries?: number;
      };
      return client.post("/api/monitors", { type, name, url, interval, maxretries });
    }
    case "edit_monitor": {
      const { id, ...rest } = args as {
        id: number;
        type?: string;
        name?: string;
        url?: string;
        interval?: number;
        maxretries?: number;
      };
      return client.put(`/api/monitors/${id}`, rest);
    }
    case "delete_monitor": {
      const { id } = args as { id: number };
      return client.delete(`/api/monitors/${id}`);
    }
    case "pause_monitor": {
      const { id } = args as { id: number };
      return client.post(`/api/monitors/${id}/pause`);
    }
    case "resume_monitor": {
      const { id } = args as { id: number };
      return client.post(`/api/monitors/${id}/resume`);
    }
    case "get_monitor_beats": {
      const { id, hours } = args as { id: number; hours?: number };
      return client.get(`/api/monitors/${id}/beats`, { hours });
    }
    default:
      throw new Error(`Unknown monitor tool: ${toolName}`);
  }
}
