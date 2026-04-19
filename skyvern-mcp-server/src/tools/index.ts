import type { Tool } from "../types.js";
import { tools as tasks } from "./tasks.js";
import { tools as workflows } from "./workflows.js";

export const allTools: Tool[] = [
  ...tasks,
  ...workflows,
];
