import type { CamundaClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "camunda_search_jobs",
    description: "Search for jobs with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria for jobs" },
        sort: { type: "array", description: "Sort criteria" },
        page: { type: "object", description: "Pagination with from and limit" },
      },
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/jobs/search", args);
    },
  },
  {
    name: "camunda_activate_jobs",
    description: "Activate jobs of a specific type",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Job type to activate" },
        worker: { type: "string", description: "Worker name" },
        timeout: { type: "number", description: "Timeout in milliseconds" },
        maxJobsToActivate: { type: "number", description: "Maximum number of jobs to activate" },
      },
      required: ["type", "worker", "timeout", "maxJobsToActivate"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      return client.post("/jobs/activation", args);
    },
  },
  {
    name: "camunda_complete_job",
    description: "Complete a job by its key",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Job key" },
        variables: { type: "object", description: "Variables to set on completion" },
      },
      required: ["key"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      const { key, ...body } = args;
      return client.post(`/jobs/${key}/completion`, body);
    },
  },
  {
    name: "camunda_fail_job",
    description: "Report a job failure",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Job key" },
        retries: { type: "number", description: "Remaining retries" },
        errorMessage: { type: "string", description: "Error message" },
        retryBackOff: { type: "number", description: "Retry back off in milliseconds" },
      },
      required: ["key", "retries"],
    },
    handler: async (client: CamundaClient, args: Record<string, unknown>) => {
      const { key, ...body } = args;
      return client.post(`/jobs/${key}/failure`, body);
    },
  },
];
