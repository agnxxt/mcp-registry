import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { NocoDBClient } from "../client.js";

export const webhookTools: Tool[] = [
  {
    name: "list_webhooks",
    description: "List all webhooks (hooks) for a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
      },
      required: ["tableId"],
    },
  },
  {
    name: "create_webhook",
    description: "Create a new webhook (hook) on a NocoDB table",
    inputSchema: {
      type: "object" as const,
      properties: {
        tableId: { type: "string", description: "The table ID" },
        title: { type: "string", description: "Name for the webhook" },
        event: {
          type: "string",
          description: "Event type: after or before",
        },
        operation: {
          type: "string",
          description: "Operation: insert, update, delete, or bulkInsert",
        },
        notification: {
          type: "object",
          description:
            'Notification config, e.g. { type: "URL", payload: { method: "POST", body: "...", path: "https://..." } }',
        },
      },
      required: ["tableId", "title", "event", "operation", "notification"],
    },
  },
  {
    name: "delete_webhook",
    description: "Delete a webhook (hook) from NocoDB",
    inputSchema: {
      type: "object" as const,
      properties: {
        hookId: { type: "string", description: "The hook ID to delete" },
      },
      required: ["hookId"],
    },
  },
];

export async function handleWebhookTool(
  client: NocoDBClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_webhooks": {
      const { tableId } = args as { tableId: string };
      return client.get(`/meta/tables/${tableId}/hooks`);
    }
    case "create_webhook": {
      const { tableId, title, event, operation, notification } = args as {
        tableId: string;
        title: string;
        event: string;
        operation: string;
        notification: Record<string, unknown>;
      };
      return client.post(`/meta/tables/${tableId}/hooks`, {
        title,
        event,
        operation,
        notification,
      });
    }
    case "delete_webhook": {
      const { hookId } = args as { hookId: string };
      return client.delete(`/meta/hooks/${hookId}`);
    }
    default:
      throw new Error(`Unknown webhook tool: ${toolName}`);
  }
}
