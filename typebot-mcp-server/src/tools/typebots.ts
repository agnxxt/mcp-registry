import type { TypebotClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_typebots",
    description: "List all typebots in the workspace.",
    inputSchema: {
      type: "object",
      properties: {
        workspaceId: { type: "string", description: "Workspace ID to filter by" },
        folderId: { type: "string", description: "Folder ID to filter by" },
      },
    },
    handler: async (client, args) => {
      const params: Record<string, string> = {};
      if (args.workspaceId) params.workspaceId = args.workspaceId as string;
      if (args.folderId) params.folderId = args.folderId as string;
      return client.get("/typebots", params);
    },
  },
  {
    name: "get_typebot",
    description: "Get a typebot by ID.",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string", description: "Typebot ID" },
      },
    },
    handler: async (client, args) =>
      client.get(`/typebots/${args.typebotId}`),
  },
  {
    name: "create_typebot",
    description: "Create a new typebot.",
    inputSchema: {
      type: "object",
      required: ["workspaceId"],
      properties: {
        workspaceId: { type: "string" },
        name: { type: "string" },
        folderId: { type: "string" },
      },
    },
    handler: async (client, args) => {
      const { ...body } = args;
      return client.post("/typebots", body);
    },
  },
  {
    name: "update_typebot",
    description: "Update an existing typebot.",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string" },
        name: { type: "string" },
        theme: { type: "object", description: "Theme configuration" },
        settings: { type: "object", description: "Settings object" },
      },
    },
    handler: async (client, args) => {
      const { typebotId, ...body } = args;
      return client.patch(`/typebots/${typebotId}`, body);
    },
  },
  {
    name: "delete_typebot",
    description: "Delete a typebot.",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string" },
      },
    },
    handler: async (client, args) =>
      client.delete(`/typebots/${args.typebotId}`),
  },
  {
    name: "publish_typebot",
    description: "Publish a typebot to make it live.",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string" },
      },
    },
    handler: async (client, args) =>
      client.post(`/typebots/${args.typebotId}/publish`),
  },
  {
    name: "unpublish_typebot",
    description: "Unpublish a typebot.",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string" },
      },
    },
    handler: async (client, args) =>
      client.post(`/typebots/${args.typebotId}/unpublish`),
  },
];
