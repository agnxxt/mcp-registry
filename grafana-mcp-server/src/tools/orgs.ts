import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { GrafanaClient } from "../client.js";

export const orgTools: Tool[] = [
  {
    name: "list_orgs",
    description: "List all organizations (requires Grafana admin)",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_org",
    description: "Get an organization by its numeric ID (requires Grafana admin)",
    inputSchema: {
      type: "object" as const,
      properties: {
        orgId: { type: "number", description: "Organization numeric ID" },
      },
      required: ["orgId"],
    },
  },
  {
    name: "create_org",
    description: "Create a new organization (requires Grafana admin)",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Organization name" },
      },
      required: ["name"],
    },
  },
  {
    name: "get_current_org",
    description: "Get the current organization for the authenticated user",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
];

export async function handleOrgTool(
  client: GrafanaClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_orgs":
      return client.get("/orgs");

    case "get_org":
      return client.get(`/orgs/${args.orgId}`);

    case "create_org":
      return client.post("/orgs", { name: args.name });

    case "get_current_org":
      return client.get("/org");

    default:
      throw new Error(`Unknown org tool: ${name}`);
  }
}
