import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { LagoClient } from "../client.js";

export const walletTools: Tool[] = [
  {
    name: "list_wallets",
    description:
      "List wallets for a customer. Wallets hold prepaid credits that can be consumed against usage charges.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_customer_id: {
          type: "string",
          description: "The external ID of the customer",
        },
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Records per page" },
      },
      required: ["external_customer_id"],
    },
  },
  {
    name: "get_wallet",
    description:
      "Get a single wallet by its Lago ID. Returns balance, credits, consumption, and status.",
    inputSchema: {
      type: "object" as const,
      properties: {
        lago_id: {
          type: "string",
          description: "The Lago UUID of the wallet",
        },
      },
      required: ["lago_id"],
    },
  },
  {
    name: "create_wallet",
    description:
      "Create a new prepaid credit wallet for a customer. Set the credit rate, currency, optional name, and initial granted/paid credits.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_customer_id: {
          type: "string",
          description: "The external ID of the customer",
        },
        rate_amount: {
          type: "string",
          description:
            "Rate of conversion from credits to currency (e.g. '1.0' means 1 credit = 1 currency unit)",
        },
        currency: {
          type: "string",
          description: "ISO 4217 currency code (e.g. USD)",
        },
        name: {
          type: "string",
          description: "Display name for the wallet",
        },
        paid_credits: {
          type: "string",
          description: "Initial paid credits to grant (e.g. '100.0')",
        },
        granted_credits: {
          type: "string",
          description: "Initial free granted credits (e.g. '50.0')",
        },
        expiration_at: {
          type: "string",
          description: "Expiration date for the wallet (ISO 8601)",
        },
      },
      required: ["external_customer_id", "rate_amount", "currency"],
    },
  },
  {
    name: "update_wallet",
    description:
      "Update a wallet. Can change name, expiration, or top up with additional paid/granted credits.",
    inputSchema: {
      type: "object" as const,
      properties: {
        lago_id: {
          type: "string",
          description: "The Lago UUID of the wallet to update",
        },
        name: { type: "string", description: "New display name" },
        expiration_at: {
          type: "string",
          description: "New expiration date (ISO 8601)",
        },
        paid_credits: {
          type: "string",
          description: "Additional paid credits to add",
        },
        granted_credits: {
          type: "string",
          description: "Additional granted credits to add",
        },
      },
      required: ["lago_id"],
    },
  },
  {
    name: "terminate_wallet",
    description:
      "Terminate a wallet by its Lago ID. Remaining credits will be voided.",
    inputSchema: {
      type: "object" as const,
      properties: {
        lago_id: {
          type: "string",
          description: "The Lago UUID of the wallet to terminate",
        },
      },
      required: ["lago_id"],
    },
  },
];

export async function handleWalletTool(
  client: LagoClient,
  toolName: string,
  args: Record<string, any>
): Promise<string> {
  switch (toolName) {
    case "list_wallets": {
      const params: Record<string, any> = {
        external_customer_id: args.external_customer_id,
      };
      if (args.page) params.page = args.page;
      if (args.per_page) params.per_page = args.per_page;
      const result = await client.get("/wallets", params);
      return JSON.stringify(result, null, 2);
    }

    case "get_wallet": {
      const result = await client.get(`/wallets/${args.lago_id}`);
      return JSON.stringify(result, null, 2);
    }

    case "create_wallet": {
      const body = { wallet: { ...args } };
      const result = await client.post("/wallets", body);
      return JSON.stringify(result, null, 2);
    }

    case "update_wallet": {
      const { lago_id, ...rest } = args;
      const body = { wallet: rest };
      const result = await client.put(`/wallets/${lago_id}`, body);
      return JSON.stringify(result, null, 2);
    }

    case "terminate_wallet": {
      const result = await client.delete(`/wallets/${args.lago_id}`);
      return JSON.stringify(result, null, 2);
    }

    default:
      throw new Error(`Unknown wallet tool: ${toolName}`);
  }
}
