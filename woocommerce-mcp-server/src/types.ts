export interface WooCommerceConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export interface ApiResponse {
  [key: string]: unknown;
}
