import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { EvolutionClient } from "../client.js";

export const contactTools: Tool[] = [
  {
    name: "list_contacts",
    description: "List all contacts for an Evolution API instance",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
      },
      required: ["instanceName"],
    },
  },
  {
    name: "get_contact_profile",
    description: "Get profile information for a WhatsApp number",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
        number: { type: "string", description: "Phone number to look up (with country code)" },
      },
      required: ["instanceName", "number"],
    },
  },
  {
    name: "check_whatsapp_number",
    description: "Check if phone numbers are registered on WhatsApp",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
        numbers: {
          type: "array",
          description: "Array of phone numbers to check",
          items: { type: "string" },
        },
      },
      required: ["instanceName", "numbers"],
    },
  },
];

export async function handleContactTool(
  client: EvolutionClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_contacts":
      return client.get(`/chat/contacts/${args.instanceName}`);
    case "get_contact_profile":
      return client.get(`/chat/fetchProfile/${args.instanceName}`, {
        number: args.number as string,
      });
    case "check_whatsapp_number":
      return client.post(`/chat/whatsappNumbers/${args.instanceName}`, {
        numbers: args.numbers,
      });
    default:
      throw new Error(`Unknown contact tool: ${name}`);
  }
}
