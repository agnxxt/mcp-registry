import type { LitellmClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "litellm_create_team",
    description: "Create a new team",
    inputSchema: {
      type: "object",
      properties: {
        team_alias: { type: "string", description: "Team alias/name" },
        models: { type: "array", items: { type: "string" }, description: "Models the team can access" },
        max_budget: { type: "number", description: "Max budget for the team" },
        members_with_roles: {
          type: "array",
          description: "Team members with roles",
          items: {
            type: "object",
            properties: {
              role: { type: "string", description: "Role: admin or user" },
              user_id: { type: "string", description: "User ID" },
            },
          },
        },
      },
      required: ["team_alias"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/team/new", args);
    },
  },
  {
    name: "litellm_list_teams",
    description: "List all teams",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: LitellmClient) => {
      return client.get("/team/list");
    },
  },
  {
    name: "litellm_delete_team",
    description: "Delete a team",
    inputSchema: {
      type: "object",
      properties: {
        team_ids: { type: "array", items: { type: "string" }, description: "Team IDs to delete" },
      },
      required: ["team_ids"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/team/delete", args);
    },
  },
  {
    name: "litellm_add_team_member",
    description: "Add a member to a team",
    inputSchema: {
      type: "object",
      properties: {
        team_id: { type: "string", description: "Team ID" },
        member: {
          type: "object",
          description: "Member to add",
          properties: {
            role: { type: "string", description: "Role: admin or user" },
            user_id: { type: "string", description: "User ID" },
          },
          required: ["role", "user_id"],
        },
      },
      required: ["team_id", "member"],
    },
    handler: async (client: LitellmClient, args: Record<string, unknown>) => {
      return client.post("/team/member_add", args);
    },
  },
];
