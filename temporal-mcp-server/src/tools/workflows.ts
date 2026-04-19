import type { TemporalClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "temporal_list_workflows",
    description: "List workflow executions in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        query: { type: "string", description: "List filter query" },
        page_size: { type: "number", description: "Page size" },
        next_page_token: { type: "string", description: "Next page token" },
      },
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const params: Record<string, string> = {};
      if (args.query) params.query = String(args.query);
      if (args.page_size) params.page_size = String(args.page_size);
      if (args.next_page_token) params.next_page_token = String(args.next_page_token);
      return client.get(`/namespaces/${ns}/workflows`, params);
    },
  },
  {
    name: "temporal_get_workflow",
    description: "Get details of a specific workflow execution",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        workflow_id: { type: "string", description: "Workflow ID" },
        run_id: { type: "string", description: "Run ID (optional, latest if omitted)" },
      },
      required: ["workflow_id"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const params: Record<string, string> = {};
      if (args.run_id) params.run_id = String(args.run_id);
      return client.get(`/namespaces/${ns}/workflows/${args.workflow_id}`, params);
    },
  },
  {
    name: "temporal_terminate_workflow",
    description: "Terminate a running workflow execution",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        workflow_id: { type: "string", description: "Workflow ID" },
        run_id: { type: "string", description: "Run ID" },
        reason: { type: "string", description: "Termination reason" },
      },
      required: ["workflow_id"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const { namespace: _ns, workflow_id, ...body } = args;
      return client.post(`/namespaces/${ns}/workflows/${workflow_id}/terminate`, body);
    },
  },
  {
    name: "temporal_cancel_workflow",
    description: "Request cancellation of a running workflow",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        workflow_id: { type: "string", description: "Workflow ID" },
        run_id: { type: "string", description: "Run ID" },
      },
      required: ["workflow_id"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const { namespace: _ns, workflow_id, ...body } = args;
      return client.post(`/namespaces/${ns}/workflows/${workflow_id}/cancel`, body);
    },
  },
  {
    name: "temporal_signal_workflow",
    description: "Send a signal to a running workflow",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        workflow_id: { type: "string", description: "Workflow ID" },
        signal_name: { type: "string", description: "Signal name" },
        input: { type: "object", description: "Signal input data" },
      },
      required: ["workflow_id", "signal_name"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const { namespace: _ns, workflow_id, ...body } = args;
      return client.post(`/namespaces/${ns}/workflows/${workflow_id}/signal`, body);
    },
  },
  {
    name: "temporal_query_workflow",
    description: "Query a running workflow",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        workflow_id: { type: "string", description: "Workflow ID" },
        query_type: { type: "string", description: "Query type name" },
        args: { type: "object", description: "Query arguments" },
      },
      required: ["workflow_id", "query_type"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const { namespace: _ns, workflow_id, ...body } = args;
      return client.post(`/namespaces/${ns}/workflows/${workflow_id}/query`, body);
    },
  },
  {
    name: "temporal_get_workflow_history",
    description: "Get event history for a workflow execution",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { type: "string", description: "Namespace (defaults to configured)" },
        workflow_id: { type: "string", description: "Workflow ID" },
        run_id: { type: "string", description: "Run ID" },
        page_size: { type: "number", description: "Page size" },
        next_page_token: { type: "string", description: "Next page token" },
      },
      required: ["workflow_id"],
    },
    handler: async (client: TemporalClient, args: Record<string, unknown>) => {
      const ns = String(args.namespace ?? client.namespace);
      const params: Record<string, string> = {};
      if (args.run_id) params.run_id = String(args.run_id);
      if (args.page_size) params.page_size = String(args.page_size);
      if (args.next_page_token) params.next_page_token = String(args.next_page_token);
      return client.get(`/namespaces/${ns}/workflows/${args.workflow_id}/history`, params);
    },
  },
];
