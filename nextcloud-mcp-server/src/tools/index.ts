import { tools as files } from "./files.js";
import { tools as shares } from "./shares.js";
import { tools as users } from "./users.js";
import { tools as apps } from "./apps.js";

export const allTools = [
  ...files,
  ...shares,
  ...users,
  ...apps,
];
