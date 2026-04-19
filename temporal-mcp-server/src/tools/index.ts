import type { Tool } from "../types.js";
import { tools as namespaces } from "./namespaces.js";
import { tools as workflows } from "./workflows.js";
import { tools as schedules } from "./schedules.js";
import { tools as taskQueues } from "./task-queues.js";

export const allTools: Tool[] = [
  ...namespaces,
  ...workflows,
  ...schedules,
  ...taskQueues,
];
