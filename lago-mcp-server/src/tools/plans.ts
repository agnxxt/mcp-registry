import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { LagoClient } from "../client.js";

export const planTools: Tool[] = [
  {
    name: "list_plans",
    description:
      "List all plans in Lago with optional pagination. Returns plan details including name, code, interval, and amount.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default: 1)" },
        per_page: {
          type: "number",
          description: "Records per page (default: 20, max: 100)",
        },
      },
    },
  },
  {
    name: "get_plan",
    description:
      "Get a single plan by its code. Returns full plan details including charges configuration.",
    inputSchema: {
      type: "object" as const,
      properties: {
        code: {
          type: "string",
          description: "The unique code of the plan",
        },
      },
      required: ["code"],
    },
  },
  {
    name: "create_plan",
    description:
      "Create a new billing plan. Define name, code, billing interval, base amount, currency, and optionally charges for usage-based billing.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Display name of the plan" },
        code: { type: "string", description: "Unique code for the plan" },
        interval: {
          type: "string",
          description: "Billing interval",
          enum: ["weekly", "monthly", "quarterly", "yearly"],
        },
        amount_cents: {
          type: "number",
          description: "Base amount in cents (e.g. 1000 = $10.00)",
        },
        amount_currency: {
          type: "string",
          description: "ISO 4217 currency code (e.g. USD)",
        },
        description: {
          type: "string",
          description: "Description of the plan",
        },
        pay_in_advance: {
          type: "boolean",
          description: "Whether to bill in advance (default: false)",
        },
        bill_charges_monthly: {
          type: "boolean",
          description:
            "For yearly plans, bill charges monthly (default: false)",
        },
        trial_period: {
          type: "number",
          description: "Trial period in days",
        },
        tax_codes: {
          type: "array",
          items: { type: "string" },
          description: "Tax codes to apply to the plan",
        },
        charges: {
          type: "array",
          description: "Array of charge objects for usage-based billing",
          items: {
            type: "object",
            properties: {
              billable_metric_id: {
                type: "string",
                description: "Lago ID of the billable metric",
              },
              charge_model: {
                type: "string",
                description: "Charge model type",
                enum: [
                  "standard",
                  "graduated",
                  "package",
                  "percentage",
                  "volume",
                ],
              },
              pay_in_advance: { type: "boolean" },
              invoiceable: { type: "boolean" },
              min_amount_cents: { type: "number" },
              properties: {
                type: "object",
                description: "Charge model properties (amount, ranges, etc.)",
              },
              group_properties: {
                type: "array",
                items: { type: "object" },
                description: "Group-specific charge properties",
              },
              tax_codes: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["billable_metric_id", "charge_model"],
          },
        },
      },
      required: ["name", "code", "interval", "amount_cents", "amount_currency"],
    },
  },
  {
    name: "update_plan",
    description:
      "Update an existing plan by its code. Can modify name, description, amount, charges, and other settings. Existing subscriptions may be affected.",
    inputSchema: {
      type: "object" as const,
      properties: {
        code: {
          type: "string",
          description: "The code of the plan to update",
        },
        name: { type: "string", description: "New display name" },
        description: { type: "string", description: "New description" },
        amount_cents: { type: "number", description: "New amount in cents" },
        amount_currency: { type: "string", description: "New currency" },
        pay_in_advance: { type: "boolean" },
        bill_charges_monthly: { type: "boolean" },
        trial_period: { type: "number" },
        tax_codes: {
          type: "array",
          items: { type: "string" },
        },
        charges: {
          type: "array",
          description: "Updated charges array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Existing charge lago_id" },
              billable_metric_id: { type: "string" },
              charge_model: { type: "string" },
              pay_in_advance: { type: "boolean" },
              invoiceable: { type: "boolean" },
              min_amount_cents: { type: "number" },
              properties: { type: "object" },
              group_properties: {
                type: "array",
                items: { type: "object" },
              },
              tax_codes: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      },
      required: ["code"],
    },
  },
  {
    name: "delete_plan",
    description:
      "Delete a plan by its code. Active subscriptions on this plan will be terminated.",
    inputSchema: {
      type: "object" as const,
      properties: {
        code: {
          type: "string",
          description: "The code of the plan to delete",
        },
      },
      required: ["code"],
    },
  },
];

export async function handlePlanTool(
  client: LagoClient,
  toolName: string,
  args: Record<string, any>
): Promise<string> {
  switch (toolName) {
    case "list_plans": {
      const params: Record<string, any> = {};
      if (args.page) params.page = args.page;
      if (args.per_page) params.per_page = args.per_page;
      const result = await client.get("/plans", params);
      return JSON.stringify(result, null, 2);
    }

    case "get_plan": {
      const result = await client.get(`/plans/${args.code}`);
      return JSON.stringify(result, null, 2);
    }

    case "create_plan": {
      const body = { plan: { ...args } };
      const result = await client.post("/plans", body);
      return JSON.stringify(result, null, 2);
    }

    case "update_plan": {
      const { code, ...rest } = args;
      const body = { plan: rest };
      const result = await client.put(`/plans/${code}`, body);
      return JSON.stringify(result, null, 2);
    }

    case "delete_plan": {
      const result = await client.delete(`/plans/${args.code}`);
      return JSON.stringify(result, null, 2);
    }

    default:
      throw new Error(`Unknown plan tool: ${toolName}`);
  }
}
