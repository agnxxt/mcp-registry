import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { OPAClient } from "../client.js";

export const queryTools: Tool[] = [
  {
    name: "opa_query",
    description:
      "Evaluate a policy decision by POSTing input data to a specific data path in OPA",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            "The data/policy path to query (e.g. 'authz/allow', 'app/rbac')",
        },
        input: {
          type: "object",
          description: "The input document for the policy evaluation",
        },
      },
      required: ["path", "input"],
    },
  },
  {
    name: "opa_compile",
    description:
      "Partially evaluate a query with the compile API, returning simplified residual queries",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "The Rego query to partially evaluate (e.g. 'data.authz.allow == true')",
        },
        input: {
          type: "object",
          description: "Optional input document for partial evaluation",
        },
        unknowns: {
          type: "array",
          description: "List of unknown data references (e.g. [\"input.user\"])",
          items: { type: "string" },
        },
      },
      required: ["query"],
    },
  },
  {
    name: "opa_health",
    description: "Check the health status of the OPA server",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "opa_config",
    description: "Get the active configuration of the OPA server",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
];

export async function handleQueryTool(
  client: OPAClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "opa_query":
      return client.post(`/data/${args.path}`, { input: args.input });

    case "opa_compile": {
      const body: Record<string, unknown> = { query: args.query };
      if (args.input !== undefined) body.input = args.input;
      if (args.unknowns !== undefined) body.unknowns = args.unknowns;
      return client.post("/compile", body);
    }

    case "opa_health":
      return client.get("/health");

    case "opa_config":
      return client.get("/config");

    default:
      throw new Error(`Unknown query tool: ${name}`);
  }
}
