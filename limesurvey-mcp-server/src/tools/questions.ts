import type { LimeSurveyClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_questions",
    description:
      "List all questions in a survey, optionally filtered by question group. Returns question IDs, titles, types, and group info.",
    inputSchema: {
      type: "object",
      required: ["surveyId"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        groupId: {
          type: "number",
          description:
            "Optional question group ID to filter by. If omitted, returns all questions.",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const groupId = args.groupId !== undefined ? args.groupId : null;
      return client.call("list_questions", args.surveyId, groupId);
    },
  },
  {
    name: "get_question_properties",
    description:
      "Get properties of a specific question by its ID. Optionally specify which properties to retrieve.",
    inputSchema: {
      type: "object",
      required: ["questionId"],
      properties: {
        questionId: {
          type: "number",
          description: "The question ID",
        },
        settings: {
          type: "array",
          description:
            "Array of property names to retrieve. If omitted, returns all properties.",
          items: { type: "string" },
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const settings = args.settings || null;
      return client.call("get_question_properties", args.questionId, settings);
    },
  },
  {
    name: "list_groups",
    description:
      "List all question groups in a survey. Returns group IDs, names, descriptions, and ordering.",
    inputSchema: {
      type: "object",
      required: ["surveyId"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      return client.call("list_groups", args.surveyId);
    },
  },
  {
    name: "add_group",
    description:
      "Add a new question group to a survey. Groups organize questions into sections.",
    inputSchema: {
      type: "object",
      required: ["surveyId", "groupTitle"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        groupTitle: {
          type: "string",
          description: "Title for the new question group",
        },
        groupDescription: {
          type: "string",
          description: "Optional description for the group",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const desc = args.groupDescription ? String(args.groupDescription) : "";
      return client.call("add_group", args.surveyId, args.groupTitle, desc);
    },
  },
];
