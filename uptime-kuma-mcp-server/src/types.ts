export interface UptimeKumaConfig {
  baseUrl: string;
  username: string;
  password: string;
}

export interface ApiResponse {
  [key: string]: unknown;
}

export interface AddMonitorParams {
  type: string;
  name: string;
  url: string;
  interval?: number;
  maxretries?: number;
}

export interface EditMonitorParams {
  id: number;
  type?: string;
  name?: string;
  url?: string;
  interval?: number;
  maxretries?: number;
}

export interface AddStatusPageParams {
  title: string;
  slug: string;
}

export interface AddNotificationParams {
  name: string;
  type: string;
  config: Record<string, unknown>;
}

export interface LoginResponse {
  token: string;
  [key: string]: unknown;
}
