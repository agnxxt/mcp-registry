import type { ZabbixClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_templates",
    description: "List all available templates in Zabbix.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: ZabbixClient) => {
      return client.call("template.get", {
        output: "extend",
      });
    },
  },
  {
    name: "get_template",
    description: "Get details of a specific template by ID.",
    inputSchema: {
      type: "object",
      required: ["templateid"],
      properties: {
        templateid: { type: "string", description: "Template ID" },
      },
    },
    handler: async (client: ZabbixClient, args: Record<string, unknown>) => {
      return client.call("template.get", {
        templateids: [args.templateid],
        output: "extend",
      });
    },
  },
];
