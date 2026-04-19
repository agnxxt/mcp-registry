import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { UptimeKumaClient } from "../client.js";

export const notificationTools: Tool[] = [
  {
    name: "list_notifications",
    description: "List all notification providers configured in Uptime Kuma",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "add_notification",
    description: "Add a new notification provider",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Name of the notification provider" },
        type: { type: "string", description: "Notification type (e.g. telegram, slack, webhook, email)" },
        config: {
          type: "object",
          description: "Configuration object specific to the notification type",
        },
      },
      required: ["name", "type", "config"],
    },
  },
  {
    name: "delete_notification",
    description: "Delete a notification provider by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Notification provider ID to delete" },
      },
      required: ["id"],
    },
  },
];

export async function handleNotificationTool(
  client: UptimeKumaClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_notifications": {
      return client.get("/api/notifications");
    }
    case "add_notification": {
      const { name, type, config } = args as {
        name: string;
        type: string;
        config: Record<string, unknown>;
      };
      return client.post("/api/notifications", { name, type, config });
    }
    case "delete_notification": {
      const { id } = args as { id: number };
      return client.delete(`/api/notifications/${id}`);
    }
    default:
      throw new Error(`Unknown notification tool: ${toolName}`);
  }
}
