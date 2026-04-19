import type { ZabbixClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_triggers",
    description: "List triggers for a specific host with expanded descriptions.",
    inputSchema: {
      type: "object",
      required: ["hostid"],
      properties: {
        hostid: { type: "string", description: "Host ID to list triggers for" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      return client.call("trigger.get", {
        hostids: [args.hostid],
        output: "extend",
        expandDescription: true,
      });
    },
  },
  {
    name: "get_trigger",
    description: "Get details of a specific trigger by ID.",
    inputSchema: {
      type: "object",
      required: ["triggerid"],
      properties: {
        triggerid: { type: "string", description: "Trigger ID" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      return client.call("trigger.get", {
        triggerids: [args.triggerid],
        output: "extend",
        expandDescription: true,
      });
    },
  },
];
