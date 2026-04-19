import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { LagoClient } from "../client.js";

export const customerTools: Tool[] = [
  {
    name: "list_customers",
    description:
      "List all customers in Lago with optional pagination. Returns customer records including external_id, name, email, and billing configuration.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number (default: 1)" },
        per_page: {
          type: "number",
          description: "Number of records per page (default: 20, max: 100)",
        },
      },
    },
  },
  {
    name: "get_customer",
    description:
      "Get a single customer by their external_id. Returns full customer details including billing configuration, metadata, and address.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_id: {
          type: "string",
          description: "The external ID of the customer",
        },
      },
      required: ["external_id"],
    },
  },
  {
    name: "create_customer",
    description:
      "Create a new customer in Lago. Requires external_id and name at minimum. Optionally set email, address, currency, timezone, billing configuration, and metadata.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_id: {
          type: "string",
          description: "Unique external identifier for the customer",
        },
        name: { type: "string", description: "Customer name" },
        email: { type: "string", description: "Customer email address" },
        address_line1: { type: "string", description: "Address line 1" },
        address_line2: { type: "string", description: "Address line 2" },
        city: { type: "string", description: "City" },
        state: { type: "string", description: "State or region" },
        zipcode: { type: "string", description: "Postal/ZIP code" },
        country: {
          type: "string",
          description: "ISO 3166-1 alpha-2 country code",
        },
        phone: { type: "string", description: "Phone number" },
        currency: {
          type: "string",
          description: "ISO 4217 currency code (e.g. USD, EUR)",
        },
        timezone: {
          type: "string",
          description: "IANA timezone (e.g. America/New_York)",
        },
        billing_configuration: {
          type: "object",
          description:
            "Billing configuration object with invoice_grace_period, payment_provider, provider_customer_id, sync, sync_with_provider, document_locale",
          properties: {
            invoice_grace_period: { type: "number" },
            payment_provider: { type: "string" },
            provider_customer_id: { type: "string" },
            sync: { type: "boolean" },
            sync_with_provider: { type: "boolean" },
            document_locale: { type: "string" },
          },
        },
        metadata: {
          type: "array",
          description:
            "Array of metadata objects with key, value, display_in_invoice",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" },
              display_in_invoice: { type: "boolean" },
            },
            required: ["key", "value", "display_in_invoice"],
          },
        },
      },
      required: ["external_id", "name"],
    },
  },
  {
    name: "update_customer",
    description:
      "Update an existing customer by external_id. Any provided fields will be updated; omitted fields remain unchanged.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_id: {
          type: "string",
          description: "The external ID of the customer to update",
        },
        name: { type: "string", description: "Customer name" },
        email: { type: "string", description: "Customer email address" },
        address_line1: { type: "string", description: "Address line 1" },
        address_line2: { type: "string", description: "Address line 2" },
        city: { type: "string", description: "City" },
        state: { type: "string", description: "State or region" },
        zipcode: { type: "string", description: "Postal/ZIP code" },
        country: {
          type: "string",
          description: "ISO 3166-1 alpha-2 country code",
        },
        phone: { type: "string", description: "Phone number" },
        currency: { type: "string", description: "ISO 4217 currency code" },
        timezone: { type: "string", description: "IANA timezone" },
        billing_configuration: {
          type: "object",
          description: "Billing configuration object",
          properties: {
            invoice_grace_period: { type: "number" },
            payment_provider: { type: "string" },
            provider_customer_id: { type: "string" },
            sync: { type: "boolean" },
            sync_with_provider: { type: "boolean" },
            document_locale: { type: "string" },
          },
        },
        metadata: {
          type: "array",
          description: "Array of metadata objects",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" },
              display_in_invoice: { type: "boolean" },
            },
          },
        },
      },
      required: ["external_id"],
    },
  },
  {
    name: "delete_customer",
    description:
      "Delete a customer by their external_id. This will terminate all active subscriptions and void all draft invoices.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_id: {
          type: "string",
          description: "The external ID of the customer to delete",
        },
      },
      required: ["external_id"],
    },
  },
  {
    name: "get_customer_portal_url",
    description:
      "Get the portal URL for a customer. The portal allows customers to view their invoices and manage their billing information.",
    inputSchema: {
      type: "object" as const,
      properties: {
        external_id: {
          type: "string",
          description: "The external ID of the customer",
        },
      },
      required: ["external_id"],
    },
  },
];

export async function handleCustomerTool(
  client: LagoClient,
  toolName: string,
  args: Record<string, any>
): Promise<string> {
  switch (toolName) {
    case "list_customers": {
      const params: Record<string, any> = {};
      if (args.page) params.page = args.page;
      if (args.per_page) params.per_page = args.per_page;
      const result = await client.get("/customers", params);
      return JSON.stringify(result, null, 2);
    }

    case "get_customer": {
      const result = await client.get(`/customers/${args.external_id}`);
      return JSON.stringify(result, null, 2);
    }

    case "create_customer": {
      const { external_id, ...rest } = args;
      const body = { customer: { external_id, ...rest } };
      const result = await client.post("/customers", body);
      return JSON.stringify(result, null, 2);
    }

    case "update_customer": {
      const { external_id, ...rest } = args;
      const body = { customer: rest };
      const result = await client.put(`/customers/${external_id}`, body);
      return JSON.stringify(result, null, 2);
    }

    case "delete_customer": {
      const result = await client.delete(`/customers/${args.external_id}`);
      return JSON.stringify(result, null, 2);
    }

    case "get_customer_portal_url": {
      const result = await client.get(
        `/customers/${args.external_id}/portal_url`
      );
      return JSON.stringify(result, null, 2);
    }

    default:
      throw new Error(`Unknown customer tool: ${toolName}`);
  }
}
