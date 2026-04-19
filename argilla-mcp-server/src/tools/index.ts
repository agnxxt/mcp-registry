import { tools as workspaces } from "./workspaces.js";
import { tools as datasets } from "./datasets.js";
import { tools as records } from "./records.js";
import { tools as users } from "./users.js";

export const allTools = [
  ...workspaces,
  ...datasets,
  ...records,
  ...users,
];
