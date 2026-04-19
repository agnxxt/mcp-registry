export interface NocoDBConfig {
  baseUrl: string;
  apiToken: string;
}

export interface ListRecordsParams {
  tableId: string;
  fields?: string;
  sort?: string;
  where?: string;
  limit?: number;
  offset?: number;
  viewId?: string;
}

export interface CreateRecordParams {
  tableId: string;
  data: Record<string, unknown>;
}

export interface UpdateRecordParams {
  tableId: string;
  recordId: string;
  data: Record<string, unknown>;
}

export interface BulkCreateRecordsParams {
  tableId: string;
  records: Record<string, unknown>[];
}

export interface CreateTableParams {
  baseId: string;
  table_name: string;
  columns: ColumnDefinition[];
}

export interface UpdateTableParams {
  tableId: string;
  data: Record<string, unknown>;
}

export interface CreateBaseParams {
  title: string;
  sources?: Record<string, unknown>[];
}

export interface ColumnDefinition {
  title: string;
  uidt: string;
  [key: string]: unknown;
}

export interface CreateFieldParams {
  tableId: string;
  title: string;
  uidt: string;
  options?: Record<string, unknown>;
}

export interface CreateViewParams {
  tableId: string;
  title: string;
  type: number;
}

export interface CreateFilterParams {
  viewId: string;
  fk_column_id: string;
  comparison_op: string;
  value: string;
}

export interface CreateSortParams {
  viewId: string;
  fk_column_id: string;
  direction: "asc" | "desc";
}

export interface CreateWebhookParams {
  tableId: string;
  title: string;
  event: string;
  operation: string;
  notification: Record<string, unknown>;
}

export interface ApiResponse {
  [key: string]: unknown;
}
