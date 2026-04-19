import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { EvidentlyClient } from "../client.js";

export const snapshotTools: Tool[] = [
  {
    name: "evidently_list_snapshots",
    description: "List all snapshots for an Evidently project",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project ID to list snapshots for",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "evidently_get_snapshot",
    description: "Get a specific snapshot by project ID and snapshot ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project ID",
        },
        snapshot_id: {
          type: "string",
          description: "The snapshot ID",
        },
      },
      required: ["project_id", "snapshot_id"],
    },
  },
  {
    name: "evidently_add_snapshot",
    description: "Add a new snapshot (report) to an Evidently project",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project ID to add the snapshot to",
        },
        report: {
          type: "object",
          description: "The report JSON data to add as a snapshot",
        },
      },
      required: ["project_id", "report"],
    },
  },
  {
    name: "evidently_delete_snapshot",
    description: "Delete a specific snapshot from an Evidently project",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project ID",
        },
        snapshot_id: {
          type: "string",
          description: "The snapshot ID to delete",
        },
      },
      required: ["project_id", "snapshot_id"],
    },
  },
];

export async function handleSnapshotTool(
  client: EvidentlyClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "evidently_list_snapshots":
      return client.get(`/projects/${args.project_id}/snapshots`);

    case "evidently_get_snapshot":
      return client.get(
        `/projects/${args.project_id}/snapshots/${args.snapshot_id}`
      );

    case "evidently_add_snapshot":
      return client.post(
        `/projects/${args.project_id}/snapshots`,
        args.report
      );

    case "evidently_delete_snapshot":
      return client.delete(
        `/projects/${args.project_id}/snapshots/${args.snapshot_id}`
      );

    default:
      throw new Error(`Unknown snapshot tool: ${name}`);
  }
}
