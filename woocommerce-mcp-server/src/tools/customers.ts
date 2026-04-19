import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WooCommerceClient } from "../client.js";

export const customerTools: Tool[] = [
  {
    name: "list_customers",
    description: "List WooCommerce customers with optional filtering and pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        per_page: { type: "number", description: "Number of customers per page (default 10, max 100)" },
        page: { type: "number", description: "Page number (default 1)" },
        search: { type: "string", description: "Search term to filter customers" },
      },
      required: [],
    },
  },
  {
    name: "get_customer",
    description: "Get a single WooCommerce customer by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Customer ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_customer",
    description: "Create a new WooCommerce customer",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "Customer email address" },
        first_name: { type: "string", description: "Customer first name" },
        last_name: { type: "string", description: "Customer last name" },
      },
      required: ["email"],
    },
  },
];

export async function handleCustomerTool(
  client: WooCommerceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_customers":
      return client.get("/customers", {
        per_page: args.per_page as number | undefined,
        page: args.page as number | undefined,
        search: args.search as string | undefined,
      });
    case "get_customer":
      return client.get(`/customers/${args.id}`);
    case "create_customer": {
      const body: Record<string, unknown> = { email: args.email };
      if (args.first_name) body.first_name = args.first_name;
      if (args.last_name) body.last_name = args.last_name;
      return client.post("/customers", body);
    }
    default:
      throw new Error(`Unknown customer tool: ${name}`);
  }
}
