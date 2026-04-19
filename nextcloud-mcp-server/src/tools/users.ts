import type { NextcloudClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_users",
    description:
      "List all users on the Nextcloud instance. Returns an array of user IDs.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Filter users by search string",
        },
        limit: {
          type: "number",
          description: "Maximum number of users to return",
        },
        offset: {
          type: "number",
          description: "Offset for pagination",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      let path = "/ocs/v1.php/cloud/users?format=json";
      if (args.search) path += `&search=${encodeURIComponent(String(args.search))}`;
      if (args.limit !== undefined) path += `&limit=${args.limit}`;
      if (args.offset !== undefined) path += `&offset=${args.offset}`;
      return client.ocs(path);
    },
  },
  {
    name: "get_user",
    description:
      "Get details of a specific Nextcloud user by their user ID. Returns email, display name, quota, groups, and more.",
    inputSchema: {
      type: "object",
      required: ["userId"],
      properties: {
        userId: {
          type: "string",
          description: "The user ID to look up",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      return client.ocs(
        `/ocs/v1.php/cloud/users/${encodeURIComponent(String(args.userId))}?format=json`
      );
    },
  },
  {
    name: "create_user",
    description:
      "Create a new user on the Nextcloud instance. Requires userid and password, optionally email.",
    inputSchema: {
      type: "object",
      required: ["userid", "password"],
      properties: {
        userid: {
          type: "string",
          description: "User ID for the new user",
        },
        password: {
          type: "string",
          description: "Password for the new user",
        },
        email: {
          type: "string",
          description: "Email address for the new user",
        },
        displayName: {
          type: "string",
          description: "Display name for the new user",
        },
        groups: {
          type: "array",
          description: "Groups to add the user to",
          items: { type: "string" },
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      const body: Record<string, unknown> = {
        userid: args.userid,
        password: args.password,
      };
      if (args.email !== undefined) body.email = args.email;
      if (args.displayName !== undefined) body.displayName = args.displayName;
      if (args.groups !== undefined) body.groups = args.groups;
      return client.ocs(
        "/ocs/v1.php/cloud/users?format=json",
        "POST",
        body
      );
    },
  },
  {
    name: "list_groups",
    description:
      "List all groups on the Nextcloud instance.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Filter groups by search string",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      let path = "/ocs/v1.php/cloud/groups?format=json";
      if (args.search) path += `&search=${encodeURIComponent(String(args.search))}`;
      return client.ocs(path);
    },
  },
];
