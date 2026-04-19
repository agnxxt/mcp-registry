import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { LagoClient } from "../client.js";

export const subscriptionTools: Tool[] = [
  {
    name: "list_subscriptions",
    description:
      "List subscriptions with optional filters for customer, plan, and status. Returns subscription details including plan code, status, and billing time.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_customer_id: {
          type: "string",
          description: "Filter by customer external ID",
        },
        plan_code: {
          type: "string",
          description: "Filter by plan code",
        },
        status: {
          type: "array",
          items: { type: "string" },
          description:
            "Filter by status (active, pending, terminated, canceled)",
        },
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Records per page" },
      },
    },
  },
  {
    name: "get_subscription",
    description:
      "Get a single subscription by its external_id. Returns full subscription details.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_id: {
          type: "string",
          description: "The external ID of the subscription",
        },
      },
      required: ["external_id"],
    },
  },
  {
    name: "create_subscription",
    description:
      "Create a new subscription for a customer. Assigns a plan to a customer with an external subscription ID. Optionally set name, billing_time, subscription_at, and ending_at.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_customer_id: {
          type: "string",
          description: "The external ID of the customer",
        },
        plan_code: {
          type: "string",
          description: "The code of the plan to subscribe to",
        },
        external_id: {
          type: "string",
          description: "Unique external ID for this subscription",
        },
        name: {
          type: "string",
          description: "Display name for the subscription",
        },
        billing_time: {
          type: "string",
          description: "Billing time: calendar or anniversary",
          enum: ["calendar", "anniversary"],
        },
        subscription_at: {
          type: "string",
          description:
            "Start date of the subscription (ISO 8601). Defaults to now.",
        },
        ending_at: {
          type: "string",
          description: "End date of the subscription (ISO 8601)",
        },
      },
      required: ["external_customer_id", "plan_code", "external_id"],
    },
  },
  {
    name: "update_subscription",
    description:
      "Update an existing subscription. Can change name, subscription_at, ending_at, or plan_overrides.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_id: {
          type: "string",
          description: "The external ID of the subscription to update",
        },
        name: { type: "string", description: "New display name" },
        subscription_at: {
          type: "string",
          description: "New start date (ISO 8601)",
        },
        ending_at: {
          type: "string",
          description: "New end date (ISO 8601)",
        },
        plan_overrides: {
          type: "object",
          description:
            "Plan overrides object (amount_cents, amount_currency, charges, etc.)",
        },
      },
      required: ["external_id"],
    },
  },
  {
    name: "terminate_subscription",
    description:
      "Terminate a subscription by its external_id. This will end the subscription immediately and generate a final invoice.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_id: {
          type: "string",
          description: "The external ID of the subscription to terminate",
        },
      },
      required: ["external_id"],
    },
  },
];

export async function handleSubscriptionTool(
  client: LagoClient,
  toolName: string,
  args: Record<string, any>
): Promise<string> {
  switch (toolName) {
    case "list_subscriptions": {
      const params: Record<string, any> = {};
      if (args.external_customer_id)
        params.external_customer_id = args.external_customer_id;
      if (args.plan_code) params.plan_code = args.plan_code;
      if (args.status) params["status[]"] = args.status;
      if (args.page) params.page = args.page;
      if (args.per_page) params.per_page = args.per_page;
      const result = await client.get("/subscriptions", params);
      return JSON.stringify(result, null, 2);
    }

    case "get_subscription": {
      const result = await client.get(`/subscriptions/${args.external_id}`);
      return JSON.stringify(result, null, 2);
    }

    case "create_subscription": {
      const body = { subscription: { ...args } };
      const result = await client.post("/subscriptions", body);
      return JSON.stringify(result, null, 2);
    }

    case "update_subscription": {
      const { external_id, ...rest } = args;
      const body = { subscription: rest };
      const result = await client.put(`/subscriptions/${external_id}`, body);
      return JSON.stringify(result, null, 2);
    }

    case "terminate_subscription": {
      const result = await client.delete(
        `/subscriptions/${args.external_id}`
      );
      return JSON.stringify(result, null, 2);
    }

    default:
      throw new Error(`Unknown subscription tool: ${toolName}`);
  }
}
