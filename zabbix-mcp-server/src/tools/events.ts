import type { ZabbixClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_events",
    description: "List recent events in Zabbix, sorted by time descending.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum number of events to return (default 50)" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      return client.call("event.get", {
        output: "extend",
        sortfield: "clock",
        sortorder: "DESC",
        limit: args.limit ?? 50,
      });
    },
  },
  {
    name: "acknowledge_event",
    description: "Acknowledge an event and optionally add a message.",
    inputSchema: {
      type: "object",
      required: ["eventids", "action"],
      properties: {
        eventids: {
          type: "array",
          items: { type: "string" },
          description: "Array of event IDs to acknowledge",
        },
        action: {
          type: "number",
          description: "Acknowledge action bitmask: 1=close, 2=acknowledge, 4=add message, 8=change severity",
        },
        message: { type: "string", description: "Message to add to the event" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      const params: Record<string, unknown> = {
        eventids: args.eventids,
        action: args.action,
      };
      if (args.message) params.message = args.message;
      return client.call("event.acknowledge", params);
    },
  },
];
