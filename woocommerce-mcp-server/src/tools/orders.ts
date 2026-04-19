import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WooCommerceClient } from "../client.js";

export const orderTools: Tool[] = [
  {
    name: "list_orders",
    description: "List WooCommerce orders with optional filtering and pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: { type: "string", description: "Order status: pending, processing, on-hold, completed, cancelled, refunded, failed" },
        per_page: { type: "number", description: "Number of orders per page (default 10, max 100)" },
        page: { type: "number", description: "Page number (default 1)" },
        after: { type: "string", description: "Limit to orders after a given ISO8601 date" },
        before: { type: "string", description: "Limit to orders before a given ISO8601 date" },
      },
      required: [],
    },
  },
  {
    name: "get_order",
    description: "Get a single WooCommerce order by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Order ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_order",
    description: "Create a new WooCommerce order",
    inputSchema: {
      type: "object" as const,
      properties: {
        line_items: {
          type: "array",
          description: "Array of line items with product_id and quantity",
          items: {
            type: "object",
            properties: {
              product_id: { type: "number" },
              quantity: { type: "number" },
            },
          },
        },
        billing: {
          type: "object",
          description: "Billing address object (first_name, last_name, address_1, city, state, postcode, country, email)",
        },
        shipping: {
          type: "object",
          description: "Shipping address object (first_name, last_name, address_1, city, state, postcode, country)",
        },
      },
      required: ["line_items"],
    },
  },
  {
    name: "update_order",
    description: "Update a WooCommerce order (e.g., change status)",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Order ID" },
        status: { type: "string", description: "New order status" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_order",
    description: "Delete a WooCommerce order permanently",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Order ID" },
      },
      required: ["id"],
    },
  },
];

export async function handleOrderTool(
  client: WooCommerceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_orders":
      return client.get("/orders", {
        status: args.status as string | undefined,
        per_page: args.per_page as number | undefined,
        page: args.page as number | undefined,
        after: args.after as string | undefined,
        before: args.before as string | undefined,
      });
    case "get_order":
      return client.get(`/orders/${args.id}`);
    case "create_order": {
      const body: Record<string, unknown> = {};
      if (args.line_items) body.line_items = args.line_items;
      if (args.billing) body.billing = args.billing;
      if (args.shipping) body.shipping = args.shipping;
      return client.post("/orders", body);
    }
    case "update_order": {
      const body: Record<string, unknown> = {};
      if (args.status) body.status = args.status;
      return client.put(`/orders/${args.id}`, body);
    }
    case "delete_order":
      return client.delete(`/orders/${args.id}`, { force: "true" });
    default:
      throw new Error(`Unknown order tool: ${name}`);
  }
}
