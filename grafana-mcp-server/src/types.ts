export interface GrafanaConfig {
  baseUrl: string;
  apiKey: string;
}

// Dashboard types
export interface Dashboard {
  id?: number;
  uid?: string;
  title: string;
  tags?: string[];
  timezone?: string;
  schemaVersion?: number;
  version?: number;
  panels?: Panel[];
  templating?: { list: TemplateVariable[] };
  time?: { from: string; to: string };
  refresh?: string;
}

export interface Panel {
  id: number;
  type: string;
  title: string;
  gridPos: { h: number; w: number; x: number; y: number };
  targets?: Target[];
  fieldConfig?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export interface Target {
  refId: string;
  datasource?: { type: string; uid: string };
  expr?: string;
  rawSql?: string;
  [key: string]: unknown;
}

export interface TemplateVariable {
  name: string;
  type: string;
  query?: string;
  datasource?: string;
  [key: string]: unknown;
}

export interface DashboardSearchResult {
  id: number;
  uid: string;
  title: string;
  uri: string;
  url: string;
  slug: string;
  type: string;
  tags: string[];
  isStarred: boolean;
  folderId?: number;
  folderUid?: string;
  folderTitle?: string;
  folderUrl?: string;
}

export interface DashboardVersion {
  id: number;
  dashboardId: number;
  parentVersion: number;
  restoredFrom: number;
  version: number;
  created: string;
  createdBy: string;
  message: string;
}

export interface DashboardPermission {
  dashboardId: number;
  created: string;
  updated: string;
  userId?: number;
  userLogin?: string;
  userEmail?: string;
  teamId?: number;
  team?: string;
  role?: string;
  permission: number;
  permissionName: string;
  uid: string;
  title: string;
  slug: string;
  isFolder: boolean;
  url: string;
}

// Datasource types
export interface Datasource {
  id?: number;
  uid?: string;
  orgId?: number;
  name: string;
  type: string;
  typeName?: string;
  access: string;
  url: string;
  password?: string;
  user?: string;
  database?: string;
  basicAuth?: boolean;
  basicAuthUser?: string;
  basicAuthPassword?: string;
  withCredentials?: boolean;
  isDefault?: boolean;
  jsonData?: Record<string, unknown>;
  secureJsonData?: Record<string, unknown>;
  secureJsonFields?: Record<string, boolean>;
  version?: number;
  readOnly?: boolean;
}

// Alert types
export interface AlertRule {
  uid?: string;
  orgID?: number;
  folderUID?: string;
  ruleGroup?: string;
  title?: string;
  condition?: string;
  data?: AlertQuery[];
  noDataState?: string;
  execErrState?: string;
  for?: string;
  annotations?: Record<string, string>;
  labels?: Record<string, string>;
  isPaused?: boolean;
}

export interface AlertQuery {
  refId: string;
  queryType?: string;
  relativeTimeRange?: { from: number; to: number };
  datasourceUid?: string;
  model?: Record<string, unknown>;
}

export interface AlertNotification {
  id: number;
  uid: string;
  name: string;
  type: string;
  isDefault: boolean;
  sendReminder: boolean;
  disableResolveMessage: boolean;
  frequency: string;
  created: string;
  updated: string;
  settings: Record<string, unknown>;
}

// Folder types
export interface Folder {
  id?: number;
  uid?: string;
  title: string;
  url?: string;
  hasAcl?: boolean;
  canSave?: boolean;
  canEdit?: boolean;
  canAdmin?: boolean;
  createdBy?: string;
  created?: string;
  updatedBy?: string;
  updated?: string;
  version?: number;
}

// User types
export interface User {
  id: number;
  email: string;
  name: string;
  login: string;
  theme?: string;
  orgId?: number;
  isGrafanaAdmin?: boolean;
  isDisabled?: boolean;
  isExternal?: boolean;
  authLabels?: string[];
  updatedAt?: string;
  createdAt?: string;
  avatarUrl?: string;
}

export interface OrgUser {
  orgId: number;
  userId: number;
  email: string;
  name: string;
  avatarUrl: string;
  login: string;
  role: string;
  lastSeenAt: string;
  lastSeenAtAge: string;
}

export interface UserSearchResult {
  totalCount: number;
  users: User[];
  page: number;
  perPage: number;
}

// Org types
export interface Org {
  id: number;
  name: string;
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    zipCode?: string;
    state?: string;
    country?: string;
  };
}

// Annotation types
export interface Annotation {
  id?: number;
  alertId?: number;
  dashboardId?: number;
  dashboardUID?: string;
  panelId?: number;
  userId?: number;
  userName?: string;
  newState?: string;
  prevState?: string;
  time?: number;
  timeEnd?: number;
  text?: string;
  metric?: string;
  type?: string;
  tags?: string[];
  data?: Record<string, unknown>;
  created?: number;
  updated?: number;
}

// Query types
export interface DatasourceQuery {
  refId: string;
  datasource?: { type?: string; uid?: string };
  rawSql?: string;
  expr?: string;
  [key: string]: unknown;
}

export interface QueryRequest {
  queries: DatasourceQuery[];
  from?: string;
  to?: string;
}

export interface ApiResponse {
  message?: string;
  id?: number;
  uid?: string;
  [key: string]: unknown;
}
