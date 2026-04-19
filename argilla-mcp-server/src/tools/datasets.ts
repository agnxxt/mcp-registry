import type { ArgillaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_datasets",
    description:
      "List all datasets in Argilla. Returns dataset IDs, names, workspace info, status, and guidelines.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: ArgillaClient) => {
      return client.get("/datasets");
    },
  },
  {
    name: "get_dataset",
    description:
      "Get a single dataset by its ID. Returns full details including name, guidelines, workspace, status, fields, and questions.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The UUID of the dataset",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.get(`/datasets/${args.id}`);
    },
  },
  {
    name: "create_dataset",
    description:
      "Create a new dataset in Argilla. Requires name and workspace_id. Optionally provide guidelines, fields, and questions to define the annotation schema.",
    inputSchema: {
      type: "object",
      required: ["name", "workspace_id"],
      properties: {
        name: {
          type: "string",
          description: "Name of the dataset",
        },
        workspace_id: {
          type: "string",
          description: "UUID of the workspace to create the dataset in",
        },
        guidelines: {
          type: "string",
          description:
            "Annotation guidelines in markdown format for annotators",
        },
        fields: {
          type: "array",
          description:
            "Array of field definitions for records (e.g. text fields to annotate)",
          items: { type: "object" },
        },
        questions: {
          type: "array",
          description:
            "Array of question definitions for annotation (e.g. labels, ratings, text)",
          items: { type: "object" },
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      const body: Record<string, unknown> = {
        name: args.name,
        workspace_id: args.workspace_id,
      };
      if (args.guidelines !== undefined) body.guidelines = args.guidelines;
      if (args.fields !== undefined) body.fields = args.fields;
      if (args.questions !== undefined) body.questions = args.questions;
      return client.post("/datasets", body);
    },
  },
  {
    name: "delete_dataset",
    description:
      "Delete a dataset by its ID. This permanently removes the dataset and all its records.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The UUID of the dataset to delete",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.delete(`/datasets/${args.id}`);
    },
  },
  {
    name: "publish_dataset",
    description:
      "Publish a dataset to make it available for annotation. Once published, the schema (fields/questions) cannot be changed.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The UUID of the dataset to publish",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.put(`/datasets/${args.id}/publish`);
    },
  },
  {
    name: "list_dataset_fields",
    description:
      "List all fields defined for a dataset. Fields describe the data columns in records (e.g. text, image).",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The UUID of the dataset",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.get(`/datasets/${args.id}/fields`);
    },
  },
  {
    name: "list_dataset_questions",
    description:
      "List all questions defined for a dataset. Questions define the annotation tasks (labels, ratings, text responses).",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          description: "The UUID of the dataset",
        },
      },
    },
    handler: async (client: ArgillaClient, args: Record<string, unknown>) => {
      return client.get(`/datasets/${args.id}/questions`);
    },
  },
];
