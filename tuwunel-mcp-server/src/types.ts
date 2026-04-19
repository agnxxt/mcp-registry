export interface TuwunelConfig {
  baseUrl: string;
  accessToken?: string;
  username?: string;
  password?: string;
}

export interface ApiResponse {
  [key: string]: unknown;
}

export interface CreateRoomParams {
  name?: string;
  topic?: string;
  preset?: string;
  invite?: string[];
  room_alias_name?: string;
}

export interface SendMessageParams {
  roomId: string;
  body: string;
}

export interface GetMessagesParams {
  roomId: string;
  from?: string;
  dir?: string;
  limit?: number;
  filter?: string;
}

export interface SearchParams {
  search_term: string;
}

export interface SetDisplayNameParams {
  userId: string;
  displayname: string;
}

export interface SetAvatarParams {
  userId: string;
  avatar_url: string;
}

export interface InviteParams {
  roomId: string;
  user_id: string;
}

export interface KickParams {
  roomId: string;
  user_id: string;
  reason?: string;
}

export interface PublicRoomsParams {
  limit?: number;
  generic_search_term?: string;
}

export interface SyncParams {
  since?: string;
  timeout?: number;
  filter?: string;
}

export interface LoginResponse {
  access_token: string;
  user_id: string;
  [key: string]: unknown;
}
