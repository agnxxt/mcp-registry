import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { PostizClient } from "../client.js";

export const analyticsTools: Tool[] = [
  {
    name: "get_analytics",
    description: "Get Postiz analytics for a date range and optional channel",
    inputSchema: {
      type: "object" as const,
      properties: {
        from: { type: "string", description: "Start date (ISO8601)" },
        to: { type: "string", description: "End date (ISO8601)" },
        channelId: { type: "string", description: "Filter by channel ID" },
      },
      required: [],
    },
  },
  {
    name: "get_post_analytics",
    description: "Get analytics for a specific Postiz post",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Post ID" },
      },
      required: ["id"],
    },
  },
];

export async function handleAnalyticsTool(
  client: PostizClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "get_analytics":
      return client.get("/analytics", {
        from: args.from as string | undefined,
        to: args.to as string | undefined,
        channelId: args.channelId as string | undefined,
      });
    case "get_post_analytics":
      return client.get(`/posts/${args.id}/analytics`);
    default:
      throw new Error(`Unknown analytics tool: ${name}`);
  }
}
