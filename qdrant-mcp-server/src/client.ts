export class QdrantClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    const url = process.env.QDRANT_URL;
    const apiKey = process.env.QDRANT_API_KEY;

    if (!url) {
      throw new Error("Missing required environment variable: QDRANT_URL");
    }

    this.baseUrl = url.replace(/\/+$/, "");
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (apiKey) {
      this.headers["api-key"] = apiKey;
    }
  }

  async request(
    method: string,
    path: string,
    body?: object,
    extraHeaders?: Record<string, string>
  ): Promise<unknown> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = { ...this.headers, ...extraHeaders };

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  }
}
