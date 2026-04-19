import type { LimeSurveyClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_surveys",
    description:
      "List all surveys accessible by the authenticated user. Returns survey IDs, titles, status, and language.",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description:
            "Optional username to filter surveys by owner. Defaults to current user if omitted.",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const user = args.username ? String(args.username) : null;
      return client.call("list_surveys", user);
    },
  },
  {
    name: "get_survey_properties",
    description:
      "Get properties of a survey by ID. Optionally specify which properties to retrieve.",
    inputSchema: {
      type: "object",
      required: ["surveyId"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        settings: {
          type: "array",
          description:
            "Array of property names to retrieve (e.g. ['sid', 'surveyls_title', 'active']). If omitted, returns all.",
          items: { type: "string" },
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const settings = args.settings || null;
      return client.call("get_survey_properties", args.surveyId, settings);
    },
  },
  {
    name: "add_survey",
    description:
      "Create a new survey. Provide a survey ID (use 0 for auto), title, language code, and format.",
    inputSchema: {
      type: "object",
      required: ["surveyId", "title", "language", "format"],
      properties: {
        surveyId: {
          type: "number",
          description: "Desired survey ID (use 0 for auto-generated ID)",
        },
        title: {
          type: "string",
          description: "Title of the survey",
        },
        language: {
          type: "string",
          description: "Base language code (e.g. 'en', 'de', 'fr')",
        },
        format: {
          type: "string",
          description:
            "Survey format: 'G' (group by group), 'S' (question by question), 'A' (all in one)",
          enum: ["G", "S", "A"],
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      return client.call(
        "add_survey",
        args.surveyId,
        args.title,
        args.language,
        args.format
      );
    },
  },
  {
    name: "delete_survey",
    description: "Delete a survey by its ID. This permanently removes the survey and all its data.",
    inputSchema: {
      type: "object",
      required: ["surveyId"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID to delete",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      return client.call("delete_survey", args.surveyId);
    },
  },
  {
    name: "activate_survey",
    description:
      "Activate a survey to start collecting responses. The survey must have at least one question group and one question.",
    inputSchema: {
      type: "object",
      required: ["surveyId"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID to activate",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      return client.call("activate_survey", args.surveyId);
    },
  },
  {
    name: "set_survey_properties",
    description:
      "Update properties of a survey. Provide a settings object with property names and new values.",
    inputSchema: {
      type: "object",
      required: ["surveyId", "settings"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        settings: {
          type: "object",
          description:
            "Object of property names and values to set (e.g. { surveyls_title: 'New Title', active: 'Y' })",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      return client.call("set_survey_properties", args.surveyId, args.settings);
    },
  },
];
