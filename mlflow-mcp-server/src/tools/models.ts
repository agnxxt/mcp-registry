import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MLflowClient } from "../client.js";

export const modelTools: Tool[] = [
  {
    name: "mlflow_list_registered_models",
    description: "List all registered models in the MLflow Model Registry",
    inputSchema: {
      type: "object" as const,
      properties: {
        max_results: {
          type: "number",
          description: "Maximum number of registered models to return",
        },
      },
    },
  },
  {
    name: "mlflow_get_registered_model",
    description: "Get details of a specific registered model by name",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Name of the registered model",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "mlflow_create_registered_model",
    description: "Create a new registered model in the Model Registry",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Name for the new registered model",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "mlflow_list_model_versions",
    description: "Search for model versions using a filter string",
    inputSchema: {
      type: "object" as const,
      properties: {
        filter: {
          type: "string",
          description: "Filter string, e.g. \"name='my-model'\"",
        },
      },
    },
  },
  {
    name: "mlflow_create_model_version",
    description: "Create a new version of a registered model",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Name of the registered model",
        },
        source: {
          type: "string",
          description: "URI of the model artifact (e.g. runs:/<run_id>/model)",
        },
        run_id: {
          type: "string",
          description: "Run ID that generated this model version",
        },
      },
      required: ["name", "source"],
    },
  },
  {
    name: "mlflow_transition_model_version_stage",
    description: "Transition a model version to a new stage (Staging, Production, Archived, None)",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Name of the registered model",
        },
        version: {
          type: "string",
          description: "Model version number",
        },
        stage: {
          type: "string",
          enum: ["None", "Staging", "Production", "Archived"],
          description: "Target stage for the model version",
        },
      },
      required: ["name", "version", "stage"],
    },
  },
];

export async function handleModelTool(
  client: MLflowClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "mlflow_list_registered_models": {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (args.max_results !== undefined) params.max_results = args.max_results as number;
      return client.get("/registered-models/search", params);
    }

    case "mlflow_get_registered_model":
      return client.get("/registered-models/get", {
        name: args.name as string,
      });

    case "mlflow_create_registered_model":
      return client.post("/registered-models/create", { name: args.name });

    case "mlflow_list_model_versions": {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (args.filter) params.filter = args.filter as string;
      return client.get("/model-versions/search", params);
    }

    case "mlflow_create_model_version": {
      const body: Record<string, unknown> = {
        name: args.name,
        source: args.source,
      };
      if (args.run_id) body.run_id = args.run_id;
      return client.post("/model-versions/create", body);
    }

    case "mlflow_transition_model_version_stage":
      return client.post("/model-versions/transition-stage", {
        name: args.name,
        version: args.version,
        stage: args.stage,
      });

    default:
      throw new Error(`Unknown model tool: ${name}`);
  }
}
