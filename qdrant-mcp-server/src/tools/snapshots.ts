import type { Tool } from "../types.js";

export const snapshotsTools: Tool[] = [
  {
    name: "list_snapshots",
    description: "List all snapshots of a collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
      },
      required: ["collection"],
    },
    handler: async (client, args) => {
      const { collection } = args as { collection: string };
      return client.request("GET", `/collections/${collection}/snapshots`);
    },
  },
  {
    name: "create_snapshot",
    description: "Create a new snapshot of a collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
      },
      required: ["collection"],
    },
    handler: async (client, args) => {
      const { collection } = args as { collection: string };
      return client.request("POST", `/collections/${collection}/snapshots`);
    },
  },
  {
    name: "delete_snapshot",
    description: "Delete a snapshot from a collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Collection name",
        },
        snapshot_name: {
          type: "string",
          description: "Snapshot name to delete",
        },
      },
      required: ["collection", "snapshot_name"],
    },
    handler: async (client, args) => {
      const { collection, snapshot_name } = args as {
        collection: string;
        snapshot_name: string;
      };
      return client.request(
        "DELETE",
        `/collections/${collection}/snapshots/${snapshot_name}`
      );
    },
  },
];
