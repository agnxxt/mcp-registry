import type { Tool } from "../types.js";

export const adminTools: Tool[] = [
  {
    name: "import_data",
    description: "Import SurrealQL data into the database",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "string",
          description: "The SurrealQL import data",
        },
      },
      required: ["data"],
    },
    handler: async (client, args) => {
      const { data } = args as { data: string };
      return client.request("POST", "/import", data, {
        "Content-Type": "text/plain",
      });
    },
  },
  {
    name: "export_data",
    description: "Export all data from the database as SurrealQL",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/export", undefined, {
        Accept: "text/plain",
      });
    },
  },
  {
    name: "health",
    description: "Check the health status of the SurrealDB instance",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/health");
    },
  },
  {
    name: "version",
    description: "Get the version of the SurrealDB instance",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client) => {
      return client.request("GET", "/version");
    },
  },
  {
    name: "signin",
    description: "Sign in to SurrealDB with credentials",
    inputSchema: {
      type: "object",
      properties: {
        user: {
          type: "string",
          description: "Username",
        },
        pass: {
          type: "string",
          description: "Password",
        },
        ns: {
          type: "string",
          description: "Namespace",
        },
        db: {
          type: "string",
          description: "Database",
        },
      },
      required: ["user", "pass", "ns", "db"],
    },
    handler: async (client, args) => {
      const { user, pass, ns, db } = args as {
        user: string;
        pass: string;
        ns: string;
        db: string;
      };
      return client.request("POST", "/signin", { user, pass, ns, db });
    },
  },
];
