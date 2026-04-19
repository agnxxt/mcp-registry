import type { NextcloudClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_shares",
    description:
      "List all file shares in Nextcloud. Returns share details including path, type, permissions, and share links.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: NextcloudClient) => {
      return client.ocs(
        "/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json"
      );
    },
  },
  {
    name: "create_share",
    description:
      "Create a new file share in Nextcloud. Specify the path, share type (0=user, 1=group, 3=public link), and permissions.",
    inputSchema: {
      type: "object",
      required: ["path", "shareType"],
      properties: {
        path: {
          type: "string",
          description: "Path of the file/folder to share",
        },
        shareType: {
          type: "number",
          description:
            "Share type: 0=user, 1=group, 3=public link, 4=email, 6=federated cloud",
        },
        shareWith: {
          type: "string",
          description:
            "User/group ID to share with (required for types 0, 1, 4, 6)",
        },
        permissions: {
          type: "number",
          description:
            "Permission bitmask: 1=read, 2=update, 4=create, 8=delete, 16=share, 31=all",
        },
        password: {
          type: "string",
          description: "Password to protect the share (public links)",
        },
        expireDate: {
          type: "string",
          description: "Expiration date in YYYY-MM-DD format",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      const body: Record<string, unknown> = {
        path: args.path,
        shareType: args.shareType,
      };
      if (args.shareWith !== undefined) body.shareWith = args.shareWith;
      if (args.permissions !== undefined) body.permissions = args.permissions;
      if (args.password !== undefined) body.password = args.password;
      if (args.expireDate !== undefined) body.expireDate = args.expireDate;
      return client.ocs(
        "/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json",
        "POST",
        body
      );
    },
  },
  {
    name: "delete_share",
    description: "Delete (unshare) a file share by its share ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The share ID to delete",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      return client.ocs(
        `/ocs/v2.php/apps/files_sharing/api/v1/shares/${args.id}?format=json`,
        "DELETE"
      );
    },
  },
];
