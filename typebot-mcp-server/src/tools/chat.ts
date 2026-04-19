import type { TypebotClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "start_chat",
    description: "Start a new chat session with a published typebot.",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string" },
        prefilledVariables: { type: "object", description: "Variables to prefill" },
      },
    },
    handler: async (client, args) => {
      const { typebotId, ...body } = args;
      return client.post(`/typebots/${typebotId}/startChat`, Object.keys(body).length > 0 ? body : undefined);
    },
  },
  {
    name: "continue_chat",
    description: "Continue an existing chat session with a message.",
    inputSchema: {
      type: "object",
      required: ["sessionId", "message"],
      properties: {
        sessionId: { type: "string", description: "Chat session ID" },
        message: { type: "string", description: "User message" },
      },
    },
    handler: async (client, args) =>
      client.post(`/sessions/${args.sessionId}/continueChat`, { message: args.message }),
  },
  {
    name: "preview_chat",
    description: "Start a preview chat session (for unpublished typebots).",
    inputSchema: {
      type: "object",
      required: ["typebotId"],
      properties: {
        typebotId: { type: "string" },
        prefilledVariables: { type: "object" },
      },
    },
    handler: async (client, args) => {
      const { typebotId, ...body } = args;
      return client.post(`/typebots/${typebotId}/preview/startChat`, Object.keys(body).length > 0 ? body : undefined);
    },
  },
];
