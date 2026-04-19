import type { Tool } from "../types.js";

export const jobsTools: Tool[] = [
  {
    name: "list_jobs",
    description: "List all jobs in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: {
          type: "string",
          description: "Namespace name",
        },
      },
      required: ["namespace"],
    },
    handler: async (client, args) => {
      const { namespace } = args as { namespace: string };
      return client.request("GET", `/namespaces/${namespace}/jobs`);
    },
  },
  {
    name: "get_job",
    description: "Get details of a specific job",
    inputSchema: {
      type: "object",
      properties: {
        namespace: {
          type: "string",
          description: "Namespace name",
        },
        name: {
          type: "string",
          description: "Job name",
        },
      },
      required: ["namespace", "name"],
    },
    handler: async (client, args) => {
      const { namespace, name } = args as { namespace: string; name: string };
      return client.request("GET", `/namespaces/${namespace}/jobs/${name}`);
    },
  },
];
