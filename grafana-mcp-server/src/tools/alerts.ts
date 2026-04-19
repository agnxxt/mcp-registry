import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { GrafanaClient } from "../client.js";

export const alertTools: Tool[] = [
  {
    name: "list_alert_rules",
    description: "List all alert rules (unified alerting / provisioning API)",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_alert_rule",
    description: "Get a specific alert rule by UID",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Alert rule UID" },
      },
      required: ["uid"],
    },
  },
  {
    name: "create_alert_rule",
    description: "Create a new alert rule via the provisioning API",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Alert rule title" },
        folderUID: {
          type: "string",
          description: "UID of the folder to store the rule in",
        },
        ruleGroup: {
          type: "string",
          description: "Name of the rule group",
        },
        condition: {
          type: "string",
          description:
            "The refId of the query or expression that is the alert condition",
        },
        data: {
          type: "array",
          description:
            "Array of alert queries: each with refId, queryType, relativeTimeRange, datasourceUid, model",
          items: {
            type: "object",
            properties: {
              refId: { type: "string" },
              queryType: { type: "string" },
              relativeTimeRange: {
                type: "object",
                properties: {
                  from: { type: "number" },
                  to: { type: "number" },
                },
              },
              datasourceUid: { type: "string" },
              model: { type: "object" },
            },
          },
        },
        noDataState: {
          type: "string",
          enum: ["Alerting", "NoData", "OK"],
          description: "State when no data is returned",
        },
        execErrState: {
          type: "string",
          enum: ["Alerting", "Error", "OK"],
          description: "State when execution error occurs",
        },
        for: {
          type: "string",
          description: "Duration before alert fires (e.g. 5m, 1h)",
        },
        annotations: {
          type: "object",
          description: "Key-value annotations (summary, description, etc.)",
        },
        labels: {
          type: "object",
          description: "Key-value labels for routing",
        },
        isPaused: {
          type: "boolean",
          description: "Whether the alert rule is paused",
        },
      },
      required: ["title", "folderUID", "ruleGroup", "condition", "data"],
    },
  },
  {
    name: "update_alert_rule",
    description: "Update an existing alert rule by UID",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Alert rule UID" },
        title: { type: "string", description: "Alert rule title" },
        folderUID: { type: "string", description: "Folder UID" },
        ruleGroup: { type: "string", description: "Rule group name" },
        condition: { type: "string", description: "Condition refId" },
        data: {
          type: "array",
          description: "Array of alert queries",
          items: { type: "object" },
        },
        noDataState: { type: "string", enum: ["Alerting", "NoData", "OK"] },
        execErrState: { type: "string", enum: ["Alerting", "Error", "OK"] },
        for: { type: "string", description: "Duration before firing" },
        annotations: { type: "object" },
        labels: { type: "object" },
        isPaused: { type: "boolean" },
      },
      required: ["uid"],
    },
  },
  {
    name: "delete_alert_rule",
    description: "Delete an alert rule by UID",
    inputSchema: {
      type: "object" as const,
      properties: {
        uid: { type: "string", description: "Alert rule UID to delete" },
      },
      required: ["uid"],
    },
  },
  {
    name: "list_alert_notifications",
    description: "List all legacy alert notification channels",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
];

export async function handleAlertTool(
  client: GrafanaClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "list_alert_rules":
      return client.get("/v1/provisioning/alert-rules");

    case "get_alert_rule":
      return client.get(`/v1/provisioning/alert-rules/${args.uid}`);

    case "create_alert_rule": {
      const body: Record<string, unknown> = {
        title: args.title,
        folderUID: args.folderUID,
        ruleGroup: args.ruleGroup,
        condition: args.condition,
        data: args.data,
      };
      if (args.noDataState) body.noDataState = args.noDataState;
      if (args.execErrState) body.execErrState = args.execErrState;
      if (args.for) body.for = args.for;
      if (args.annotations) body.annotations = args.annotations;
      if (args.labels) body.labels = args.labels;
      if (args.isPaused !== undefined) body.isPaused = args.isPaused;
      return client.post("/v1/provisioning/alert-rules", body);
    }

    case "update_alert_rule": {
      const uid = args.uid;
      const body: Record<string, unknown> = {};
      if (args.title !== undefined) body.title = args.title;
      if (args.folderUID !== undefined) body.folderUID = args.folderUID;
      if (args.ruleGroup !== undefined) body.ruleGroup = args.ruleGroup;
      if (args.condition !== undefined) body.condition = args.condition;
      if (args.data !== undefined) body.data = args.data;
      if (args.noDataState !== undefined) body.noDataState = args.noDataState;
      if (args.execErrState !== undefined)
        body.execErrState = args.execErrState;
      if (args.for !== undefined) body.for = args.for;
      if (args.annotations !== undefined) body.annotations = args.annotations;
      if (args.labels !== undefined) body.labels = args.labels;
      if (args.isPaused !== undefined) body.isPaused = args.isPaused;
      return client.put(`/v1/provisioning/alert-rules/${uid}`, body);
    }

    case "delete_alert_rule":
      return client.delete(`/v1/provisioning/alert-rules/${args.uid}`);

    case "list_alert_notifications":
      return client.get("/alert-notifications");

    default:
      throw new Error(`Unknown alert tool: ${name}`);
  }
}
