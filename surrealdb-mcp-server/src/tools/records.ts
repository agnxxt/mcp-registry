import type { Tool } from "../types.js";

export const recordsTools: Tool[] = [
  {
    name: "list_records",
    description: "List all records in a table",
    inputSchema: {
      type: "object",
      properties: {
        table: {
          type: "string",
          description: "The table name",
        },
      },
      required: ["table"],
    },
    handler: async (client, args) => {
      const { table } = args as { table: string };
      return client.request("GET", `/key/${table}`);
    },
  },
  {
    name: "get_record",
    description: "Get a specific record by table and ID",
    inputSchema: {
      type: "object",
      properties: {
        table: {
          type: "string",
          description: "The table name",
        },
        id: {
          type: "string",
          description: "The record ID",
        },
      },
      required: ["table", "id"],
    },
    handler: async (client, args) => {
      const { table, id } = args as { table: string; id: string };
      return client.request("GET", `/key/${table}/${id}`);
    },
  },
  {
    name: "create_record",
    description: "Create a new record in a table",
    inputSchema: {
      type: "object",
      properties: {
        table: {
          type: "string",
          description: "The table name",
        },
        data: {
          type: "object",
          description: "The record data to create",
        },
      },
      required: ["table", "data"],
    },
    handler: async (client, args) => {
      const { table, data } = args as { table: string; data: object };
      return client.request("POST", `/key/${table}`, data);
    },
  },
  {
    name: "update_record",
    description: "Replace a record entirely by table and ID",
    inputSchema: {
      type: "object",
      properties: {
        table: {
          type: "string",
          description: "The table name",
        },
        id: {
          type: "string",
          description: "The record ID",
        },
        data: {
          type: "object",
          description: "The complete record data",
        },
      },
      required: ["table", "id", "data"],
    },
    handler: async (client, args) => {
      const { table, id, data } = args as { table: string; id: string; data: object };
      return client.request("PUT", `/key/${table}/${id}`, data);
    },
  },
  {
    name: "patch_record",
    description: "Partially update a record by table and ID",
    inputSchema: {
      type: "object",
      properties: {
        table: {
          type: "string",
          description: "The table name",
        },
        id: {
          type: "string",
          description: "The record ID",
        },
        data: {
          type: "object",
          description: "The partial record data to merge",
        },
      },
      required: ["table", "id", "data"],
    },
    handler: async (client, args) => {
      const { table, id, data } = args as { table: string; id: string; data: object };
      return client.request("PATCH", `/key/${table}/${id}`, data);
    },
  },
  {
    name: "delete_record",
    description: "Delete a record by table and ID",
    inputSchema: {
      type: "object",
      properties: {
        table: {
          type: "string",
          description: "The table name",
        },
        id: {
          type: "string",
          description: "The record ID",
        },
      },
      required: ["table", "id"],
    },
    handler: async (client, args) => {
      const { table, id } = args as { table: string; id: string };
      return client.request("DELETE", `/key/${table}/${id}`);
    },
  },
];
