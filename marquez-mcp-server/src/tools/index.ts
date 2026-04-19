import type { Tool } from "../types.js";
import { namespacesTools } from "./namespaces.js";
import { sourcesTools } from "./sources.js";
import { datasetsTools } from "./datasets.js";
import { jobsTools } from "./jobs.js";
import { runsTools } from "./runs.js";
import { lineageTools } from "./lineage.js";
import { tagsTools } from "./tags.js";

export const allTools: Tool[] = [
  ...namespacesTools,
  ...sourcesTools,
  ...datasetsTools,
  ...jobsTools,
  ...runsTools,
  ...lineageTools,
  ...tagsTools,
];
