import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MLflowClient } from "../client.js";

export const experimentTools: Tool[] = [
  {
    name: "mlflow_search_experiments",
    description: "Search for MLflow experiments with pagination",
    inputSchema: {
      type: "object" as const,
      properties: {
        max_results: {
          type: "number",
          description: "Maximum number of experiments to return",
        },
        page_token: {
          type: "string",
          description: "Pagination token from a previous response",
        },
      },
    },
  },
  {
    name: "mlflow_get_experiment",
    description: "Get details of a specific MLflow experiment by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        experiment_id: {
          type: "string",
          description: "The experiment ID to retrieve",
        },
      },
      required: ["experiment_id"],
    },
  },
  {
    name: "mlflow_create_experiment",
    description: "Create a new MLflow experiment with a given name and optional artifact location",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Name of the experiment to create",
        },
        artifact_location: {
          type: "string",
          description: "Optional base artifact location for the experiment",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "mlflow_update_experiment",
    description: "Update an existing MLflow experiment (rename)",
    inputSchema: {
      type: "object" as const,
      properties: {
        experiment_id: {
          type: "string",
          description: "The experiment ID to update",
        },
        new_name: {
          type: "string",
          description: "New name for the experiment",
        },
      },
      required: ["experiment_id", "new_name"],
    },
  },
  {
    name: "mlflow_delete_experiment",
    description: "Delete an MLflow experiment by ID (marks as deleted)",
    inputSchema: {
      type: "object" as const,
      properties: {
        experiment_id: {
          type: "string",
          description: "The experiment ID to delete",
        },
      },
      required: ["experiment_id"],
    },
  },
];

export async function handleExperimentTool(
  client: MLflowClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "mlflow_search_experiments": {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (args.max_results !== undefined) params.max_results = args.max_results as number;
      if (args.page_token) params.page_token = args.page_token as string;
      return client.get("/experiments/search", params);
    }

    case "mlflow_get_experiment":
      return client.get("/experiments/get", {
        experiment_id: args.experiment_id as string,
      });

    case "mlflow_create_experiment": {
      const body: Record<string, unknown> = { name: args.name };
      if (args.artifact_location) body.artifact_location = args.artifact_location;
      return client.post("/experiments/create", body);
    }

    case "mlflow_update_experiment":
      return client.post("/experiments/update", {
        experiment_id: args.experiment_id,
        new_name: args.new_name,
      });

    case "mlflow_delete_experiment":
      return client.post("/experiments/delete", {
        experiment_id: args.experiment_id,
      });

    default:
      throw new Error(`Unknown experiment tool: ${name}`);
  }
}
