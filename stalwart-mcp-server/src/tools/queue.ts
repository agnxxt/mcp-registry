import type { StalwartClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_queue_messages",
    description: "List messages in the mail queue.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: StalwartClient) => {
      return client.get("/queue/messages");
    },
  },
  {
    name: "get_queue_message",
    description: "Get details of a specific queued message by ID.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Queue message ID" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      return client.get(`/queue/messages/${args.id}`);
    },
  },
  {
    name: "delete_queue_message",
    description: "Delete a message from the mail queue.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Queue message ID to delete" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      return client.delete(`/queue/messages/${args.id}`);
    },
  },
  {
    name: "retry_queue_message",
    description: "Retry delivery of a queued message.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Queue message ID to retry" },
      },
    },
    handler: async (client: StalwartClient, args: Record<string, unknown>) => {
      return client.patch(`/queue/messages/${args.id}`);
    },
  },
  {
    name: "get_queue_reports",
    description: "Get delivery status notification (DSN) reports from the queue.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: StalwartClient) => {
      return client.get("/queue/reports");
    },
  },
];
