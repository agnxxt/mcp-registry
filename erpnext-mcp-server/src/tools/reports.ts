import { AxiosInstance } from "axios";
import { buildQuery, ok, err } from "../client.js";

type GetClient = () => AxiosInstance;

export function registerReportTools(server: any, getClient: GetClient) {
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
  // run_report - GET /method/frappe.desk.query_report.run
  // ═══════════════════════════════════════════════════════════════

  tool("run_report", "Run a Query Report and return its data", {
    type: "object",
    required: ["report_name"],
    properties: {
      report_name: { type: "string", description: "Name of the report to run (e.g. 'General Ledger', 'Accounts Receivable')" },
      filters: { type: "string", description: "JSON object of report filters (e.g. {\"company\":\"My Company\",\"from_date\":\"2024-01-01\"})" },
      limit: { type: "number", description: "Max number of rows to return" },
    },
  }, async ({ report_name, filters, limit }) => {
    const params: Record<string, unknown> = { report_name };
    if (filters) params.filters = filters;
    if (limit !== undefined) params.limit = limit;
    const res = await getClient().get(`/method/frappe.desk.query_report.run${buildQuery(params)}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // get_report_list - GET /resource/Report
  // ═══════════════════════════════════════════════════════════════

  tool("get_report_list", "List available reports with optional filters", {
    type: "object",
    properties: {
      filters: { type: "string", description: "JSON array of filter conditions (e.g. [[\"ref_doctype\",\"=\",\"Sales Order\"]])" },
      fields: { type: "string", description: "JSON array of fields to return" },
      limit_page_length: { type: "number", description: "Number of results (default 20)" },
      order_by: { type: "string", description: "Order by clause" },
    },
  }, async (params) => {
    const res = await getClient().get(`/resource/Report${buildQuery(params)}`);
    return res.data;
  });

  // ═══════════════════════════════════════════════════════════════
  // export_report - GET /method/frappe.desk.query_report.export_query
  // ═══════════════════════════════════════════════════════════════

  tool("export_report", "Export a Query Report in a specified format (returns file URL or data)", {
    type: "object",
    required: ["report_name"],
    properties: {
      report_name: { type: "string", description: "Name of the report to export" },
      filters: { type: "string", description: "JSON object of report filters" },
      file_format_type: { type: "string", description: "Export format: 'Excel' or 'CSV' (default 'Excel')" },
    },
  }, async ({ report_name, filters, file_format_type }) => {
    const params: Record<string, unknown> = { report_name };
    if (filters) params.filters = filters;
    if (file_format_type) params.file_format_type = file_format_type;
    const res = await getClient().get(`/method/frappe.desk.query_report.export_query${buildQuery(params)}`);
    return res.data;
  });
}
