import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { EvidentlyClient } from "../client.js";

export const projectTools: Tool[] = [
  {
    name: "evidently_list_projects",
    description: "List all Evidently projects",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "evidently_get_project",
    description: "Get details of a specific Evidently project by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The project ID",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "evidently_create_project",
    description: "Create a new Evidently project",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Name of the project",
        },
        description: {
          type: "string",
          description: "Optional description of the project",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "evidently_delete_project",
    description: "Delete an Evidently project by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The project ID to delete",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "evidently_update_project",
    description: "Update an existing Evidently project name and/or description",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The project ID to update",
        },
        name: {
          type: "string",
          description: "New name for the project",
        },
        description: {
          type: "string",
          description: "New description for the project",
        },
      },
      required: ["id"],
    },
  },
];

export async function handleProjectTool(
  client: EvidentlyClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "evidently_list_projects":
      return client.get("/projects");

    case "evidently_get_project":
      return client.get(`/projects/${args.id}`);

    case "evidently_create_project": {
      const body: Record<string, unknown> = { name: args.name };
      if (args.description) body.description = args.description;
      return client.post("/projects", body);
    }

    case "evidently_delete_project":
      return client.delete(`/projects/${args.id}`);

    case "evidently_update_project": {
      const body: Record<string, unknown> = {};
      if (args.name !== undefined) body.name = args.name;
      if (args.description !== undefined) body.description = args.description;
      return client.patch(`/projects/${args.id}`, body);
    }

    default:
      throw new Error(`Unknown project tool: ${name}`);
  }
}
