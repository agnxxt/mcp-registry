import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { WuzapiClient } from "../client.js";

export const contactTools: Tool[] = [
  {
    name: "list_contacts",
    description: "List all WhatsApp contacts",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_messages",
    description: "Get messages for a specific phone number",
    inputSchema: {
      type: "object" as const,
      properties: {
        phone: { type: "string", description: "Phone number to get messages for" },
        count: { type: "number", description: "Number of messages to retrieve" },
      },
      required: ["phone"],
    },
  },
  {
    name: "check_number",
    description: "Check if a phone number is registered on WhatsApp",
    inputSchema: {
      type: "object" as const,
      properties: {
        phone: { type: "string", description: "Phone number to check" },
      },
      required: ["phone"],
    },
  },
];

export async function handleContactTool(
  client: WuzapiClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_contacts": {
      return client.get("/contacts");
    }
    case "get_messages": {
      const { phone, count } = args as { phone: string; count?: number };
      return client.get("/messages", { phone, count });
    }
    case "check_number": {
      const { phone } = args as { phone: string };
      return client.post("/check", { phone });
    }
    default:
      throw new Error(`Unknown contact tool: ${toolName}`);
  }
}
