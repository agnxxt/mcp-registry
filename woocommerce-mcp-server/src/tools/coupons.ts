import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WooCommerceClient } from "../client.js";

export const couponTools: Tool[] = [
  {
    name: "list_coupons",
    description: "List all WooCommerce coupons",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "create_coupon",
    description: "Create a new WooCommerce coupon",
    inputSchema: {
      type: "object" as const,
      properties: {
        code: { type: "string", description: "Coupon code" },
        discount_type: { type: "string", description: "Discount type: percent, fixed_cart, fixed_product" },
        amount: { type: "string", description: "Discount amount" },
      },
      required: ["code", "discount_type", "amount"],
    },
  },
  {
    name: "delete_coupon",
    description: "Delete a WooCommerce coupon permanently",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Coupon ID" },
      },
      required: ["id"],
    },
  },
];

export async function handleCouponTool(
  client: WooCommerceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_coupons":
      return client.get("/coupons");
    case "create_coupon":
      return client.post("/coupons", {
        code: args.code,
        discount_type: args.discount_type,
        amount: args.amount,
      });
    case "delete_coupon":
      return client.delete(`/coupons/${args.id}`, { force: "true" });
    default:
      throw new Error(`Unknown coupon tool: ${name}`);
  }
}
