export interface WuzapiConfig {
  baseUrl: string;
  token: string;
}

export interface ApiResponse {
  [key: string]: unknown;
}

export interface SendTextParams {
  phone: string;
  message: string;
}

export interface SendImageParams {
  phone: string;
  image: string;
  caption?: string;
}

export interface SendDocumentParams {
  phone: string;
  document: string;
  filename?: string;
}

export interface SendAudioParams {
  phone: string;
  audio: string;
}

export interface SendVideoParams {
  phone: string;
  video: string;
  caption?: string;
}

export interface SendContactParams {
  phone: string;
  contactPhone: string;
  contactName: string;
}

export interface GetMessagesParams {
  phone: string;
  count?: number;
}

export interface CheckNumberParams {
  phone: string;
}
