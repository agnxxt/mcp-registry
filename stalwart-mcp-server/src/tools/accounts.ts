import type { StalwartClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_accounts",
    description: "List all mail accounts on the Stalwart server.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: StalwartClient) => {
      return client.get("/account");
    },
  },
  {
    name: "get_account",
    description: "Get details of a specific mail account by name.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Account name" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      return client.get(`/account/${args.name}`);
    },
  },
  {
    name: "create_account",
    description: "Create a new mail account.",
    inputSchema: {
      type: "object",
      required: ["name", "type", "secrets", "emails"],
      properties: {
        name: { type: "string", description: "Account name / username" },
        type: { type: "string", description: "Account type (e.g. individual, group)" },
        secrets: {
          type: "array",
          items: { type: "string" },
          description: "Array of secrets/passwords for the account",
        },
        emails: {
          type: "array",
          items: { type: "string" },
          description: "Array of email addresses for the account",
        },
        description: { type: "string", description: "Optional account description" },
        quota: { type: "number", description: "Optional storage quota in bytes" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = {
        name: args.name,
        type: args.type,
        secrets: args.secrets,
        emails: args.emails,
      };
      if (args.description) body.description = args.description;
      if (args.quota !== undefined) body.quota = args.quota;
      return client.post("/account", body);
    },
  },
  {
    name: "update_account",
    description: "Update an existing mail account.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Account name to update" },
        type: { type: "string", description: "Account type" },
        secrets: {
          type: "array",
          items: { type: "string" },
          description: "Updated secrets/passwords",
        },
        emails: {
          type: "array",
          items: { type: "string" },
          description: "Updated email addresses",
        },
        description: { type: "string", description: "Updated description" },
        quota: { type: "number", description: "Updated storage quota in bytes" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      const name = args.name;
      const body: Record<string, unknown> = {};
      if (args.type) body.type = args.type;
      if (args.secrets) body.secrets = args.secrets;
      if (args.emails) body.emails = args.emails;
      if (args.description) body.description = args.description;
      if (args.quota !== undefined) body.quota = args.quota;
      return client.put(`/account/${name}`, body);
    },
  },
  {
    name: "delete_account",
    description: "Delete a mail account by name.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Account name to delete" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      return client.delete(`/account/${args.name}`);
    },
  },
];
