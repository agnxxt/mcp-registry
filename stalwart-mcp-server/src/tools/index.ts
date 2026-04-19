import { tools as accounts } from "./accounts.js";
import { tools as domains } from "./domains.js";
import { tools as queue } from "./queue.js";
import { tools as settings } from "./settings.js";

export const allTools = [
  ...accounts,
  ...domains,
  ...queue,
  ...settings,
];
