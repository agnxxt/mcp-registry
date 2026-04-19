import type { Tool } from "../types.js";
import { tools as flows } from "./flows.js";
import { tools as components } from "./components.js";
import { tools as folders } from "./folders.js";
import { tools as store } from "./store.js";

export const allTools: Tool[] = [
  ...flows,
  ...components,
  ...folders,
  ...store,
];
