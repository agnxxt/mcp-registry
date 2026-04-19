import { CalComClient } from "../client.js";
import { Webhook, CreateWebhookInput } from "../types.js";

export function getWebhookTools() {
  return [
    {
      name: "list_webhooks",
      description:
        "List all webhooks for the authenticated user. Returns webhook URLs, event triggers, and active status.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "get_webhook",
      description:
        "Get a specific webhook by its ID. Returns full details including subscriber URL, event triggers, active status, and payload template.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The webhook ID",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "create_webhook",
      description:
        "Create a new webhook. Requires a subscriber URL and event triggers. Triggers include: BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED, MEETING_ENDED, RECORDING_READY.",
      inputSchema: {
        type: "object" as const,
        properties: {
          subscriberUrl: {
            type: "string",
            description: "The URL that will receive webhook POST requests",
          },
          eventTriggers: {
            type: "array",
            items: { type: "string" },
            description:
              "Array of event trigger strings: BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED, MEETING_ENDED, RECORDING_READY",
          },
          active: {
            type: "boolean",
            description: "Whether the webhook is active. Defaults to true.",
          },
          payloadTemplate: {
            type: "string",
            description:
              "Custom payload template string. Uses Mustache-style templates.",
          },
          secret: {
            type: "string",
            description:
              "Secret used to sign webhook payloads for verification",
          },
        },
        required: ["subscriberUrl", "eventTriggers"],
      },
    },
    {
      name: "delete_webhook",
      description: "Delete a webhook by its ID. This action is irreversible.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The webhook ID to delete",
          },
        },
        required: ["id"],
      },
    },
  ];
}

export async function handleWebhookTool(
  client: CalComClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_webhooks": {
      return await client.get<{ webhooks: Webhook[] }>("/webhooks");
    }

    case "get_webhook": {
      const id = args.id as number;
      return await client.get<{ webhook: Webhook }>(`/webhooks/${id}`);
    }

    case "create_webhook": {
      const body: CreateWebhookInput = {
        subscriberUrl: args.subscriberUrl as string,
        eventTriggers: args.eventTriggers as string[],
      };
      if (args.active !== undefined) body.active = args.active as boolean;
      if (args.payloadTemplate !== undefined)
        body.payloadTemplate = args.payloadTemplate as string;
      if (args.secret !== undefined) body.secret = args.secret as string;
      return await client.post<{ webhook: Webhook }>("/webhooks", body);
    }

    case "delete_webhook": {
      const id = args.id as number;
      return await client.delete(`/webhooks/${id}`);
    }

    default:
      throw new Error(`Unknown webhook tool: ${toolName}`);
  }
}
