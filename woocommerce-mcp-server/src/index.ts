#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { WooCommerceClient } from "./client.js";
import { productTools, handleProductTool } from "./tools/products.js";
import { orderTools, handleOrderTool } from "./tools/orders.js";
import { customerTools, handleCustomerTool } from "./tools/customers.js";
import { couponTools, handleCouponTool } from "./tools/coupons.js";
import { reportTools, handleReportTool } from "./tools/reports.js";
import { shippingTools, handleShippingTool } from "./tools/shipping.js";
import { webhookTools, handleWebhookTool } from "./tools/webhooks.js";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;
const WOOCOMMERCE_KEY = process.env.WOOCOMMERCE_KEY;
const WOOCOMMERCE_SECRET = process.env.WOOCOMMERCE_SECRET;

if (!WOOCOMMERCE_URL) {
  console.error("Error: WOOCOMMERCE_URL environment variable is required");
  process.exit(1);
}

if (!WOOCOMMERCE_KEY) {
  console.error("Error: WOOCOMMERCE_KEY environment variable is required");
  process.exit(1);
}

if (!WOOCOMMERCE_SECRET) {
  console.error("Error: WOOCOMMERCE_SECRET environment variable is required");
  process.exit(1);
}

const client = new WooCommerceClient({
  baseUrl: WOOCOMMERCE_URL,
  consumerKey: WOOCOMMERCE_KEY,
  consumerSecret: WOOCOMMERCE_SECRET,
});

const allTools = [
  ...productTools,
  ...orderTools,
  ...customerTools,
  ...couponTools,
  ...reportTools,
  ...shippingTools,
  ...webhookTools,
];

const productToolNames = new Set(productTools.map((t) => t.name));
const orderToolNames = new Set(orderTools.map((t) => t.name));
const customerToolNames = new Set(customerTools.map((t) => t.name));
const couponToolNames = new Set(couponTools.map((t) => t.name));
const reportToolNames = new Set(reportTools.map((t) => t.name));
const shippingToolNames = new Set(shippingTools.map((t) => t.name));
const webhookToolNames = new Set(webhookTools.map((t) => t.name));

const server = new Server(
  {
    name: "woocommerce-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: allTools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const toolArgs = (args ?? {}) as Record<string, unknown>;

  try {
    let result: unknown;

    if (productToolNames.has(name)) {
      result = await handleProductTool(client, name, toolArgs);
    } else if (orderToolNames.has(name)) {
      result = await handleOrderTool(client, name, toolArgs);
    } else if (customerToolNames.has(name)) {
      result = await handleCustomerTool(client, name, toolArgs);
    } else if (couponToolNames.has(name)) {
      result = await handleCouponTool(client, name, toolArgs);
    } else if (reportToolNames.has(name)) {
      result = await handleReportTool(client, name, toolArgs);
    } else if (shippingToolNames.has(name)) {
      result = await handleShippingTool(client, name, toolArgs);
    } else if (webhookToolNames.has(name)) {
      result = await handleWebhookTool(client, name, toolArgs);
    } else {
      return {
        content: [
          {
            type: "text" as const,
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WooCommerce MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
