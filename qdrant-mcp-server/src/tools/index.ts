import type { Tool } from "../types.js";
import { collectionsTools } from "./collections.js";
import { pointsTools } from "./points.js";
import { searchTools } from "./search.js";
import { snapshotsTools } from "./snapshots.js";
import { clusterTools } from "./cluster.js";

export const allTools: Tool[] = [
  ...collectionsTools,
  ...pointsTools,
  ...searchTools,
  ...snapshotsTools,
  ...clusterTools,
];
