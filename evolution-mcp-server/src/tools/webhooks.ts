import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { EvolutionClient } from "../client.js";

export const webhookTools: Tool[] = [
  {
    name: "list_webhooks",
    description: "List webhooks configured for an Evolution API instance",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
      },
      required: ["instanceName"],
    },
  },
  {
    name: "set_webhook",
    description: "Set/update a webhook for an Evolution API instance",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
        url: { type: "string", description: "Webhook delivery URL" },
        events: {
          type: "array",
          description: "Array of event types to subscribe to (e.g. messages.upsert, connection.update)",
          items: { type: "string" },
        },
        enabled: { type: "boolean", description: "Whether the webhook is enabled" },
      },
      required: ["instanceName", "url"],
    },
  },
];

export async function handleWebhookTool(
  client: EvolutionClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_webhooks":
      return client.get(`/webhook/find/${args.instanceName}`);
    case "set_webhook": {
      const body: Record<string, unknown> = { url: args.url };
      if (args.events) body.events = args.events;
      if (args.enabled !== undefined) body.enabled = args.enabled;
      return client.post(`/webhook/set/${args.instanceName}`, body);
    }
    default:
      throw new Error(`Unknown webhook tool: ${name}`);
  }
}
