import { CalComClient } from "../client.js";
import { Team, CreateTeamInput } from "../types.js";

export function getTeamTools() {
  return [
    {
      name: "list_teams",
      description:
        "List all teams the authenticated user belongs to. Returns team names, slugs, and member information.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "get_team",
      description:
        "Get a specific team by its ID. Returns full team details including name, slug, logo, bio, and members.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The team ID",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "create_team",
      description:
        "Create a new team. Requires a name and optionally a slug.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: {
            type: "string",
            description: "Name of the team",
          },
          slug: {
            type: "string",
            description:
              "URL-friendly slug for the team. Auto-generated from name if not provided.",
          },
        },
        required: ["name"],
      },
    },
    {
      name: "delete_team",
      description:
        "Delete a team by its ID. This action is irreversible and removes all team event types and memberships.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "The team ID to delete",
          },
        },
        required: ["id"],
      },
    },
  ];
}

export async function handleTeamTool(
  client: CalComClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_teams": {
      return await client.get<{ teams: Team[] }>("/teams");
    }

    case "get_team": {
      const id = args.id as number;
      return await client.get<{ team: Team }>(`/teams/${id}`);
    }

    case "create_team": {
      const body: CreateTeamInput = {
        name: args.name as string,
      };
      if (args.slug !== undefined) body.slug = args.slug as string;
      return await client.post<{ team: Team }>("/teams", body);
    }

    case "delete_team": {
      const id = args.id as number;
      return await client.delete(`/teams/${id}`);
    }

    default:
      throw new Error(`Unknown team tool: ${toolName}`);
  }
}
