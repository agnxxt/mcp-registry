export class MarquezClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    const url = process.env.MARQUEZ_URL;
    const apiKey = process.env.MARQUEZ_API_KEY;

    if (!url) {
      throw new Error("Missing required environment variable: MARQUEZ_URL");
    }

    this.baseUrl = `${url.replace(/\/+$/, "")}/api/v1`;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (apiKey) {
      this.headers["Authorization"] = `Bearer ${apiKey}`;
    }
  }

  async request(
    method: string,
    path: string,
    body?: object,
    queryParams?: Record<string, string>
  ): Promise<unknown> {
    let url = `${this.baseUrl}${path}`;
    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method,
      headers: this.headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  }
}
