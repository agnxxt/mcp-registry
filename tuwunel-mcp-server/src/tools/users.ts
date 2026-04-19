import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { TuwunelClient } from "../client.js";

export const userTools: Tool[] = [
  {
    name: "whoami",
    description: "Get the authenticated user's identity",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_profile",
    description: "Get a user's profile (display name and avatar)",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID (e.g. @user:server)" },
      },
      required: ["userId"],
    },
  },
  {
    name: "set_display_name",
    description: "Set a user's display name",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        displayname: { type: "string", description: "New display name" },
      },
      required: ["userId", "displayname"],
    },
  },
  {
    name: "set_avatar_url",
    description: "Set a user's avatar URL",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        avatar_url: { type: "string", description: "New avatar URL (mxc:// URI)" },
      },
      required: ["userId", "avatar_url"],
    },
  },
];

export async function handleUserTool(
  client: TuwunelClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "whoami": {
      return client.get("/account/whoami");
    }
    case "get_profile": {
      const { userId } = args as { userId: string };
      return client.get(`/profile/${encodeURIComponent(userId)}`);
    }
    case "set_display_name": {
      const { userId, displayname } = args as {
        userId: string;
        displayname: string;
      };
      return client.put(
        `/profile/${encodeURIComponent(userId)}/displayname`,
        { displayname }
      );
    }
    case "set_avatar_url": {
      const { userId, avatar_url } = args as {
        userId: string;
        avatar_url: string;
      };
      return client.put(
        `/profile/${encodeURIComponent(userId)}/avatar_url`,
        { avatar_url }
      );
    }
    default:
      throw new Error(`Unknown user tool: ${toolName}`);
  }
}
