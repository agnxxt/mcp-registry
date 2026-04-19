import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { UptimeKumaClient } from "../client.js";

export const statusPageTools: Tool[] = [
  {
    name: "list_status_pages",
    description: "List all status pages",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_status_page",
    description: "Get a status page by slug",
    inputSchema: {
      type: "object" as const,
      properties: {
        slug: { type: "string", description: "Status page slug" },
      },
      required: ["slug"],
    },
  },
  {
    name: "add_status_page",
    description: "Create a new status page",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Status page title" },
        slug: { type: "string", description: "URL slug for the status page" },
      },
      required: ["title", "slug"],
    },
  },
  {
    name: "delete_status_page",
    description: "Delete a status page by slug",
    inputSchema: {
      type: "object" as const,
      properties: {
        slug: { type: "string", description: "Status page slug to delete" },
      },
      required: ["slug"],
    },
  },
];

export async function handleStatusPageTool(
  client: UptimeKumaClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "list_status_pages": {
      return client.get("/api/status-pages");
    }
    case "get_status_page": {
      const { slug } = args as { slug: string };
      return client.get(`/api/status-pages/${slug}`);
    }
    case "add_status_page": {
      const { title, slug } = args as { title: string; slug: string };
      return client.post("/api/status-pages", { title, slug });
    }
    case "delete_status_page": {
      const { slug } = args as { slug: string };
      return client.delete(`/api/status-pages/${slug}`);
    }
    default:
      throw new Error(`Unknown status page tool: ${toolName}`);
  }
}
