import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { EvolutionClient } from "../client.js";

export const instanceTools: Tool[] = [
  {
    name: "list_instances",
    description: "List all Evolution API instances",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "create_instance",
    description: "Create a new Evolution API instance",
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceName: { type: "string", description: "Name for the new instance" },
        token: { type: "string", description: "Authentication token for the instance" },
        number: { type: "string", description: "WhatsApp phone number (with country code)" },
      },
      required: ["instanceName"],
    },
  },
  {
    name: "connect_instance",
    description: "Connect an Evolution API instance (returns QR code for pairing)",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Instance name" },
      },
      required: ["name"],
    },
  },
  {
    name: "get_instance_status",
    description: "Get the connection state of an Evolution API instance",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Instance name" },
      },
      required: ["name"],
    },
  },
  {
    name: "logout_instance",
    description: "Logout an Evolution API instance (disconnect WhatsApp)",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Instance name" },
      },
      required: ["name"],
    },
  },
  {
    name: "delete_instance",
    description: "Delete an Evolution API instance permanently",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Instance name" },
      },
      required: ["name"],
    },
  },
  {
    name: "restart_instance",
    description: "Restart an Evolution API instance",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Instance name" },
      },
      required: ["name"],
    },
  },
];

export async function handleInstanceTool(
  client: EvolutionClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_instances":
      return client.get("/instance/fetchInstances");
    case "create_instance": {
      const body: Record<string, unknown> = { instanceName: args.instanceName };
      if (args.token) body.token = args.token;
      if (args.number) body.number = args.number;
      return client.post("/instance/create", body);
    }
    case "connect_instance":
      return client.get(`/instance/connect/${args.name}`);
    case "get_instance_status":
      return client.get(`/instance/connectionState/${args.name}`);
    case "logout_instance":
      return client.delete(`/instance/logout/${args.name}`);
    case "delete_instance":
      return client.delete(`/instance/delete/${args.name}`);
    case "restart_instance":
      return client.put(`/instance/restart/${args.name}`);
    default:
      throw new Error(`Unknown instance tool: ${name}`);
  }
}
