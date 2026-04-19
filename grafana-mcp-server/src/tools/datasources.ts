import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { GrafanaClient } from "../client.js";

export const datasourceTools: Tool[] = [
  {
    name: "list_datasources",
    description: "List all datasources configured in Grafana",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_datasource",
    description: "Get a datasource by its numeric ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Datasource numeric ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "get_datasource_by_name",
    description: "Get a datasource by its name",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Datasource name" },
      },
      required: ["name"],
    },
  },
  {
    name: "create_datasource",
    description: "Create a new datasource",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Datasource name" },
        type: {
          type: "string",
          description:
            "Datasource type (e.g. prometheus, mysql, postgres, influxdb, elasticsearch, loki, graphite)",
        },
        url: { type: "string", description: "Datasource URL" },
        access: {
          type: "string",
          enum: ["proxy", "direct"],
          description: "Access mode: proxy (server) or direct (browser)",
        },
        basicAuth: {
          type: "boolean",
          description: "Enable basic auth",
        },
        basicAuthUser: {
          type: "string",
          description: "Basic auth username",
        },
        basicAuthPassword: {
          type: "string",
          description: "Basic auth password",
        },
        database: {
          type: "string",
          description: "Database name (for SQL datasources)",
        },
        user: {
          type: "string",
          description: "Database user (for SQL datasources)",
        },
        password: {
          type: "string",
          description: "Database password",
        },
        isDefault: {
          type: "boolean",
          description: "Set as default datasource",
        },
        jsonData: {
          type: "object",
          description:
            "Additional JSON data specific to datasource type (e.g. tlsAuth, httpMethod, timeInterval)",
        },
        secureJsonData: {
          type: "object",
          description:
            "Secure JSON data (passwords, tokens) specific to datasource type",
        },
      },
      required: ["name", "type", "url", "access"],
    },
  },
  {
    name: "update_datasource",
    description: "Update an existing datasource by its numeric ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Datasource numeric ID" },
        name: { type: "string", description: "Datasource name" },
        type: { type: "string", description: "Datasource type" },
        url: { type: "string", description: "Datasource URL" },
        access: {
          type: "string",
          enum: ["proxy", "direct"],
          description: "Access mode",
        },
        basicAuth: { type: "boolean", description: "Enable basic auth" },
        basicAuthUser: { type: "string", description: "Basic auth username" },
        basicAuthPassword: {
          type: "string",
          description: "Basic auth password",
        },
        database: { type: "string", description: "Database name" },
        user: { type: "string", description: "Database user" },
        password: { type: "string", description: "Database password" },
        isDefault: {
          type: "boolean",
          description: "Set as default datasource",
        },
        jsonData: {
          type: "object",
          description: "Additional JSON data",
        },
        secureJsonData: {
          type: "object",
          description: "Secure JSON data",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_datasource",
    description: "Delete a datasource by its numeric ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Datasource numeric ID" },
      },
      required: ["id"],
    },
  },
];

export async function handleDatasourceTool(
  client: GrafanaClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_datasources":
      return client.get("/datasources");

    case "get_datasource":
      return client.get(`/datasources/${args.id}`);

    case "get_datasource_by_name":
      return client.get(
        `/datasources/name/${encodeURIComponent(args.name as string)}`
      );

    case "create_datasource": {
      const body: Record<string, unknown> = {
        name: args.name,
        type: args.type,
        url: args.url,
        access: args.access,
      };
      if (args.basicAuth !== undefined) body.basicAuth = args.basicAuth;
      if (args.basicAuthUser) body.basicAuthUser = args.basicAuthUser;
      if (args.basicAuthPassword)
        body.basicAuthPassword = args.basicAuthPassword;
      if (args.database) body.database = args.database;
      if (args.user) body.user = args.user;
      if (args.password) body.password = args.password;
      if (args.isDefault !== undefined) body.isDefault = args.isDefault;
      if (args.jsonData) body.jsonData = args.jsonData;
      if (args.secureJsonData) body.secureJsonData = args.secureJsonData;
      return client.post("/datasources", body);
    }

    case "update_datasource": {
      const id = args.id;
      const body: Record<string, unknown> = {};
      if (args.name !== undefined) body.name = args.name;
      if (args.type !== undefined) body.type = args.type;
      if (args.url !== undefined) body.url = args.url;
      if (args.access !== undefined) body.access = args.access;
      if (args.basicAuth !== undefined) body.basicAuth = args.basicAuth;
      if (args.basicAuthUser !== undefined)
        body.basicAuthUser = args.basicAuthUser;
      if (args.basicAuthPassword !== undefined)
        body.basicAuthPassword = args.basicAuthPassword;
      if (args.database !== undefined) body.database = args.database;
      if (args.user !== undefined) body.user = args.user;
      if (args.password !== undefined) body.password = args.password;
      if (args.isDefault !== undefined) body.isDefault = args.isDefault;
      if (args.jsonData !== undefined) body.jsonData = args.jsonData;
      if (args.secureJsonData !== undefined)
        body.secureJsonData = args.secureJsonData;
      return client.put(`/datasources/${id}`, body);
    }

    case "delete_datasource":
      return client.delete(`/datasources/${args.id}`);

    default:
      throw new Error(`Unknown datasource tool: ${name}`);
  }
}
