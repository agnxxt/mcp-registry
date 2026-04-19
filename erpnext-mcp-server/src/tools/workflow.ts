import { AxiosInstance } from "axios";
import { buildQuery, ok, err } from "../client.js";

type GetClient = () => AxiosInstance;

export function registerWorkflowTools(server: any, getClient: GetClient) {
  const tool = (name: string, desc: string, schema: object, fn: (a: any) => Promise<unknown>) => {
    server.tool(name, desc, schema, async (args: any) => {
      try {
        return ok(await fn(args));
      } catch (e) {
        return err(e);
      }
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // get_workflow - GET /resource/Workflow/{name}
  // ═══════════════════════════════════════════════════════════════

  tool("get_workflow", "Get a Workflow definition by name including states and transitions", {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", description: "Workflow name (e.g. 'Leave Approval')" },
    },
  }, async ({ name }) => {
    const res = await getClient().get(`/resource/Workflow/${encodeURIComponent(name)}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // apply_workflow_action - POST /method/frappe.model.workflow.apply_workflow
  // ═══════════════════════════════════════════════════════════════

  tool("apply_workflow_action", "Apply a workflow action (transition) to a document", {
    type: "object",
    required: ["doc", "action"],
    properties: {
      doc: { type: "string", description: "JSON string of the document (must include doctype and name), e.g. {\"doctype\":\"Leave Application\",\"name\":\"LA-0001\"}" },
      action: { type: "string", description: "Workflow action to apply (e.g. 'Approve', 'Reject')" },
    },
  }, async ({ doc, action }) => {
    const res = await getClient().post("/method/frappe.model.workflow.apply_workflow", {
      doc,
      action,
    });
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_transitions - POST /method/frappe.model.workflow.get_transitions
  // ═══════════════════════════════════════════════════════════════

  tool("get_transitions", "Get available workflow transitions for a document", {
    type: "object",
    required: ["doc"],
    properties: {
      doc: { type: "string", description: "JSON string of the document (must include doctype and name)" },
    },
  }, async ({ doc }) => {
    const res = await getClient().post("/method/frappe.model.workflow.get_transitions", {
      doc,
    });
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // list_workflow_actions - GET /resource/Workflow Action
  // ═══════════════════════════════════════════════════════════════

  tool("list_workflow_actions", "List pending Workflow Action items with optional filters", {
    type: "object",
    properties: {
      filters: { type: "string", description: "JSON array of filter conditions (e.g. [[\"status\",\"=\",\"Open\"]])" },
      fields: { type: "string", description: "JSON array of fields to return" },
      limit_page_length: { type: "number", description: "Number of results (default 20)" },
      order_by: { type: "string", description: "Order by clause" },
    },
  }, async (params) => {
    const res = await getClient().get(`/resource/Workflow Action${buildQuery(params)}`);
    return res.data;
  });
}
