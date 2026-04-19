import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WooCommerceClient } from "../client.js";

export const productTools: Tool[] = [
  {
    name: "list_products",
    description: "List WooCommerce products with optional filtering and pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        per_page: { type: "number", description: "Number of products per page (default 10, max 100)" },
        page: { type: "number", description: "Page number (default 1)" },
        search: { type: "string", description: "Search term to filter products" },
        category: { type: "string", description: "Category ID to filter by" },
        status: { type: "string", description: "Product status: draft, pending, private, publish" },
      },
      required: [],
    },
  },
  {
    name: "get_product",
    description: "Get a single WooCommerce product by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Product ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_product",
    description: "Create a new WooCommerce product",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Product name" },
        type: { type: "string", description: "Product type: simple, grouped, external, variable" },
        regular_price: { type: "string", description: "Regular price" },
        description: { type: "string", description: "Product description" },
        categories: {
          type: "array",
          description: "Array of category objects with id property",
          items: {
            type: "object",
            properties: { id: { type: "number" } },
          },
        },
      },
      required: ["name"],
    },
  },
  {
    name: "update_product",
    description: "Update an existing WooCommerce product",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Product ID" },
        name: { type: "string", description: "Product name" },
        type: { type: "string", description: "Product type" },
        regular_price: { type: "string", description: "Regular price" },
        description: { type: "string", description: "Product description" },
        status: { type: "string", description: "Product status" },
        categories: {
          type: "array",
          description: "Array of category objects with id property",
          items: {
            type: "object",
            properties: { id: { type: "number" } },
          },
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_product",
    description: "Delete a WooCommerce product permanently",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Product ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_product_categories",
    description: "List all WooCommerce product categories",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "create_product_category",
    description: "Create a new WooCommerce product category",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Category name" },
        parent: { type: "number", description: "Parent category ID" },
      },
      required: ["name"],
    },
  },
];

export async function handleProductTool(
  client: WooCommerceClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_products":
      return client.get("/products", {
        per_page: args.per_page as number | undefined,
        page: args.page as number | undefined,
        search: args.search as string | undefined,
        category: args.category as string | undefined,
        status: args.status as string | undefined,
      });
    case "get_product":
      return client.get(`/products/${args.id}`);
    case "create_product": {
      const body: Record<string, unknown> = { name: args.name };
      if (args.type) body.type = args.type;
      if (args.regular_price) body.regular_price = args.regular_price;
      if (args.description) body.description = args.description;
      if (args.categories) body.categories = args.categories;
      return client.post("/products", body);
    }
    case "update_product": {
      const { id, ...data } = args;
      return client.put(`/products/${id}`, data);
    }
    case "delete_product":
      return client.delete(`/products/${args.id}`, { force: "true" });
    case "list_product_categories":
      return client.get("/products/categories");
    case "create_product_category": {
      const body: Record<string, unknown> = { name: args.name };
      if (args.parent !== undefined) body.parent = args.parent;
      return client.post("/products/categories", body);
    }
    default:
      throw new Error(`Unknown product tool: ${name}`);
  }
}
