import type { MauticClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_forms",
    description: "List all forms in Mautic.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search string to filter forms",
        },
        start: {
          type: "number",
          description: "Starting row index for pagination (default 0)",
        },
        limit: {
          type: "number",
          description: "Number of forms to return (default 30)",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.search) params.search = String(args.search);
      if (args.start !== undefined) params.start = String(args.start);
      if (args.limit !== undefined) params.limit = String(args.limit);
      return client.get("/forms", params);
    },
  },
  {
    name: "get_form",
    description: "Get a single form by ID, including its fields and actions.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Form ID" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.get(`/forms/${args.id}`),
  },
  {
    name: "get_form_submissions",
    description:
      "Get all submissions for a form. Returns submitted data with timestamps and contact info.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Form ID" },
        start: {
          type: "number",
          description: "Starting row index for pagination (default 0)",
        },
        limit: {
          type: "number",
          description: "Number of submissions to return (default 30)",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.start !== undefined) params.start = String(args.start);
      if (args.limit !== undefined) params.limit = String(args.limit);
      return client.get(`/forms/${args.id}/submissions`, params);
    },
  },
  {
    name: "delete_form",
    description: "Delete a form by ID. This action is irreversible.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Form ID" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.delete(`/forms/${args.id}/delete`),
  },
];
