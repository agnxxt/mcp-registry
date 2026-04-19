import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { EvolutionClient } from "../client.js";

export const groupTools: Tool[] = [
  {
    name: "list_groups",
    description: "List all WhatsApp groups for an Evolution API instance",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
      },
      required: ["instanceName"],
    },
  },
  {
    name: "create_group",
    description: "Create a new WhatsApp group",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
        subject: { type: "string", description: "Group name/subject" },
        participants: {
          type: "array",
          description: "Array of participant phone numbers (with country code)",
          items: { type: "string" },
        },
      },
      required: ["instanceName", "subject", "participants"],
    },
  },
  {
    name: "get_group_info",
    description: "Get information about a specific WhatsApp group",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Instance name" },
        groupJid: { type: "string", description: "Group JID identifier" },
      },
      required: ["instanceName", "groupJid"],
    },
  },
];

export async function handleGroupTool(
  client: EvolutionClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_groups":
      return client.get(`/group/fetchAllGroups/${args.instanceName}`);
    case "create_group":
      return client.post(`/group/create/${args.instanceName}`, {
        subject: args.subject,
        participants: args.participants,
      });
    case "get_group_info":
      return client.get(`/group/findGroupInfos/${args.instanceName}`, {
        groupJid: args.groupJid as string,
      });
    default:
      throw new Error(`Unknown group tool: ${name}`);
  }
}
