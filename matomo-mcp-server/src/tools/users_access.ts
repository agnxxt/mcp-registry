import type { MatomoClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_users",
    description:
      "List all users in Matomo with their login, email, date registered, and super user status.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: MatomoClient, _args: Record<string, unknown>) => {
      return client.call("UsersManager.getUsers");
    },
  },
  {
    name: "get_user",
    description:
      "Get details of a specific user by login name including email, alias, date registered, and token count.",
    inputSchema: {
      type: "object",
      required: ["userLogin"],
      properties: {
        userLogin: {
          type: "string",
          description: "The user login name",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("UsersManager.getUser", {
        userLogin: args.userLogin,
      });
    },
  },
  {
    name: "add_user",
    description:
      "Create a new user in Matomo with login, password, and email. The user will have no site access until explicitly granted.",
    inputSchema: {
      type: "object",
      required: ["userLogin", "password", "email"],
      properties: {
        userLogin: {
          type: "string",
          description: "Login name for the new user",
        },
        password: {
          type: "string",
          description: "Password for the new user",
        },
        email: {
          type: "string",
          description: "Email address for the new user",
        },
        alias: {
          type: "string",
          description: "Display name / alias for the user",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      const params: Record<string, any> = {
        userLogin: args.userLogin,
        password: args.password,
        email: args.email,
      };
      if (args.alias !== undefined) params.alias = args.alias;
      return client.call("UsersManager.addUser", params);
    },
  },
  {
    name: "set_user_access",
    description:
      "Set a user's access level for one or more sites. Access levels: noaccess, view, write, admin, superuser.",
    inputSchema: {
      type: "object",
      required: ["userLogin", "access", "idSites"],
      properties: {
        userLogin: {
          type: "string",
          description: "The user login name",
        },
        access: {
          type: "string",
          description: "Access level to grant",
          enum: ["noaccess", "view", "write", "admin", "superuser"],
        },
        idSites: {
          type: "string",
          description:
            "Comma-separated site IDs to grant access to, or 'all' for all sites",
        },
      },
    },
    handler: async (client: MatomoClient, args: Record<string, unknown>) => {
      return client.call("UsersManager.setUserAccess", {
        userLogin: args.userLogin,
        access: args.access,
        idSites: args.idSites,
      });
    },
  },
];
