import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WooCommerceClient } from "../client.js";

export const webhookTools: Tool[] = [
  {
    name: "list_webhooks",
    description: "List all WooCommerce webhooks",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "create_webhook",
    description: "Create a new WooCommerce webhook",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Webhook name" },
        topic: { type: "string", description: "Webhook topic (e.g. order.created, product.updated, customer.deleted)" },
        delivery_url: { type: "string", description: "URL to deliver the webhook payload to" },
      },
      required: ["name", "topic", "delivery_url"],
    },
  },
  {
    name: "delete_webhook",
    description: "Delete a WooCommerce webhook permanently",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Webhook ID" },
      },
      required: ["id"],
    },
  },
];

export async function handleWebhookTool(
  client: WooCommerceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_webhooks":
      return client.get("/webhooks");
    case "create_webhook":
      return client.post("/webhooks", {
        name: args.name,
        topic: args.topic,
        delivery_url: args.delivery_url,
      });
    case "delete_webhook":
      return client.delete(`/webhooks/${args.id}`, { force: "true" });
    default:
      throw new Error(`Unknown webhook tool: ${name}`);
  }
}
