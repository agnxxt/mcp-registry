import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { GrafanaClient } from "../client.js";

export const folderTools: Tool[] = [
  {
    name: "list_folders",
    description: "List all folders in Grafana",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description: "Max number of folders to return",
        },
        page: { type: "number", description: "Page number" },
      },
    },
  },
  {
    name: "get_folder",
    description: "Get a folder by its UID",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Folder UID" },
      },
      required: ["uid"],
    },
  },
  {
    name: "create_folder",
    description: "Create a new folder",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Folder title" },
        uid: {
          type: "string",
          description: "Optional custom UID for the folder",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "update_folder",
    description: "Update an existing folder by UID",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Folder UID" },
        title: { type: "string", description: "New folder title" },
        version: {
          type: "number",
          description: "Current version of the folder (for optimistic locking)",
        },
        overwrite: {
          type: "boolean",
          description: "Overwrite without version check",
        },
      },
      required: ["uid", "title"],
    },
  },
  {
    name: "delete_folder",
    description: "Delete a folder by its UID. Also deletes all dashboards in the folder.",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Folder UID to delete" },
        forceDeleteRules: {
          type: "boolean",
          description: "Also delete alert rules in the folder",
        },
      },
      required: ["uid"],
    },
  },
];

export async function handleFolderTool(
  client: GrafanaClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_folders": {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (args.limit) params.limit = args.limit as number;
      if (args.page) params.page = args.page as number;
      return client.get("/folders", params);
    }

    case "get_folder":
      return client.get(`/folders/${args.uid}`);

    case "create_folder": {
      const body: Record<string, unknown> = { title: args.title };
      if (args.uid) body.uid = args.uid;
      return client.post("/folders", body);
    }

    case "update_folder": {
      const body: Record<string, unknown> = { title: args.title };
      if (args.version !== undefined) body.version = args.version;
      if (args.overwrite !== undefined) body.overwrite = args.overwrite;
      return client.put(`/folders/${args.uid}`, body);
    }

    case "delete_folder": {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (args.forceDeleteRules)
        params.forceDeleteRules = args.forceDeleteRules as boolean;
      return client.request("DELETE", `/folders/${args.uid}`, undefined, params);
    }

    default:
      throw new Error(`Unknown folder tool: ${name}`);
  }
}
