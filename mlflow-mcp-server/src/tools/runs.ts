import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MLflowClient } from "../client.js";

export const runTools: Tool[] = [
  {
    name: "mlflow_create_run",
    description: "Create a new MLflow run within an experiment",
    inputSchema: {
      type: "object" as const,
      properties: {
        experiment_id: {
          type: "string",
          description: "ID of the experiment to create the run in",
        },
        run_name: {
          type: "string",
          description: "Human-readable name for the run",
        },
        tags: {
          type: "array",
          description: "Array of tag objects with key and value",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" },
            },
          },
        },
      },
      required: ["experiment_id"],
    },
  },
  {
    name: "mlflow_get_run",
    description: "Get details of a specific MLflow run by run ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        run_id: {
          type: "string",
          description: "The run ID to retrieve",
        },
      },
      required: ["run_id"],
    },
  },
  {
    name: "mlflow_update_run",
    description: "Update an MLflow run status and/or end time",
    inputSchema: {
      type: "object" as const,
      properties: {
        run_id: {
          type: "string",
          description: "The run ID to update",
        },
        status: {
          type: "string",
          enum: ["RUNNING", "SCHEDULED", "FINISHED", "FAILED", "KILLED"],
          description: "New status for the run",
        },
        end_time: {
          type: "number",
          description: "Unix timestamp in milliseconds for the run end time",
        },
      },
      required: ["run_id"],
    },
  },
  {
    name: "mlflow_delete_run",
    description: "Delete an MLflow run by run ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        run_id: {
          type: "string",
          description: "The run ID to delete",
        },
      },
      required: ["run_id"],
    },
  },
  {
    name: "mlflow_search_runs",
    description: "Search for MLflow runs across experiments with filters and ordering",
    inputSchema: {
      type: "object" as const,
      properties: {
        experiment_ids: {
          type: "array",
          description: "List of experiment IDs to search",
          items: { type: "string" },
        },
        filter: {
          type: "string",
          description: "SQL-like filter string, e.g. \"metrics.rmse < 1 AND params.model = 'tree'\"",
        },
        order_by: {
          type: "array",
          description: "List of order-by clauses, e.g. [\"metrics.rmse ASC\"]",
          items: { type: "string" },
        },
        max_results: {
          type: "number",
          description: "Maximum number of runs to return",
        },
      },
      required: ["experiment_ids"],
    },
  },
  {
    name: "mlflow_log_metric",
    description: "Log a metric value for a specific MLflow run",
    inputSchema: {
      type: "object" as const,
      properties: {
        run_id: {
          type: "string",
          description: "The run ID to log the metric for",
        },
        key: {
          type: "string",
          description: "Name of the metric",
        },
        value: {
          type: "number",
          description: "Value of the metric",
        },
        timestamp: {
          type: "number",
          description: "Unix timestamp in milliseconds when the metric was recorded",
        },
      },
      required: ["run_id", "key", "value"],
    },
  },
  {
    name: "mlflow_log_param",
    description: "Log a parameter key-value pair for a specific MLflow run",
    inputSchema: {
      type: "object" as const,
      properties: {
        run_id: {
          type: "string",
          description: "The run ID to log the parameter for",
        },
        key: {
          type: "string",
          description: "Name of the parameter",
        },
        value: {
          type: "string",
          description: "Value of the parameter",
        },
      },
      required: ["run_id", "key", "value"],
    },
  },
  {
    name: "mlflow_log_batch",
    description: "Log a batch of metrics, params, and tags for a specific MLflow run",
    inputSchema: {
      type: "object" as const,
      properties: {
        run_id: {
          type: "string",
          description: "The run ID to log the batch for",
        },
        metrics: {
          type: "array",
          description: "Array of metric objects with key, value, timestamp, step",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "number" },
              timestamp: { type: "number" },
              step: { type: "number" },
            },
          },
        },
        params: {
          type: "array",
          description: "Array of param objects with key and value",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" },
            },
          },
        },
        tags: {
          type: "array",
          description: "Array of tag objects with key and value",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" },
            },
          },
        },
      },
      required: ["run_id"],
    },
  },
];

export async function handleRunTool(
  client: MLflowClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "mlflow_create_run": {
      const body: Record<string, unknown> = {
        experiment_id: args.experiment_id,
      };
      if (args.run_name) body.run_name = args.run_name;
      if (args.tags) body.tags = args.tags;
      return client.post("/runs/create", body);
    }

    case "mlflow_get_run":
      return client.get("/runs/get", { run_id: args.run_id as string });

    case "mlflow_update_run": {
      const body: Record<string, unknown> = { run_id: args.run_id };
      if (args.status) body.status = args.status;
      if (args.end_time !== undefined) body.end_time = args.end_time;
      return client.post("/runs/update", body);
    }

    case "mlflow_delete_run":
      return client.post("/runs/delete", { run_id: args.run_id });

    case "mlflow_search_runs": {
      const body: Record<string, unknown> = {
        experiment_ids: args.experiment_ids,
      };
      if (args.filter) body.filter = args.filter;
      if (args.order_by) body.order_by = args.order_by;
      if (args.max_results !== undefined) body.max_results = args.max_results;
      return client.post("/runs/search", body);
    }

    case "mlflow_log_metric": {
      const body: Record<string, unknown> = {
        run_id: args.run_id,
        key: args.key,
        value: args.value,
      };
      if (args.timestamp !== undefined) body.timestamp = args.timestamp;
      return client.post("/runs/log-metric", body);
    }

    case "mlflow_log_param":
      return client.post("/runs/log-parameter", {
        run_id: args.run_id,
        key: args.key,
        value: args.value,
      });

    case "mlflow_log_batch": {
      const body: Record<string, unknown> = { run_id: args.run_id };
      if (args.metrics) body.metrics = args.metrics;
      if (args.params) body.params = args.params;
      if (args.tags) body.tags = args.tags;
      return client.post("/runs/log-batch", body);
    }

    default:
      throw new Error(`Unknown run tool: ${name}`);
  }
}
