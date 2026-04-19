import type { Tool } from "../types.js";

export const lineageTools: Tool[] = [
  {
    name: "get_lineage",
    description: "Get the lineage graph for a given node",
    inputSchema: {
      type: "object",
      properties: {
        nodeId: {
          type: "string",
          description: "Node identifier (e.g. dataset:namespace:name or job:namespace:name)",
        },
        depth: {
          type: "number",
          description: "Depth of lineage graph traversal",
        },
      },
      required: ["nodeId"],
    },
    handler: async (client, args) => {
      const { nodeId, depth } = args as { nodeId: string; depth?: number };
      const params: Record<string, string> = { nodeId };
      if (depth !== undefined) params.depth = String(depth);
      return client.request("GET", "/lineage", undefined, params);
    },
  },
];
