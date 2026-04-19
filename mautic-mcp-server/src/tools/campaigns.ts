import type { MauticClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_campaigns",
    description: "List all campaigns in Mautic.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search string to filter campaigns",
        },
        start: {
          type: "number",
          description: "Starting row index for pagination (default 0)",
        },
        limit: {
          type: "number",
          description: "Number of campaigns to return (default 30)",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const params: Record<string, string> = {};
      if (args.search) params.search = String(args.search);
      if (args.start !== undefined) params.start = String(args.start);
      if (args.limit !== undefined) params.limit = String(args.limit);
      return client.get("/campaigns", params);
    },
  },
  {
    name: "get_campaign",
    description:
      "Get a single campaign by ID, including events, contacts, and statistics.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", description: "Campaign ID" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.get(`/campaigns/${args.id}`),
  },
  {
    name: "create_campaign",
    description: "Create a new campaign in Mautic.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Campaign name" },
        description: { type: "string", description: "Campaign description" },
        isPublished: {
          type: "boolean",
          description: "Whether the campaign is published (default true)",
        },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = { name: args.name };
      if (args.description !== undefined) body.description = args.description;
      if (args.isPublished !== undefined) body.isPublished = args.isPublished;
      return client.post("/campaigns/new", body);
    },
  },
  {
    name: "add_contact_to_campaign",
    description: "Add a contact to a campaign.",
    inputSchema: {
      type: "object",
      required: ["id", "contactId"],
      properties: {
        id: { type: "number", description: "Campaign ID" },
        contactId: { type: "number", description: "Contact ID to add" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.post(`/campaigns/${args.id}/contact/${args.contactId}/add`),
  },
  {
    name: "remove_contact_from_campaign",
    description: "Remove a contact from a campaign.",
    inputSchema: {
      type: "object",
      required: ["id", "contactId"],
      properties: {
        id: { type: "number", description: "Campaign ID" },
        contactId: { type: "number", description: "Contact ID to remove" },
      },
    },
    handler: async (client: MauticClient, args: Record<string, unknown>) =>
      client.post(`/campaigns/${args.id}/contact/${args.contactId}/remove`),
  },
];
