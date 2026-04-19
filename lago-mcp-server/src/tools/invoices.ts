import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { LagoClient } from "../client.js";

export const invoiceTools: Tool[] = [
  {
    name: "list_invoices",
    description:
      "List all invoices with optional filters for status, payment_status, and pagination. Returns invoice summaries including amounts, dates, and customer info.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default: 1)" },
        per_page: {
          type: "number",
          description: "Records per page (default: 20, max: 100)",
        },
        status: {
          type: "string",
          description: "Filter by status: draft or finalized",
          enum: ["draft", "finalized"],
        },
        payment_status: {
          type: "string",
          description: "Filter by payment status: pending, succeeded, or failed",
          enum: ["pending", "succeeded", "failed"],
        },
        external_customer_id: {
          type: "string",
          description: "Filter by customer external ID",
        },
        issuing_date_from: {
          type: "string",
          description: "Filter invoices issued from this date (ISO 8601)",
        },
        issuing_date_to: {
          type: "string",
          description: "Filter invoices issued up to this date (ISO 8601)",
        },
      },
    },
  },
  {
    name: "get_invoice",
    description:
      "Get a single invoice by its Lago ID. Returns full invoice details including line items, taxes, credits, and customer info.",
    inputSchema: {
      type: "object" as const,
      properties: {
        lago_id: {
          type: "string",
          description: "The Lago UUID of the invoice",
        },
      },
      required: ["lago_id"],
    },
  },
  {
    name: "create_one_off_invoice",
    description:
      "Create a one-off invoice for a customer. Used for ad-hoc charges outside of regular subscription billing. Requires external_customer_id and an array of fees.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_customer_id: {
          type: "string",
          description: "The external ID of the customer to invoice",
        },
        currency: {
          type: "string",
          description: "ISO 4217 currency code (e.g. USD)",
        },
        fees: {
          type: "array",
          description: "Array of fee objects for the invoice",
          items: {
            type: "object",
            properties: {
              add_on_code: {
                type: "string",
                description: "Code of the add-on to charge",
              },
              description: {
                type: "string",
                description: "Description of the fee",
              },
              units: {
                type: "number",
                description: "Number of units",
              },
              unit_amount_cents: {
                type: "number",
                description: "Amount per unit in cents",
              },
              tax_codes: {
                type: "array",
                items: { type: "string" },
                description: "Tax codes to apply",
              },
            },
            required: ["add_on_code", "units", "unit_amount_cents"],
          },
        },
      },
      required: ["external_customer_id", "fees"],
    },
  },
  {
    name: "update_invoice",
    description:
      "Update an invoice's payment_status or metadata. Can mark invoices as paid/failed or add custom metadata.",
    inputSchema: {
      type: "object" as const,
      properties: {
        lago_id: {
          type: "string",
          description: "The Lago UUID of the invoice to update",
        },
        payment_status: {
          type: "string",
          description: "New payment status",
          enum: ["pending", "succeeded", "failed"],
        },
        metadata: {
          type: "array",
          description: "Array of metadata objects with key and value",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" },
            },
            required: ["key", "value"],
          },
        },
      },
      required: ["lago_id"],
    },
  },
  {
    name: "download_invoice",
    description:
      "Generate and download a PDF for a finalized invoice. Returns the invoice PDF download URL.",
    inputSchema: {
      type: "object" as const,
      properties: {
        lago_id: {
          type: "string",
          description: "The Lago UUID of the invoice to download",
        },
      },
      required: ["lago_id"],
    },
  },
  {
    name: "finalize_invoice",
    description:
      "Finalize a draft invoice. Once finalized, the invoice number is assigned and the invoice can no longer be edited.",
    inputSchema: {
      type: "object" as const,
      properties: {
        lago_id: {
          type: "string",
          description: "The Lago UUID of the draft invoice to finalize",
        },
      },
      required: ["lago_id"],
    },
  },
  {
    name: "void_invoice",
    description:
      "Void a finalized invoice. This creates a credit note for the full amount and marks the invoice as voided.",
    inputSchema: {
      type: "object" as const,
      properties: {
        lago_id: {
          type: "string",
          description: "The Lago UUID of the invoice to void",
        },
      },
      required: ["lago_id"],
    },
  },
];

export async function handleInvoiceTool(
  client: LagoClient,
  toolName: string,
  args: Record<string, any>
): Promise<string> {
  switch (toolName) {
    case "list_invoices": {
      const params: Record<string, any> = {};
      if (args.page) params.page = args.page;
      if (args.per_page) params.per_page = args.per_page;
      if (args.status) params.status = args.status;
      if (args.payment_status) params.payment_status = args.payment_status;
      if (args.external_customer_id)
        params.external_customer_id = args.external_customer_id;
      if (args.issuing_date_from)
        params.issuing_date_from = args.issuing_date_from;
      if (args.issuing_date_to) params.issuing_date_to = args.issuing_date_to;
      const result = await client.get("/invoices", params);
      return JSON.stringify(result, null, 2);
    }

    case "get_invoice": {
      const result = await client.get(`/invoices/${args.lago_id}`);
      return JSON.stringify(result, null, 2);
    }

    case "create_one_off_invoice": {
      const body = {
        invoice: {
          external_customer_id: args.external_customer_id,
          currency: args.currency,
          fees: args.fees,
        },
      };
      const result = await client.post("/invoices", body);
      return JSON.stringify(result, null, 2);
    }

    case "update_invoice": {
      const { lago_id, ...rest } = args;
      const body = { invoice: rest };
      const result = await client.put(`/invoices/${lago_id}`, body);
      return JSON.stringify(result, null, 2);
    }

    case "download_invoice": {
      const result = await client.post(`/invoices/${args.lago_id}/download`);
      return JSON.stringify(result, null, 2);
    }

    case "finalize_invoice": {
      const result = await client.put(`/invoices/${args.lago_id}/finalize`, {});
      return JSON.stringify(result, null, 2);
    }

    case "void_invoice": {
      const result = await client.post(`/invoices/${args.lago_id}/void`);
      return JSON.stringify(result, null, 2);
    }

    default:
      throw new Error(`Unknown invoice tool: ${toolName}`);
  }
}
