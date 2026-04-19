import type { Tool } from "../types.js";
import { tools as processDefinitions } from "./process-definitions.js";
import { tools as processInstances } from "./process-instances.js";
import { tools as userTasks } from "./user-tasks.js";
import { tools as incidents } from "./incidents.js";
import { tools as variables } from "./variables.js";
import { tools as decisions } from "./decisions.js";
import { tools as jobs } from "./jobs.js";

export const allTools: Tool[] = [
  ...processDefinitions,
  ...processInstances,
  ...userTasks,
  ...incidents,
  ...variables,
  ...decisions,
  ...jobs,
];
