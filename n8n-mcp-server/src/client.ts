export class N8nClient {
  readonly baseUrl: string;
  private apiKey: string;

  constructor(url: string, apiKey: string) {
    this.baseUrl = url.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private headers(): Record<string, string> {
    return {
      "X-N8N-API-KEY": this.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private endpoint(path: string): string {
    return `${this.baseUrl}/api/v1${path}`;
  }

  async get(path: string, params?: Record<string, string>): Promise<unknown> {
    const url = new URL(this.endpoint(path));
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") url.searchParams.set(k, v);
      });
    }
    const res = await fetch(url.toString(), { headers: this.headers() });
    if (!res.ok) throw new Error(`n8n API ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async post(path: string, body?: unknown): Promise<unknown> {
    const res = await fetch(this.endpoint(path), {
      method: "POST",
      headers: this.headers(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`n8n API ${res.status}: ${await res.text()}`);
    const text = await res.text();
    if (!text) return { success: true };
    return JSON.parse(text);
  }

  async put(path: string, body: unknown): Promise<unknown> {
    const res = await fetch(this.endpoint(path), {
      method: "PUT",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`n8n API ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async patch(path: string, body: unknown): Promise<unknown> {
    const res = await fetch(this.endpoint(path), {
      method: "PATCH",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`n8n API ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async delete(path: string): Promise<unknown> {
    const res = await fetch(this.endpoint(path), {
      method: "DELETE",
      headers: this.headers(),
    });
    if (res.status === 204) return { success: true };
    if (!res.ok) throw new Error(`n8n API ${res.status}: ${await res.text()}`);
    const text = await res.text();
    if (!text) return { success: true };
    return JSON.parse(text);
  }
}
