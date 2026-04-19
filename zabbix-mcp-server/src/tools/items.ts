import type { ZabbixClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_items",
    description: "List monitoring items for a specific host.",
    inputSchema: {
      type: "object",
      required: ["hostid"],
      properties: {
        hostid: { type: "string", description: "Host ID to list items for" },
        limit: { type: "number", description: "Maximum number of items to return" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      const params: Record<string, unknown> = {
        hostids: [args.hostid],
        output: "extend",
      };
      if (args.limit !== undefined) params.limit = args.limit;
      return client.call("item.get", params);
    },
  },
  {
    name: "get_item",
    description: "Get details of a specific monitoring item by ID.",
    inputSchema: {
      type: "object",
      required: ["itemid"],
      properties: {
        itemid: { type: "string", description: "Item ID" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      return client.call("item.get", {
        itemids: [args.itemid],
        output: "extend",
      });
    },
  },
];
