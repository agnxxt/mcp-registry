import { CalComClient } from "../client.js";
import { User } from "../types.js";

export function getUserTools() {
  return [
    {
      name: "list_users",
      description:
        "List all users accessible to the authenticated user. Typically returns users within the same organization or team.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "get_user",
      description:
        "Get a specific user by their ID. Returns user details including name, email, username, timezone, and bio.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The user ID",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "get_me",
      description:
        "Get the currently authenticated user's profile. Returns your own user details including name, email, username, timezone, and default schedule.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
  ];
}

export async function handleUserTool(
  client: CalComClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_users": {
      return await client.get<{ users: User[] }>("/users");
    }

    case "get_user": {
      const id = args.id as number;
      return await client.get<{ user: User }>(`/users/${id}`);
    }

    case "get_me": {
      return await client.get<{ user: User }>("/me");
    }

    default:
      throw new Error(`Unknown user tool: ${toolName}`);
  }
}
