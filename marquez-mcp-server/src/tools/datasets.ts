import type { Tool } from "../types.js";

export const datasetsTools: Tool[] = [
  {
    name: "list_datasets",
    description: "List all datasets in a namespace",
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
      return client.request("GET", `/namespaces/${namespace}/datasets`);
    },
  },
  {
    name: "get_dataset",
    description: "Get details of a specific dataset",
    inputSchema: {
      type: "object",
      properties: {
        namespace: {
          type: "string",
          description: "Namespace name",
        },
        name: {
          type: "string",
          description: "Dataset name",
        },
      },
      required: ["namespace", "name"],
    },
    handler: async (client, args) => {
      const { namespace, name } = args as { namespace: string; name: string };
      return client.request("GET", `/namespaces/${namespace}/datasets/${name}`);
    },
  },
];
