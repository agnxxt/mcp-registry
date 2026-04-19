import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { MLflowClient } from "../client.js";

export const artifactTools: Tool[] = [
  {
    name: "mlflow_list_artifacts",
    description: "List artifacts for a given MLflow run, optionally under a specific path",
    inputSchema: {
      type: "object" as const,
      properties: {
        run_id: {
          type: "string",
          description: "The run ID to list artifacts for",
        },
        path: {
          type: "string",
          description: "Optional relative path within the artifact directory",
        },
      },
      required: ["run_id"],
    },
  },
];

export async function handleArtifactTool(
  client: MLflowClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "mlflow_list_artifacts": {
      const params: Record<string, string | number | boolean | undefined> = {
        run_id: args.run_id as string,
      };
      if (args.path) params.path = args.path as string;
      return client.get("/artifacts/list", params);
    }

    default:
      throw new Error(`Unknown artifact tool: ${name}`);
  }
}
