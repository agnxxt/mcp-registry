import { TuwunelConfig, ApiResponse, LoginResponse } from "./types.js";

export class TuwunelClient {
  private baseUrl: string;
  private accessToken: string | null;
  private username: string | null;
  private password: string | null;
  private authenticated = false;

  constructor(config: TuwunelConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.accessToken = config.accessToken ?? null;
    this.username = config.username ?? null;
    this.password = config.password ?? null;

    if (this.accessToken) {
      this.authenticated = true;
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.authenticated && this.accessToken) return;

    if (!this.username || !this.password) {
      throw new Error(
        "Tuwunel: No access token provided and no username/password for login"
      );
    }

    const response = await fetch(
      `${this.baseUrl}/_matrix/client/v3/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "m.login.password",
          identifier: {
            type: "m.id.user",
            user: this.username,
          },
          password: this.password,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tuwunel login failed ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as LoginResponse;
    this.accessToken = data.access_token;

    if (!this.accessToken) {
      throw new Error("Tuwunel login response did not contain an access_token");
    }

    this.authenticated = true;
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.accessToken) {
      h["Authorization"] = `Bearer ${this.accessToken}`;
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

    const url = new URL(`${this.baseUrl}/_matrix/client/v3${path}`);

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
      throw new Error(`Tuwunel API error ${response.status}: ${errorText}`);
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
