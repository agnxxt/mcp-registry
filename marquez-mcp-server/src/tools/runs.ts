import type { Tool } from "../types.js";

export const runsTools: Tool[] = [
  {
    name: "list_runs",
    description: "List all runs for a specific job",
    inputSchema: {
      type: "object",
      properties: {
        namespace: {
          type: "string",
          description: "Namespace name",
        },
        job: {
          type: "string",
          description: "Job name",
        },
      },
      required: ["namespace", "job"],
    },
    handler: async (client, args) => {
      const { namespace, job } = args as { namespace: string; job: string };
      return client.request("GET", `/namespaces/${namespace}/jobs/${job}/runs`);
    },
  },
  {
    name: "get_run",
    description: "Get details of a specific run by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Run ID (UUID)",
        },
      },
      required: ["id"],
    },
    handler: async (client, args) => {
      const { id } = args as { id: string };
      return client.request("GET", `/runs/${id}`);
    },
  },
  {
    name: "create_run",
    description: "Create a new run for a job",
    inputSchema: {
      type: "object",
      properties: {
        namespace: {
          type: "string",
          description: "Namespace name",
        },
        job: {
          type: "string",
          description: "Job name",
        },
        nominalStartTime: {
          type: "string",
          description: "Nominal start time (ISO 8601)",
        },
        nominalEndTime: {
          type: "string",
          description: "Nominal end time (ISO 8601)",
        },
        args: {
          type: "object",
          description: "Run arguments as key-value pairs",
        },
      },
      required: ["namespace", "job"],
    },
    handler: async (client, args) => {
      const { namespace, job, nominalStartTime, nominalEndTime, args: runArgs } = args as {
        namespace: string;
        job: string;
        nominalStartTime?: string;
        nominalEndTime?: string;
        args?: object;
      };
      const body: Record<string, unknown> = {};
      if (nominalStartTime !== undefined) body.nominalStartTime = nominalStartTime;
      if (nominalEndTime !== undefined) body.nominalEndTime = nominalEndTime;
      if (runArgs !== undefined) body.args = runArgs;
      return client.request("POST", `/namespaces/${namespace}/jobs/${job}/runs`, body);
    },
  },
];
