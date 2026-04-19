import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { PostizClient } from "../client.js";

export const postTools: Tool[] = [
  {
    name: "list_posts",
    description: "List Postiz posts with optional pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Page number" },
        limit: { type: "number", description: "Number of posts per page" },
      },
      required: [],
    },
  },
  {
    name: "get_post",
    description: "Get a single Postiz post by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Post ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_post",
    description: "Create a new Postiz post",
    inputSchema: {
      type: "object" as const,
      properties: {
        content: { type: "string", description: "Post content text" },
        platforms: {
          type: "array",
          description: "Array of platform identifiers to publish to",
          items: { type: "string" },
        },
        scheduledDate: { type: "string", description: "ISO8601 date to schedule the post for" },
      },
      required: ["content"],
    },
  },
  {
    name: "update_post",
    description: "Update an existing Postiz post",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Post ID" },
        content: { type: "string", description: "Updated post content" },
        platforms: {
          type: "array",
          description: "Updated platform identifiers",
          items: { type: "string" },
        },
        scheduledDate: { type: "string", description: "Updated scheduled date" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_post",
    description: "Delete a Postiz post",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Post ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "schedule_post",
    description: "Schedule an existing Postiz post for publishing",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Post ID" },
      },
      required: ["id"],
    },
  },
];

export async function handlePostTool(
  client: PostizClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_posts":
      return client.get("/posts", {
        page: args.page as number | undefined,
        limit: args.limit as number | undefined,
      });
    case "get_post":
      return client.get(`/posts/${args.id}`);
    case "create_post": {
      const body: Record<string, unknown> = { content: args.content };
      if (args.platforms) body.platforms = args.platforms;
      if (args.scheduledDate) body.scheduledDate = args.scheduledDate;
      return client.post("/posts", body);
    }
    case "update_post": {
      const { id, ...data } = args;
      return client.put(`/posts/${id}`, data);
    }
    case "delete_post":
      return client.delete(`/posts/${args.id}`);
    case "schedule_post":
      return client.post(`/posts/${args.id}/schedule`);
    default:
      throw new Error(`Unknown post tool: ${name}`);
  }
}
