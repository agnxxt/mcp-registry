import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { OPAClient } from "../client.js";

export const dataTools: Tool[] = [
  {
    name: "opa_get_data",
    description: "Get a data document from OPA at the specified path",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            "The data path (e.g. 'servers', 'users/admin'). Omit for root document.",
        },
      },
    },
  },
  {
    name: "opa_create_data",
    description: "Create or overwrite a data document in OPA at the specified path",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "The data path to create/overwrite",
        },
        data: {
          type: "object",
          description: "The JSON data to store at the path",
        },
      },
      required: ["path", "data"],
    },
  },
  {
    name: "opa_patch_data",
    description:
      "Patch a data document in OPA using JSON Patch operations (RFC 6902)",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "The data path to patch",
        },
        operations: {
          type: "array",
          description:
            'Array of JSON Patch operations, each with op ("add", "remove", "replace"), path, and optional value',
          items: {
            type: "object",
            properties: {
              op: {
                type: "string",
                enum: ["add", "remove", "replace"],
              },
              path: { type: "string" },
              value: {},
            },
            required: ["op", "path"],
          },
        },
      },
      required: ["path", "operations"],
    },
  },
  {
    name: "opa_delete_data",
    description: "Delete a data document from OPA at the specified path",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "The data path to delete",
        },
      },
      required: ["path"],
    },
  },
];

export async function handleDataTool(
  client: OPAClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "opa_get_data": {
      const path = args.path ? `/${args.path}` : "";
      return client.get(`/data${path}`);
    }

    case "opa_create_data":
      return client.put(`/data/${args.path}`, args.data);

    case "opa_patch_data":
      return client.patch(`/data/${args.path}`, args.operations);

    case "opa_delete_data":
      return client.delete(`/data/${args.path}`);

    default:
      throw new Error(`Unknown data tool: ${name}`);
  }
}
