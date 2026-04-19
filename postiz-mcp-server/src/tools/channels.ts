import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { PostizClient } from "../client.js";

export const channelTools: Tool[] = [
  {
    name: "list_channels",
    description: "List all connected Postiz channels",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "connect_channel",
    description: "Connect a new channel/platform to Postiz",
    inputSchema: {
      type: "object" as const,
      properties: {
        type: { type: "string", description: "Channel type (e.g. twitter, facebook, linkedin, instagram)" },
        credentials: {
          type: "object",
          description: "Authentication credentials for the channel",
        },
      },
      required: ["type", "credentials"],
    },
  },
  {
    name: "disconnect_channel",
    description: "Disconnect a channel from Postiz",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Channel ID" },
      },
      required: ["id"],
    },
  },
];

export async function handleChannelTool(
  client: PostizClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_channels":
      return client.get("/channels");
    case "connect_channel":
      return client.post("/channels", {
        type: args.type,
        credentials: args.credentials,
      });
    case "disconnect_channel":
      return client.delete(`/channels/${args.id}`);
    default:
      throw new Error(`Unknown channel tool: ${name}`);
  }
}
