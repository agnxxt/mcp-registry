import type { Tool } from "../types.js";

export const tagsTools: Tool[] = [
  {
    name: "list_tags",
    description: "List all tags in Marquez",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/tags");
    },
  },
  {
    name: "create_tag",
    description: "Create or update a tag",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Tag name",
        },
        description: {
          type: "string",
          description: "Tag description",
        },
      },
      required: ["name"],
    },
    handler: async (client, args) => {
      const { name, description } = args as { name: string; description?: string };
      const body: Record<string, unknown> = {};
      if (description !== undefined) body.description = description;
      return client.request("PUT", `/tags/${name}`, body);
    },
  },
];
