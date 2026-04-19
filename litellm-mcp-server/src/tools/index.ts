import type { Tool } from "../types.js";
import { tools as chat } from "./chat.js";
import { tools as keys } from "./keys.js";
import { tools as models } from "./models.js";
import { tools as teams } from "./teams.js";
import { tools as users } from "./users.js";
import { tools as budgets } from "./budgets.js";
import { tools as spend } from "./spend.js";

export const allTools: Tool[] = [
  ...chat,
  ...keys,
  ...models,
  ...teams,
  ...users,
  ...budgets,
  ...spend,
];
