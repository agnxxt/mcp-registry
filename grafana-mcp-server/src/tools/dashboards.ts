import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { GrafanaClient } from "../client.js";

export const dashboardTools: Tool[] = [
  {
    name: "search_dashboards",
    description: "Search for dashboards by query, tag, type, or other filters",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query string" },
        tag: { type: "string", description: "Filter by tag" },
        type: {
          type: "string",
          enum: ["dash-folder", "dash-db"],
          description: "Type to filter (dash-folder or dash-db)",
        },
        dashboardIds: {
          type: "string",
          description: "Comma-separated dashboard IDs",
        },
        folderIds: {
          type: "string",
          description: "Comma-separated folder IDs",
        },
        starred: {
          type: "boolean",
          description: "Filter to starred dashboards only",
        },
        limit: {
          type: "number",
          description: "Max number of results to return",
        },
      },
    },
  },
  {
    name: "get_dashboard",
    description: "Get a dashboard by its UID, including full model and metadata",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Dashboard UID" },
      },
      required: ["uid"],
    },
  },
  {
    name: "create_dashboard",
    description:
      "Create or update a dashboard. Provide the full dashboard model.",
    inputSchema: {
      type: "object" as const,
      properties: {
        dashboard: {
          type: "object",
          description:
            "The complete dashboard model (JSON object with title, panels, etc.)",
        },
        folderId: {
          type: "number",
          description: "The ID of the folder to save the dashboard in",
        },
        folderUid: {
          type: "string",
          description: "The UID of the folder to save the dashboard in",
        },
        overwrite: {
          type: "boolean",
          description: "Overwrite existing dashboard with newer version",
        },
        message: {
          type: "string",
          description: "Commit message for the version history",
        },
      },
      required: ["dashboard"],
    },
  },
  {
    name: "delete_dashboard",
    description: "Delete a dashboard by its UID",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Dashboard UID to delete" },
      },
      required: ["uid"],
    },
  },
  {
    name: "get_dashboard_versions",
    description: "Get all versions of a dashboard by its numeric ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        dashboardId: {
          type: "number",
          description: "Numeric dashboard ID",
        },
      },
      required: ["dashboardId"],
    },
  },
  {
    name: "get_dashboard_permissions",
    description: "Get permissions for a dashboard by its UID",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Dashboard UID" },
      },
      required: ["uid"],
    },
  },
  {
    name: "update_dashboard_permissions",
    description:
      "Update permissions for a dashboard. Provide the full list of permission items.",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Dashboard UID" },
        items: {
          type: "array",
          description:
            "Array of permission items, each with role/teamId/userId and permission level (1=View, 2=Edit, 4=Admin)",
          items: {
            type: "object",
            properties: {
              role: { type: "string" },
              teamId: { type: "number" },
              userId: { type: "number" },
              permission: { type: "number" },
            },
          },
        },
      },
      required: ["uid", "items"],
    },
  },
  {
    name: "get_home_dashboard",
    description: "Get the home dashboard",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
];

export async function handleDashboardTool(
  client: GrafanaClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "search_dashboards": {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (args.query) params.query = args.query as string;
      if (args.tag) params.tag = args.tag as string;
      if (args.type) params.type = args.type as string;
      if (args.dashboardIds) params.dashboardIds = args.dashboardIds as string;
      if (args.folderIds) params.folderIds = args.folderIds as string;
      if (args.starred !== undefined) params.starred = args.starred as boolean;
      if (args.limit) params.limit = args.limit as number;
      return client.get("/search", params);
    }

    case "get_dashboard":
      return client.get(`/dashboards/uid/${args.uid}`);

    case "create_dashboard": {
      const body: Record<string, unknown> = {
        dashboard: args.dashboard,
      };
      if (args.folderId !== undefined) body.folderId = args.folderId;
      if (args.folderUid !== undefined) body.folderUid = args.folderUid;
      if (args.overwrite !== undefined) body.overwrite = args.overwrite;
      if (args.message !== undefined) body.message = args.message;
      return client.post("/dashboards/db", body);
    }

    case "delete_dashboard":
      return client.delete(`/dashboards/uid/${args.uid}`);

    case "get_dashboard_versions":
      return client.get(`/dashboards/id/${args.dashboardId}/versions`);

    case "get_dashboard_permissions":
      return client.get(`/dashboards/uid/${args.uid}/permissions`);

    case "update_dashboard_permissions":
      return client.post(`/dashboards/uid/${args.uid}/permissions`, {
        items: args.items,
      });

    case "get_home_dashboard":
      return client.get("/dashboards/home");

    default:
      throw new Error(`Unknown dashboard tool: ${name}`);
  }
}
