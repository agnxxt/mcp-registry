import type { ZabbixClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_maintenance",
    description: "List all maintenance periods in Zabbix.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: ZabbixClient) => {
      return client.call("maintenance.get", {
        output: "extend",
      });
    },
  },
  {
    name: "create_maintenance",
    description: "Create a new maintenance period for specified hosts.",
    inputSchema: {
      type: "object",
      required: ["name", "active_since", "active_till", "hostids", "timeperiods"],
      properties: {
        name: { type: "string", description: "Maintenance period name" },
        active_since: { type: "number", description: "Unix timestamp for maintenance start" },
        active_till: { type: "number", description: "Unix timestamp for maintenance end" },
        hostids: {
          type: "array",
          items: { type: "string" },
          description: "Array of host IDs to put in maintenance",
        },
        timeperiods: {
          type: "array",
          items: {
            type: "object",
            properties: {
              timeperiod_type: { type: "number", description: "0=one time, 2=daily, 3=weekly, 4=monthly" },
              start_date: { type: "number", description: "Unix timestamp of period start" },
              period: { type: "number", description: "Duration in seconds" },
            },
          },
          description: "Array of maintenance time periods",
        },
        description: { type: "string", description: "Optional description" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      const params: Record<string, unknown> = {
        name: args.name,
        active_since: args.active_since,
        active_till: args.active_till,
        hostids: args.hostids,
        timeperiods: args.timeperiods,
      };
      if (args.description) params.description = args.description;
      return client.call("maintenance.create", params);
    },
  },
];
