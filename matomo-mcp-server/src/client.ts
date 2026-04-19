import { MatomoConfig } from "./types.js";

export class MatomoClient {
  private baseUrl: string;
  private token: string;
  public defaultSiteId: string;

  constructor(config: MatomoConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.token = config.token;
    this.defaultSiteId = config.siteId;
  }

  /**
   * Call any Matomo API method.
   * All Matomo API requests go to {baseUrl}/index.php with query params:
   *   module=API&method=Module.action&format=JSON&token_auth=xxx
   * Plus any additional params for the specific method.
   */
  async call(
    method: string,
    params?: Record<string, any>
  ): Promise<any> {
    const url = new URL(`${this.baseUrl}/index.php`);

    // Core params
    url.searchParams.set("module", "API");
    url.searchParams.set("method", method);
    url.searchParams.set("format", "JSON");
    url.searchParams.set("token_auth", this.token);

    // Additional params
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Matomo expects comma-separated for array params like urls[]
            value.forEach((v, i) => {
              url.searchParams.set(`${key}[${i}]`, String(v));
            });
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      }
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Matomo API error ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();

    // Matomo returns { result: "error", message: "..." } on API-level errors
    if (
      data &&
      typeof data === "object" &&
      data.result === "error" &&
      data.message
    ) {
      throw new Error(`Matomo API error: ${data.message}`);
    }

    return data;
  }
}
