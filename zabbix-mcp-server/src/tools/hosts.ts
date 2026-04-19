import type { ZabbixClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_hosts",
    description: "List monitored hosts in Zabbix. Supports limiting the number of results.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum number of hosts to return" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      const params: Record<string, unknown> = { output: "extend" };
      if (args.limit !== undefined) params.limit = args.limit;
      return client.call("host.get", params);
    },
  },
  {
    name: "get_host",
    description: "Get details of a specific host by ID.",
    inputSchema: {
      type: "object",
      required: ["hostid"],
      properties: {
        hostid: { type: "string", description: "Host ID" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      return client.call("host.get", {
        hostids: [args.hostid],
        output: "extend",
      });
    },
  },
  {
    name: "create_host",
    description: "Create a new monitored host in Zabbix.",
    inputSchema: {
      type: "object",
      required: ["host", "groups", "interfaces"],
      properties: {
        host: { type: "string", description: "Technical name of the host" },
        groups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              groupid: { type: "string", description: "Host group ID" },
            },
          },
          description: "Array of host groups to add the host to (each with groupid)",
        },
        interfaces: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "number", description: "Interface type: 1=agent, 2=SNMP, 3=IPMI, 4=JMX" },
              main: { type: "number", description: "1 for default interface, 0 otherwise" },
              useip: { type: "number", description: "1 to use IP, 0 to use DNS" },
              ip: { type: "string", description: "IP address" },
              dns: { type: "string", description: "DNS name" },
              port: { type: "string", description: "Port number" },
            },
          },
          description: "Array of host interfaces",
        },
        templates: {
          type: "array",
          items: {
            type: "object",
            properties: {
              templateid: { type: "string", description: "Template ID to link" },
            },
          },
          description: "Optional array of templates to link",
        },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      const params: Record<string, unknown> = {
        host: args.host,
        groups: args.groups,
        interfaces: args.interfaces,
      };
      if (args.templates) params.templates = args.templates;
      return client.call("host.create", params);
    },
  },
];
