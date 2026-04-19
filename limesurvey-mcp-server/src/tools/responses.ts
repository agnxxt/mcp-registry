import type { LimeSurveyClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "export_responses",
    description:
      "Export survey responses in various formats. Returns base64-encoded data that can be decoded to the requested format.",
    inputSchema: {
      type: "object",
      required: ["surveyId"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        documentType: {
          type: "string",
          description:
            "Export format: 'csv', 'xls', 'pdf', 'json' (default: 'json')",
          enum: ["csv", "xls", "pdf", "json"],
        },
        languageCode: {
          type: "string",
          description: "Language code for the export (e.g. 'en'). Defaults to survey base language.",
        },
        completionStatus: {
          type: "string",
          description:
            "Filter by completion: 'complete', 'incomplete', 'all' (default: 'all')",
          enum: ["complete", "incomplete", "all"],
        },
        headingType: {
          type: "string",
          description:
            "Column heading type: 'code', 'full', 'abbreviated' (default: 'code')",
          enum: ["code", "full", "abbreviated"],
        },
        responseType: {
          type: "string",
          description:
            "Response format: 'short' (answer codes) or 'long' (full answer text). Default: 'short'",
          enum: ["short", "long"],
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const docType = args.documentType || "json";
      const lang = args.languageCode || null;
      const completion = args.completionStatus || "all";
      const heading = args.headingType || "code";
      const responseType = args.responseType || "short";
      return client.call(
        "export_responses",
        args.surveyId,
        docType,
        lang,
        completion,
        heading,
        responseType
      );
    },
  },
  {
    name: "get_summary",
    description:
      "Get summary statistics for a survey. Returns counts of completed, incomplete, and total responses.",
    inputSchema: {
      type: "object",
      required: ["surveyId"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        statName: {
          type: "string",
          description:
            "Statistic to retrieve: 'token_count', 'token_invalid', 'token_sent', 'token_opted_out', 'token_completed', 'completed_responses', 'incomplete_responses', 'full_responses' or 'all' (default: 'all')",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      const statName = args.statName || "all";
      return client.call("get_summary", args.surveyId, statName);
    },
  },
  {
    name: "add_response",
    description:
      "Add a single response to a survey. Provide response data as an object with question codes as keys.",
    inputSchema: {
      type: "object",
      required: ["surveyId", "responseData"],
      properties: {
        surveyId: {
          type: "number",
          description: "The survey ID",
        },
        responseData: {
          type: "object",
          description:
            "Response data object with question codes as keys and answers as values",
        },
      },
    },
    handler: async (
      client: LimeSurveyClient,
      args: Record<string, unknown>
    ) => {
      return client.call("add_response", args.surveyId, args.responseData);
    },
  },
];
