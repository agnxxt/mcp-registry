export interface ERPNextConfig {
  url: string;
  apiKey: string;
  apiSecret: string;
}

export interface ListParams {
  filters?: string;
  fields?: string;
  order_by?: string;
  limit_start?: number;
  limit_page_length?: number;
}

export interface DocumentIdentifier {
  doctype: string;
  name: string;
}

export interface ReportParams {
  report_name: string;
  filters?: string;
}

export interface WorkflowAction {
  doc: string;
  action: string;
}
