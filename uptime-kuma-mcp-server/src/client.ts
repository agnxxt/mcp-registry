import { UptimeKumaConfig, ApiResponse, LoginResponse } from "./types.js";

export class UptimeKumaClient {
  private baseUrl: string;
  private username: string;
  private password: string;
  private token: string | null = null;

  constructor(config: UptimeKumaConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.username = config.username;
    this.password = config.password;
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.token) return;

    const response = await fetch(`${this.baseUrl}/login/access-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Uptime Kuma login failed ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as LoginResponse;
    this.token = data.token;

    if (!this.token) {
      throw new Error("Uptime Kuma login response did not contain a token");
    }
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      h["Authorization"] = `Bearer ${this.token}`;
    }
    return h;
  }

  async request(
    method: string,
    path: string,
    body?: unknown,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<ApiResponse> {
    await this.ensureAuthenticated();

    const url = new URL(`${this.baseUrl}${path}`);

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const options: RequestInit = {
      method,
      headers: this.headers,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Uptime Kuma API error ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as ApiResponse;
    }

    return { success: true, status: response.status };
  }

  async get(
    path: string,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<ApiResponse> {
    return this.request("GET", path, undefined, queryParams);
  }

  async post(path: string, body?: unknown): Promise<ApiResponse> {
    return this.request("POST", path, body);
  }

  async put(path: string, body?: unknown): Promise<ApiResponse> {
    return this.request("PUT", path, body);
  }

  async delete(path: string): Promise<ApiResponse> {
    return this.request("DELETE", path);
  }
}
