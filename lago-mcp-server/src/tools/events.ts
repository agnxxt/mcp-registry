import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { LagoClient } from "../client.js";

export const eventTools: Tool[] = [
  {
    name: "create_event",
    description:
      "Send a usage event to Lago for metered billing. Events are tied to a customer and a billable metric code. Properties can contain additional dimensions for the event.",
    inputSchema: {
      type: "object" as const,
      properties: {
        transaction_id: {
          type: "string",
          description:
            "Unique idempotency key for this event. Prevents duplicate processing.",
        },
        external_customer_id: {
          type: "string",
          description: "The external ID of the customer this event belongs to",
        },
        external_subscription_id: {
          type: "string",
          description:
            "The external subscription ID (required if customer has multiple active subscriptions)",
        },
        code: {
          type: "string",
          description: "The code of the billable metric to record",
        },
        timestamp: {
          type: "number",
          description: "Unix timestamp of the event (defaults to current time)",
        },
        properties: {
          type: "object",
          description:
            "Custom properties for the event (e.g. { amount: 5, region: 'us-east' })",
        },
      },
      required: ["transaction_id", "external_customer_id", "code"],
    },
  },
  {
    name: "create_batch_events",
    description:
      "Send multiple usage events to Lago in a single request. More efficient than sending events individually. Each event needs its own transaction_id.",
    inputSchema: {
      type: "object" as const,
      properties: {
        events: {
          type: "array",
          description: "Array of event objects to send",
          items: {
            type: "object",
            properties: {
              transaction_id: {
                type: "string",
                description: "Unique idempotency key",
              },
              external_customer_id: {
                type: "string",
                description: "Customer external ID",
              },
              external_subscription_id: {
                type: "string",
                description: "Subscription external ID (optional)",
              },
              code: {
                type: "string",
                description: "Billable metric code",
              },
              timestamp: {
                type: "number",
                description: "Unix timestamp",
              },
              properties: {
                type: "object",
                description: "Custom event properties",
              },
            },
            required: ["transaction_id", "code"],
          },
        },
      },
      required: ["events"],
    },
  },
  {
    name: "get_event",
    description:
      "Retrieve a single event by its transaction_id. Useful for verifying that an event was received and processed correctly.",
    inputSchema: {
      type: "object" as const,
      properties: {
        transaction_id: {
          type: "string",
          description: "The transaction ID of the event to retrieve",
        },
      },
      required: ["transaction_id"],
    },
  },
];

export async function handleEventTool(
  client: LagoClient,
  toolName: string,
  args: Record<string, any>
): Promise<string> {
  switch (toolName) {
    case "create_event": {
      const body = { event: { ...args } };
      const result = await client.post("/events", body);
      return JSON.stringify(result, null, 2);
    }

    case "create_batch_events": {
      const body = { events: args.events };
      const result = await client.post("/events/batch", body);
      return JSON.stringify(result, null, 2);
    }

    case "get_event": {
      const result = await client.get(`/events/${args.transaction_id}`);
      return JSON.stringify(result, null, 2);
    }

    default:
      throw new Error(`Unknown event tool: ${toolName}`);
  }
}
