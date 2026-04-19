import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { OPAClient } from "../client.js";

export const policyTools: Tool[] = [
  {
    name: "opa_list_policies",
    description: "List all policies loaded in OPA",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "opa_get_policy",
    description: "Get a specific policy by its ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The policy ID (path-like, e.g. 'example/authz')",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "opa_create_policy",
    description:
      "Create or update a policy in OPA. The policy must be valid Rego source code sent as raw text.",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description:
            "The policy ID (path-like, e.g. 'example/authz')",
        },
        rego: {
          type: "string",
          description:
            "The raw Rego policy source code to upload",
        },
      },
      required: ["id", "rego"],
    },
  },
  {
    name: "opa_delete_policy",
    description: "Delete a policy from OPA by its ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: {
          type: "string",
          description: "The policy ID to delete",
        },
      },
      required: ["id"],
    },
  },
];

export async function handlePolicyTool(
  client: OPAClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "opa_list_policies":
      return client.get("/policies");

    case "opa_get_policy":
      return client.get(`/policies/${args.id}`);

    case "opa_create_policy":
      return client.putRaw(`/policies/${args.id}`, args.rego as string);

    case "opa_delete_policy":
      return client.delete(`/policies/${args.id}`);

    default:
      throw new Error(`Unknown policy tool: ${name}`);
  }
}
