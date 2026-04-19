import type { ZabbixClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "get_problems",
    description: "Get current active problems in Zabbix.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum number of problems to return" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      const params: Record<string, unknown> = {
        output: "extend",
        recent: true,
      };
      if (args.limit !== undefined) params.limit = args.limit;
      return client.call("problem.get", params);
    },
  },
  {
    name: "get_history",
    description: "Get historical data for monitoring items.",
    inputSchema: {
      type: "object",
      required: ["history"],
      properties: {
        hostids: {
          type: "array",
          items: { type: "string" },
          description: "Filter by host IDs",
        },
        itemids: {
          type: "array",
          items: { type: "string" },
          description: "Filter by item IDs",
        },
        history: {
          type: "number",
          description: "History data type: 0=float, 1=string, 2=log, 3=integer, 4=text",
        },
        sortfield: { type: "string", description: "Sort field (e.g. clock)" },
        sortorder: { type: "string", description: "Sort order (ASC or DESC)" },
        limit: { type: "number", description: "Maximum number of records to return" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      const params: Record<string, unknown> = {
        output: "extend",
        history: args.history,
      };
      if (args.hostids) params.hostids = args.hostids;
      if (args.itemids) params.itemids = args.itemids;
      if (args.sortfield) params.sortfield = args.sortfield;
      if (args.sortorder) params.sortorder = args.sortorder;
      if (args.limit !== undefined) params.limit = args.limit;
      return client.call("history.get", params);
    },
  },
  {
    name: "list_host_groups",
    description: "List all host groups in Zabbix.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: ZabbixClient) => {
      return client.call("hostgroup.get", {
        output: "extend",
      });
    },
  },
  {
    name: "create_host_group",
    description: "Create a new host group in Zabbix.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Host group name" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      return client.call("hostgroup.create", {
        name: args.name,
      });
    },
  },
  {
    name: "get_api_version",
    description: "Get the Zabbix API version. Does not require authentication.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: ZabbixClient) => {
      return client.call("apiinfo.version", {});
    },
  },
];
