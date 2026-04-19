import type { LimeSurveyClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_participants",
    description:
      "List survey participants (token table entries). Returns participant tokens, names, emails, and completion status.",
    inputSchema: {
      type: "object",
      required: ["surveyId"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        start: {
          type: "number",
          description: "Start index for pagination (default: 0)",
        },
        limit: {
          type: "number",
          description: "Maximum number of participants to return (default: 100)",
        },
        unused: {
          type: "boolean",
          description: "If true, only return unused tokens",
        },
        attributes: {
          type: "array",
          description: "Array of extra attribute field names to include",
          items: { type: "string" },
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const start = args.start !== undefined ? args.start : 0;
      const limit = args.limit !== undefined ? args.limit : 100;
      const unused = args.unused !== undefined ? args.unused : false;
      const attributes = args.attributes || [];
      return client.call(
        "list_participants",
        args.surveyId,
        start,
        limit,
        unused,
        attributes
      );
    },
  },
  {
    name: "add_participants",
    description:
      "Add participants to a survey's token table. Each participant needs at minimum a firstname, lastname, and email.",
    inputSchema: {
      type: "object",
      required: ["surveyId", "participantData"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        participantData: {
          type: "array",
          description:
            "Array of participant objects with fields: firstname, lastname, email, and optionally token, language, validfrom, validuntil",
          items: { type: "object" },
        },
        createTokenKey: {
          type: "boolean",
          description:
            "If true, auto-generate token keys for participants (default: true)",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const createToken =
        args.createTokenKey !== undefined ? args.createTokenKey : true;
      return client.call(
        "add_participants",
        args.surveyId,
        args.participantData,
        createToken
      );
    },
  },
  {
    name: "get_response_ids",
    description:
      "Get response IDs for a specific participant token. Useful to check if a participant has already responded.",
    inputSchema: {
      type: "object",
      required: ["surveyId", "token"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        token: {
          type: "string",
          description: "The participant token string",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      return client.call("get_response_ids", args.surveyId, args.token);
    },
  },
];
