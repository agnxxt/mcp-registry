import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { GrafanaClient } from "../client.js";

export const userTools: Tool[] = [
  {
    name: "list_users",
    description: "List all users in the current organization",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_user",
    description: "Get a user by their numeric ID (admin endpoint)",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "User numeric ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "search_users",
    description: "Search users by login, email, or name",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query string" },
        page: { type: "number", description: "Page number" },
        perpage: {
          type: "number",
          description: "Number of results per page",
        },
      },
    },
  },
  {
    name: "get_current_user",
    description: "Get the currently authenticated user",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "update_user",
    description: "Update the currently authenticated user's profile",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "New email address" },
        name: { type: "string", description: "New display name" },
        login: { type: "string", description: "New login/username" },
        theme: {
          type: "string",
          enum: ["dark", "light", ""],
          description: "UI theme preference",
        },
      },
    },
  },
];

export async function handleUserTool(
  client: GrafanaClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_users":
      return client.get("/org/users");

    case "get_user":
      return client.get(`/users/${args.id}`);

    case "search_users": {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (args.query) params.query = args.query as string;
      if (args.page) params.page = args.page as number;
      if (args.perpage) params.perpage = args.perpage as number;
      return client.get("/users/search", params);
    }

    case "get_current_user":
      return client.get("/user");

    case "update_user": {
      const body: Record<string, unknown> = {};
      if (args.email !== undefined) body.email = args.email;
      if (args.name !== undefined) body.name = args.name;
      if (args.login !== undefined) body.login = args.login;
      if (args.theme !== undefined) body.theme = args.theme;
      return client.put("/user", body);
    }

    default:
      throw new Error(`Unknown user tool: ${name}`);
  }
}
