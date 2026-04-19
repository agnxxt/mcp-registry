import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WooCommerceClient } from "../client.js";

export const reportTools: Tool[] = [
  {
    name: "get_sales_report",
    description: "Get WooCommerce sales report for a date range",
    inputSchema: {
      type: "object" as const,
      properties: {
        date_min: { type: "string", description: "Start date (YYYY-MM-DD)" },
        date_max: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: [],
    },
  },
  {
    name: "get_top_sellers",
    description: "Get WooCommerce top selling products report",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_orders_totals",
    description: "Get WooCommerce orders totals grouped by status",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_customers_totals",
    description: "Get WooCommerce customers totals (paying vs non-paying)",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

export async function handleReportTool(
  client: WooCommerceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "get_sales_report":
      return client.get("/reports/sales", {
        date_min: args.date_min as string | undefined,
        date_max: args.date_max as string | undefined,
      });
    case "get_top_sellers":
      return client.get("/reports/top_sellers");
    case "get_orders_totals":
      return client.get("/reports/orders/totals");
    case "get_customers_totals":
      return client.get("/reports/customers/totals");
    default:
      throw new Error(`Unknown report tool: ${name}`);
  }
}
