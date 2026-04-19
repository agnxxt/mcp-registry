export class NextcloudClient {
  private baseUrl: string;
  private username: string;
  private password: string;

  constructor(url: string, username: string, password: string) {
    this.baseUrl = url.replace(/\/+$/, "");
    this.username = username;
    this.password = password;
  }

  private getAuthHeader(): string {
    return "Basic " + Buffer.from(`${this.username}:${this.password}`).toString("base64");
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: this.getAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /** OCS API helper: adds OCS-APIRequest header, parses ocs.data from response */
  async ocs(path: string, method: string = "GET", body?: any): Promise<any> {
    const headers: Record<string, string> = {
      Authorization: this.getAuthHeader(),
      "OCS-APIRequest": "true",
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const options: RequestInit = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${path}`, options);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Nextcloud OCS error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();
    return data?.ocs?.data ?? data;
  }

  /** WebDAV helper: supports PROPFIND, MKCOL, MOVE, COPY, PUT, DELETE */
  async webdav(
    path: string,
    method: string,
    extraHeaders?: Record<string, string>,
    body?: string | Buffer
  ): Promise<any> {
    const headers: Record<string, string> = {
      Authorization: this.getAuthHeader(),
      ...extraHeaders,
    };

    const options: RequestInit = { method, headers };
    if (body !== undefined) {
      options.body = body;
    }

    const response = await fetch(`${this.baseUrl}${path}`, options);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Nextcloud WebDAV error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("xml") || method === "PROPFIND") {
      return response.text();
    }

    const text = await response.text();
    if (!text) return {};

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  /** Standard REST GET */
  async get(path: string, params?: Record<string, any>): Promise<any> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Nextcloud API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    return response.json();
  }

  getUsername(): string {
    return this.username;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
