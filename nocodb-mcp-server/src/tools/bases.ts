import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { NocoDBClient } from "../client.js";

export const baseTools: Tool[] = [
  {
    name: "list_bases",
    description: "List all bases (projects) in NocoDB",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_base",
    description: "Get details of a specific NocoDB base",
    inputSchema: {
      type: "object" as const,
      properties: {
        baseId: { type: "string", description: "The base ID" },
      },
      required: ["baseId"],
    },
  },
  {
    name: "create_base",
    description: "Create a new base (project) in NocoDB",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Title for the new base" },
        sources: {
          type: "array",
          items: { type: "object" },
          description:
            "Optional array of data source configurations",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "delete_base",
    description: "Delete a base (project) from NocoDB",
    inputSchema: {
      type: "object" as const,
      properties: {
        baseId: { type: "string", description: "The base ID to delete" },
      },
      required: ["baseId"],
    },
  },
];

export async function handleBaseTool(
  client: NocoDBClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_bases": {
      return client.get("/meta/bases");
    }
    case "get_base": {
      const { baseId } = args as { baseId: string };
      return client.get(`/meta/bases/${baseId}`);
    }
    case "create_base": {
      const { title, sources } = args as {
        title: string;
        sources?: Record<string, unknown>[];
      };
      const body: Record<string, unknown> = { title };
      if (sources) body.sources = sources;
      return client.post("/meta/bases", body);
    }
    case "delete_base": {
      const { baseId } = args as { baseId: string };
      return client.delete(`/meta/bases/${baseId}`);
    }
    default:
      throw new Error(`Unknown base tool: ${toolName}`);
  }
}
