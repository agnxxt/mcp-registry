import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WooCommerceClient } from "../client.js";

export const shippingTools: Tool[] = [
  {
    name: "list_shipping_zones",
    description: "List all WooCommerce shipping zones",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "list_shipping_methods",
    description: "List shipping methods for a specific zone",
    inputSchema: {
      type: "object" as const,
      properties: {
        zone_id: { type: "number", description: "Shipping zone ID" },
      },
      required: ["zone_id"],
    },
  },
  {
    name: "list_tax_rates",
    description: "List all WooCommerce tax rates",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

export async function handleShippingTool(
  client: WooCommerceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_shipping_zones":
      return client.get("/shipping/zones");
    case "list_shipping_methods":
      return client.get(`/shipping/zones/${args.zone_id}/methods`);
    case "list_tax_rates":
      return client.get("/taxes");
    default:
      throw new Error(`Unknown shipping tool: ${name}`);
  }
}
