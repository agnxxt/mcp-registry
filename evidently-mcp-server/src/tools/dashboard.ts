import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { EvidentlyClient } from "../client.js";

export const dashboardTools: Tool[] = [
  {
    name: "evidently_get_dashboard",
    description: "Get the dashboard for an Evidently project with optional time range filter",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project ID",
        },
        timestamp_start: {
          type: "string",
          description: "Start timestamp for filtering (ISO 8601 format)",
        },
        timestamp_end: {
          type: "string",
          description: "End timestamp for filtering (ISO 8601 format)",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "evidently_list_dashboard_panels",
    description: "List all panels configured on an Evidently project dashboard",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project ID",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "evidently_add_dashboard_panel",
    description: "Add a new panel to an Evidently project dashboard",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project ID",
        },
        title: {
          type: "string",
          description: "Title of the panel",
        },
        type: {
          type: "string",
          description: "Type of the panel (e.g. counter, plot, table)",
        },
        size: {
          type: "number",
          description: "Size of the panel (1 = half width, 2 = full width)",
        },
        values: {
          type: "array",
          description: "Array of value configurations for the panel",
          items: {
            type: "object",
          },
        },
      },
      required: ["project_id", "title", "type"],
    },
  },
];

export async function handleDashboardTool(
  client: EvidentlyClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "evidently_get_dashboard": {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (args.timestamp_start)
        params.timestamp_start = args.timestamp_start as string;
      if (args.timestamp_end)
        params.timestamp_end = args.timestamp_end as string;
      return client.get(`/projects/${args.project_id}/dashboard`, params);
    }

    case "evidently_list_dashboard_panels":
      return client.get(`/projects/${args.project_id}/dashboard/panels`);

    case "evidently_add_dashboard_panel": {
      const body: Record<string, unknown> = {
        title: args.title,
        type: args.type,
      };
      if (args.size !== undefined) body.size = args.size;
      if (args.values !== undefined) body.values = args.values;
      return client.post(
        `/projects/${args.project_id}/dashboard/panels`,
        body
      );
    }

    default:
      throw new Error(`Unknown dashboard tool: ${name}`);
  }
}
